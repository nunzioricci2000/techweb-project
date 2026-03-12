# Architecture

This repository is a monorepo split into two main application parts:

- **Backend** (`packages/backend`)
- **Frontend** (`packages/frontend`)

Both parts follow a **Clean Architecture** style with the same high-level rule:

> Inner layers (domain/use cases) define interfaces and business rules.  
> Outer layers (frameworks, HTTP, DB, browser, UI) implement those interfaces and are wired in a composition root.

---

## 1. Monorepo structure and architectural intent

At the root, workspaces group internal packages so each feature can be developed as a small module.

- `packages/backend/packages/*`: backend core + backend adapters
- `packages/frontend/packages/*`: frontend core + frontend adapters
- `packages/backend/src/index.js`: backend composition root
- `packages/frontend/src/main.js` + `packages/frontend/src/auth_context.js`: frontend composition root

Each side keeps the same separation:

1. **Core/Application layer**: entities, use cases, interfaces (ports)
2. **Adapters layer**: presenters/controllers, transport APIs, repositories
3. **Infrastructure/Framework layer**: Koa, Sequelize, JWT, Argon2, browser storage, Svelte

---

## 2. Backend architecture (`packages/backend`)

### 2.1 Components

- **Composition root**
	- `src/index.js`
	- Creates concrete services and repositories.
	- Builds use-case factories from `auth-core`.
	- Creates HTTP router from `auth-koa`.
	- Starts Koa server.

- **Application core (auth)**
	- `packages/auth-core`
	- Contains:
		- entities (`entities/user.js`)
		- interfaces/ports (`interfaces/*`)
		- use cases (`use_cases/login_interactor.js`, `use_cases/signup_interactor.js`)
		- business errors (`errors/*`)
	- Exposes factories (`createLoginInteractor`, `createSignupInteractor`) in `src/index.js`.

- **HTTP delivery adapter**
	- `packages/auth-koa`
	- `router.js` receives HTTP requests, builds presenters, executes use cases, and maps errors.
	- Presenters (`presenters/http_*_presenter.js`) adapt use-case responses into HTTP-ready view models.

- **Infrastructure adapters**
	- `packages/persistence`: Sequelize models + `SequelizeUserRepository`
	- `packages/argon2-hash`: hash service implementation
	- `packages/jwt-service`: token service implementation
	- `packages/console-logger`: logger service implementation

- **Additional domain modules (in progress)**
	- `packages/restaurant-core`
	- `packages/review-core`
	- They define domain pieces but are not yet fully wired in the backend app flow.

### 2.2 Backend dependency direction

Dependency flow points **inward**:

- `backend/src/index.js` (framework/composition) depends on:
	- core factories from `auth-core`
	- adapter implementations (`persistence`, `argon2-hash`, `jwt-service`, `console-logger`, `auth-koa`)
- `auth-koa` depends on `auth-core` interfaces/errors, not on DB details.
- `persistence`, `argon2-hash`, `jwt-service` implement core interfaces and depend on external libraries.
- `auth-core` does **not** depend on Koa/Sequelize/JWT/Argon2.

This keeps business logic isolated from transport and persistence concerns.

### 2.3 Backend communication flow (login/signup)

1. Client sends `POST /auth/signup` or `POST /auth/login`.
2. `auth-koa/router.js` reads body and creates presenter + dependency registry.
3. Router invokes interactor from `auth-core`.
4. Interactor executes business rules using:
	 - `UserRepository` port (implemented by Sequelize repository)
	 - `HashService` port
	 - `TokenService` port
	 - `Presenter` port
5. Presenter returns view model (`statusCode`, `body`) to router.
6. Router writes HTTP response on Koa `ctx`.
7. Domain errors are converted by `map_auth_error` to transport-level responses.

---

## 3. Frontend architecture (`packages/frontend`)

### 3.1 Components

- **Composition root**
	- `src/main.js` + `src/auth_context.js`
	- Wires concrete adapters to use-case factories.
	- Creates an `auth` context consumed by Svelte routes.

- **Application core (auth)**
	- `packages/auth-core`
	- Contains entities, interfaces, use cases, and errors.
	- Main use cases:
		- login
		- signup
		- logout
		- get authenticated session

- **Infrastructure/adapters (API + session)**
	- `packages/auth-http`
	- `http_auth_api.js`: HTTP client to backend auth endpoints
	- `browser_session_repository.js`: browser token/session persistence

- **UI presenter layer for Svelte**
	- `packages/auth-svelte`
	- `auth_store.js`: Svelte store with auth state
	- presenters map use-case outputs to state updates for UI consumption

- **UI routes**
	- `src/routes/Login.svelte`
	- `src/routes/Signup.svelte`
	- `src/routes/Home.svelte`
	- Routes call `auth_context` actions; they do not directly implement auth business rules.

### 3.2 Frontend dependency direction

- `src/auth_context.js` depends on package facades (`auth-core`, `auth-http`, `auth-svelte`).
- `auth-core` depends only on interfaces and abstractions.
- `auth-http` and `auth-svelte` depend on `auth-core` contracts to implement ports.
- Svelte route components depend on context/store abstractions, not on HTTP internals.

So the browser UI and transport details stay outside the core use-case logic.

### 3.3 Frontend communication flow

1. User submits login/signup form in route component.
2. Route calls action from `auth_context`.
3. Context executes interactor created from `auth-core`.
4. Interactor calls:
	 - auth API adapter (`auth-http`) for network request
	 - session repository (`auth-http`) for token storage
	 - presenter (`auth-svelte`) for UI-state output
5. Presenter updates auth store.
6. UI reacts to store changes (success/error/authenticated state).
7. On app bootstrap, context hydrates session from browser storage to restore auth state.

---

## 4. How frontend and backend communicate

The system uses **HTTP JSON** as the boundary between the two main parts.

- Frontend `auth-http` calls backend auth endpoints.
- Backend `auth-koa` routes translate HTTP requests into core use-case input.
- Backend presenters produce HTTP response models.
- Frontend adapters parse responses and pass normalized results to frontend use cases/presenters.

This means frontend and backend are independently evolvable as long as endpoint contracts stay aligned.

---

## 5. Summary of current dependency rules

- Core packages define interfaces and use cases.
- Outer packages implement those interfaces.
- Composition roots assemble concrete implementations.
- Domain/application code does not import framework details.
- Communication between frontend and backend is only through HTTP contracts.

---

## 6. Current gaps and inconsistencies (as-is)

The following points describe the **current state** and should be considered during refactoring:

- `ARCHITECTURE.md` was previously empty; this document is now the baseline description.
- `TODO.md` indicates backend/frontend migration/restructuring still in progress.
- In backend auth, there is a naming mismatch between `HashService` expected methods (`hashPassword`, `comparePassword`) and argon2 adapter method names (`hash`, `verify`).
- Some restaurant/review package naming/imports appear inconsistent and those modules are not yet fully integrated into the running app flow.
- Review/restaurant cores are partially scaffolded compared to the auth flow, which is currently the most complete vertical slice.

---

## 7. Practical interpretation

Today, the architecture is best understood as:

- A **fully implemented auth vertical slice** on both backend and frontend using Clean Architecture.
- A **modular monorepo foundation** ready to extend the same pattern to restaurant/review domains.
- A system where composition roots are explicit and dependencies are intentionally inverted toward core interfaces.

