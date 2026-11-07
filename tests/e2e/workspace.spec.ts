import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("celoht.language", "en"));
});

test("dashboard hydrates without browser errors and retains wallet choices", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/dashboard/");
  await expect(page.getByRole("heading", { name: "Account overview" })).toBeVisible();
  await page.getByRole("button", { name: "Connect wallet" }).first().click();

  const walletDialog = page.getByRole("dialog");
  await expect(walletDialog).toBeVisible();
  await expect(walletDialog.getByRole("button", { name: /^WalletConnect/ })).toBeVisible();
  await expect(walletDialog.getByRole("button", { name: /^Valora App/ })).toBeVisible();
  await expect(walletDialog.getByRole("button", { name: /^MiniPay/ })).toBeVisible();
  await expect(walletDialog.getByRole("button", { name: /^Browser wallet/ })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("mobile navigation opens, dismisses with Escape, and follows a route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.locator('button[aria-controls="mobile-menu"]');
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");

  await menuButton.click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Profile" }).click();
  await expect(page).toHaveURL(/\/profile\/$/);
  await expect(page.getByRole("heading", { name: "Profile", exact: true })).toBeVisible();
});

test("injected wallet connects and disconnects without signing a transaction", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const accounts = ["0x1111111111111111111111111111111111111111"];
    const listeners = new Map<string, Set<(value: unknown) => void>>();
    const provider = {
      isMetaMask: true,
      async request({ method }: { method: string }) {
        if (method === "eth_accounts") return [];
        if (method === "eth_requestAccounts") return accounts;
        if (method === "eth_chainId") return "0xaa044c";
        if (method === "net_version") return "11142220";
        throw new Error(`Test provider does not implement ${method}`);
      },
      on(event: string, listener: (value: unknown) => void) {
        const eventListeners = listeners.get(event) ?? new Set();
        eventListeners.add(listener);
        listeners.set(event, eventListeners);
      },
      removeListener(event: string, listener: (value: unknown) => void) {
        listeners.get(event)?.delete(listener);
      },
    };
    Object.defineProperty(window, "ethereum", { configurable: true, value: provider });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Connect wallet" }).first().click();
  const walletDialog = page.getByRole("dialog");
  await expect(walletDialog).toBeVisible();
  await walletDialog.getByRole("button", { name: /^Browser wallet/ }).click();
  await expect(page.getByRole("button", { name: "Open wallet details" })).toBeVisible();
  await page.getByRole("button", { name: "Disconnect wallet" }).click();
  await expect(page.getByRole("button", { name: "Connect wallet" }).first()).toBeVisible();
  expect(pageErrors).toEqual([]);
});