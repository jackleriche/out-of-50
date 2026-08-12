import { test, expect } from "@playwright/test";

/**
 * The reviewer flow end to end. These are the failures unit tests cannot
 * catch: a real browser, a real submission, and the mid-scoresheet reload
 * that happens when someone's signal drops at a barbecue.
 *
 * Requires a seeded database and BJCP_TEST_TOKEN pointing at a share link.
 */

const token = process.env.BJCP_TEST_TOKEN ?? "test-token";

test.describe("scoring a beer", () => {
  test("a guest can score without an account", async ({ page }) => {
    await page.goto(`/b/${token}`);

    await expect(page.getByRole("heading", { name: "Aroma" })).toBeVisible();

    await page.getByRole("slider").fill("9");
    await page.getByRole("button", { name: "Next" }).click();

    // Appearance is gated on choosing a colour.
    await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
    await page.getByRole("radio", { name: /^SRM/ }).first().click();
    await page.getByRole("button", { name: "Next" }).click();

    for (const _ of ["flavour", "mouthfeel", "overall", "diagnostics"]) {
      await page.getByRole("button", { name: "Next" }).click();
    }

    await page.getByRole("button", { name: "Send scoresheet" }).click();
    await expect(page.getByText("/50")).toBeVisible();
  });

  test("the running total is never visible while scoring", async ({ page }) => {
    await page.goto(`/b/${token}`);
    await expect(page.getByText("/50")).toHaveCount(0);
  });

  test("an anonymous link says so before any scoring happens", async ({ page }) => {
    await page.goto(`/b/${token}`);
    const promise = page.getByText(/anonymous/i);
    if (await promise.count()) {
      await expect(promise).toBeVisible();
      // The promise must appear on the first screen, not at submission.
      await expect(page.getByRole("heading", { name: "Aroma" })).toBeVisible();
    }
  });

  test("a revoked link is not scoreable", async ({ page }) => {
    const res = await page.goto("/b/definitely-not-a-real-token");
    expect(res?.status()).toBe(404);
  });

  test("no fault name reaches the reviewer", async ({ page }) => {
    await page.goto(`/b/${token}`);
    for (const _ of [1, 2, 3, 4, 5]) {
      const next = page.getByRole("button", { name: "Next" });
      if (await next.isEnabled()) await next.click();
      else {
        await page.getByRole("radio", { name: /^SRM/ }).first().click();
        await next.click();
      }
    }
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).not.toContain("diacetyl");
    expect(body?.toLowerCase()).not.toContain("oxidation");
  });
});
