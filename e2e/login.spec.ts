import { test, expect } from "@playwright/test";

const DEMO_USER = { email: "devhabib2005@gmail.com", password: "12345678" };

test.describe("Login flow", () => {
  // All cases log in as the same seeded demo account against a shared dev
  // backend (login-attempt counters, session cookie), so run them serially
  // rather than let Playwright's default parallel workers race each other.
  test.describe.configure({ mode: "serial" });

  test("logs in with valid credentials and reaches the dashboard", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.getByLabel("Email").fill(DEMO_USER.email);
    await page.getByLabel("Password").fill(DEMO_USER.password);
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText("You are Login Successfully")).toBeVisible({ timeout: 10_000 });

    await page.waitForURL(/\/dashboard/, { timeout: 20_000 });
    expect(page.url()).toContain("/dashboard");

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === "better-auth.session_token");
    expect(sessionCookie).toBeTruthy();
    expect(sessionCookie?.httpOnly).toBe(true);

    // The dashboard must actually render user data, not hang on the loader
    // that the getMe()/signed-cookie regression previously got stuck on.
    await expect(page.getByText("Analyzing your resume...")).not.toBeVisible();
  });

  test("rejects an invalid password and stays on the sign-in page", async ({ page }) => {
    await page.goto("/sign-in");

    await page.getByLabel("Email").fill(DEMO_USER.email);
    await page.getByLabel("Password").fill("definitely-wrong-password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible({ timeout: 10_000 });
    expect(page.url()).toContain("/sign-in");

    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === "better-auth.session_token")).toBeFalsy();
  });

  test("a logged-in session survives a full page reload on the dashboard", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(DEMO_USER.email);
    await page.getByLabel("Password").fill(DEMO_USER.password);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    await page.reload();

    // A broken session cookie would bounce back to /sign-in here.
    await page.waitForTimeout(1500);
    expect(page.url()).toContain("/dashboard");
  });
});
