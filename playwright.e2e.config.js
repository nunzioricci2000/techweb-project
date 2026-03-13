import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    timeout: 60_000,
    use: {
        baseURL: "http://127.0.0.1:4173"
    },
    webServer: [
        {
            command: "PORT=3100 npm run start --workspace techweb-backend",
            port: 3100,
            reuseExistingServer: !process.env.CI
        },
        {
            command: "npm run dev --workspace @techweb-project/frontend -- --host 127.0.0.1 --port 4173",
            url: "http://127.0.0.1:4173",
            env: {
                VITE_API_BASE_URL: "http://127.0.0.1:3100"
            },
            reuseExistingServer: !process.env.CI
        }
    ]
});
