import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));

// NO login - straight to the public templates page
await page.goto("http://localhost:3000/templates");
await page.waitForTimeout(4000);
console.log("=== /templates (anonymous) ===");
console.log("URL:", page.url());
console.log("Has 'Choose Your' heading:", (await page.locator("body").innerText()).includes("Choose Your"));

// Category buttons reflect real category values now
const catButtons = await page.locator("button").allTextContents();
console.log("Category-like buttons:", catButtons.filter(t => /minimalist|modern|executive|creative|tech|hybrid|academic|healthcare|finance|compact|all/i.test(t)).slice(0, 15));

await page.goto("http://localhost:3000/templates/7d5e1e56-84d9-4212-aaf6-106ec55d4c19");
await page.waitForTimeout(4000);
console.log("\n=== /templates/[id] (anonymous) ===");
console.log("URL:", page.url());
const bodyText = await page.locator("body").innerText();
console.log("Has 'Use Template' button:", bodyText.includes("Use Template"));
console.log("Has error text:", bodyText.includes("couldn't load") || bodyText.includes("Application error"));

// Click "Use Template" as anonymous -> should redirect to sign-in
await page.getByRole("button", { name: /use template/i }).first().click();
await page.waitForTimeout(2000);
console.log("After clicking Use Template, URL:", page.url());

console.log("\nJS ERRORS:", errors.slice(0, 5));
await browser.close();
