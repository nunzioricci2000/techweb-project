import { expect, test } from "@playwright/test";

test.describe("frontend UI", () => {
    test("logs in and navigates to home with mocked API", async ({ page }) => {
        await page.route("**/api/auth/login", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ token: "ui-token" })
            });
        });
        await page.route("**/auth/login", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ token: "ui-token" })
            });
        });

        await page.goto("/#/login");
        await page.getByLabel("Username").fill("alice");
        await page.getByLabel("Password").fill("secret");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/#\/home$/);
        await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
        await expect(page.getByText("Token present: yes")).toBeVisible();
    });
});
