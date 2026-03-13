import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/ui",
    timeout: 30_000,
    use: {
        baseURL: "http://127.0.0.1:4173"
    },
    webServer: {
        command: "npm run dev -- --host 127.0.0.1 --port 4173",
        url: "http://127.0.0.1:4173",
        env: {
            VITE_API_BASE_URL: "/api"
        },
        reuseExistingServer: !process.env.CI
    }
});
