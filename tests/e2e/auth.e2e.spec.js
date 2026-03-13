import { expect, test } from "@playwright/test";

test.describe("auth e2e", () => {
    test("signs up and logs in against real backend", async ({ page }) => {
        const username = `e2e-user-${Date.now()}`;
        const password = "secret";

        await page.goto("/#/signup");
        await page.getByLabel("Username").fill(username);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: "Signup" }).click();

        await expect(page).toHaveURL(/#\/login$/);

        await page.getByLabel("Username").fill(username);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/#\/home$/);
        await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
        await expect(page.getByText("Token present: yes")).toBeVisible();
    });
});
