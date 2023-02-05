import { test, expect, Page } from "@playwright/test";

const url = "http://localhost:8788/";

const expectPageQuery = async (page: Page, pageQuery: string | number) => {
  await page.waitForURL(/page/);
  const pageUrl = new URL(page.url());
  expect(pageUrl.searchParams.get("page")).toBe(`${pageQuery}`);
};

const goToPage = async (page: Page, pageWithTitle: string) => {
  const pageButton = await page.getByRole("button", {
    name: pageWithTitle,
    exact: true,
  });
  await pageButton.click();
  await expect(page.getByText(`title: ${pageWithTitle}`)).toBeVisible();
};

const movePages = async (page: Page, fromTitle: string, toTitle: string) => {
  const page0Button = async () =>
    page.getByRole("button", { name: fromTitle, exact: true });
  const page1Button = async () =>
    page.getByRole("button", { name: toTitle, exact: true });

  const page0Left = async () => (await (await page0Button()).boundingBox())?.x;
  const page1Left = async () => (await (await page1Button()).boundingBox())?.x;

  const page1LeftBefore = await page1Left();
  const page0LeftBefore = await page0Left();
  const movingLeft = page0LeftBefore! > page1LeftBefore!;

  await (await page1Button()).dragTo(await page0Button());

  const page1LeftAfter = await page1Left();
  const page0LeftAfter = await page0Left();
  if (movingLeft) {
    expect(page1LeftAfter).toBeGreaterThan(page0LeftAfter!);
  } else {
    expect(page0LeftAfter).toBeGreaterThan(page1LeftAfter!);
  }
};

test("go to page", async ({ page }) => {
  await page.goto(url);
  await page.getByRole("button", { name: "Header" }).click();
  const secondPageComment = await page
    .getByText("// The header is everything before any events are defined")
    .isVisible();
  expect(secondPageComment).toBeTruthy();
});

test("move pages left", async ({ page }) => {
  await page.goto(url);
  await movePages(page, "Header", "Welcome to Markwhen 👋");
  await expectPageQuery(page, 3);
});

test("move pages right", async ({ page }) => {
  await page.goto(url);
  await movePages(page, "Welcome to Markwhen 👋", "Header");
});

test("Move current page, is still selected", async ({ page }) => {
  await page.goto(url);
  await goToPage(page, "Events");
  await movePages(page, "Events", "Welcome to Markwhen 👋");
  await expect(page.getByText(`title: Events`)).toBeVisible();
  await expectPageQuery(page, 3);
});

test("New page, is immediately selected", async ({ page }) => {
  await page.goto(url);
  const pageButtons = await page.locator("#pageButtons");
  await pageButtons.evaluate((buttons) => {
    buttons.scrollLeft = buttons.scrollWidth;
  });
  const newPageButton = await page.getByRole("button", {
    name: "Add new page",
  });
  await newPageButton.scrollIntoViewIfNeeded();
  await newPageButton.click();
  await expect(page.getByText(`title: Page 10`)).toBeVisible();
  await expectPageQuery(page, 10);
});

test("Route to page by page index, is selected", async ({ page }) => {
  await page.goto(url + "?page=2");
  await expect(page.getByText(`title: Header`)).toBeVisible();
});

test("Route to page by page title, is selected", async ({ page }) => {
  await page.goto(url + "?page=" + encodeURIComponent("Groups and Sections"));
  await expect(page.getByText(`title: Groups and Sections`)).toBeVisible();
});

test("Route to shared page by page title, is selected", async ({ page }) => {
  await page.goto(
    url + "example?page=" + encodeURIComponent("event descriptions"),
    { waitUntil: "networkidle" }
  );
  await expect(page.getByText(`title: Event Descriptions`)).toBeVisible();
});
