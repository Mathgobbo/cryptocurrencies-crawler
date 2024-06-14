import { COINGECKO_URL, NUMBER_OF_PAGES } from "../constants.mjs";
import { sleep, writeJsonToFile } from "../utils.mjs";

export const extractFromCoingecko = async (browser) => {
  // Timer start
  console.time("coingecko");

  const page = await browser.newPage();
  await page.goto(COINGECKO_URL);

  // First, extracting the tokens page links
  const savedLinks = [];
  for (
    let tokensTablePage = 1;
    tokensTablePage <= NUMBER_OF_PAGES;
    tokensTablePage++
  ) {
    // Extract data from page...
    const links = await page.evaluate(() => {
      // Get all anchors in the Table
      const tableAnchors = document.querySelectorAll(
        "table tbody td:nth-child(3) a"
      );
      // Get their href and save
      const tokenPageLinks = [];
      tableAnchors.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        tokenPageLinks.push(href);
      });
      return tokenPageLinks;
    });

    // Save links in an external array
    savedLinks.push(...links);

    const nextPageSelector = `div div nav span a ::-p-text(${
      tokensTablePage + 1
    })`;
    await page.locator(nextPageSelector).click();
    await page.waitForNavigation();
  }

  // Second extracting token details
  const tokensDetails = [];
  for (let index = 0; index < savedLinks.length; index++) {
    const link = savedLinks[index];
    await page.goto(COINGECKO_URL + link);

    const tokenDetails = await page.evaluate(() => {
      const price = document.querySelector(
        "#gecko-coin-page-container > div.tw-col-start-1.\\32 lg\\:tw-row-span-1.\\32 lg\\:tw-pr-6.\\32 lg\\:tw-border-r.tw-border-gray-200.dark\\:tw-border-moon-700.tw-mt-3.\\32 lg\\:tw-mt-0 > div > div.tw-flex-1 > div:nth-child(2) > div.tw-font-bold.tw-text-gray-900.dark\\:tw-text-moon-50.tw-text-3xl.md\\:tw-text-4xl.tw-leading-10 > span"
      )?.innerText;
      const volume = document.querySelector(
        "#gecko-coin-page-container > div.\\32 lg\\:tw-row-span-2.\\32 lg\\:tw-pr-6.\\32 lg\\:tw-border-r.tw-border-gray-200.dark\\:tw-border-moon-700.tw-flex.tw-flex-col > div:nth-child(2) > table > tbody > tr:nth-child(4) > td > span"
      )?.innerText;
      const marketCap = document.querySelector(
        "#gecko-coin-page-container > div.\\32 lg\\:tw-row-span-2.\\32 lg\\:tw-pr-6.\\32 lg\\:tw-border-r.tw-border-gray-200.dark\\:tw-border-moon-700.tw-flex.tw-flex-col > div:nth-child(2) > table > tbody > tr:nth-child(1) > td > span"
      )?.innerText;
      const totalSupply = document.querySelector(
        "#gecko-coin-page-container > div.\\32 lg\\:tw-row-span-2.\\32 lg\\:tw-pr-6.\\32 lg\\:tw-border-r.tw-border-gray-200.dark\\:tw-border-moon-700.tw-flex.tw-flex-col > div:nth-child(2) > table > tbody > tr:nth-child(5) > td"
      )?.innerText;

      let website = document.querySelector(
        "#gecko-coin-page-container > div.\\32 lg\\:tw-row-span-2.\\32 lg\\:tw-pr-6.\\32 lg\\:tw-border-r.tw-border-gray-200.dark\\:tw-border-moon-700.tw-flex.tw-flex-col > div.tw-relative.\\32 lg\\:tw-mb-6.tw-grid.tw-grid-cols-1.tw-divide-y.tw-divide-gray-200.dark\\:tw-divide-moon-700 > div:nth-child(1) > div > div.tw-text-gray-900.dark\\:tw-text-moon-50.tw-font-semibold.tw-text-sm.tw-leading-5.tw-pl-2.tw-text-right > div > a"
      )?.innerText;

      return {
        price: price ?? null,
        volume: volume ?? null,
        marketCap: marketCap ?? null,
        totalSupply: totalSupply ?? null,
        website: website ?? null,
      };
    });

    tokensDetails.push({ ...tokenDetails, link: COINGECKO_URL + link });

    // Sleeping to avoid being blocked
    await sleep(500);
  }

  // Writing data...
  await writeJsonToFile(tokensDetails, "coingecko-dataset.json");

  // Timer end
  console.timeEnd("coingecko");
};
