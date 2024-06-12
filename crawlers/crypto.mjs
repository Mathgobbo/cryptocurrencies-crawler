import { CRYPTO_URL, NUMBER_OF_PAGES } from "../constants.mjs";
import { sleep, writeJsonToFile } from "../utils.mjs";

export const extractFromCrypto = async (browser) => {
  // Timer start
  console.time("crypto");

  const page = await browser.newPage();
  await page.goto(CRYPTO_URL);

  // First, extracting the tokens page links
  const savedLinks = [];
  for (
    let tokensTablePage = 1;
    tokensTablePage <= NUMBER_OF_PAGES * 2; // *2 because crypto has 50 items on table
    tokensTablePage++
  ) {
    // Sleeping to avoid being blocked
    await sleep(5000);

    // Extract data from page...
    const links = await page.evaluate(async () => {
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

    const nextPageSelector = "[data-testid='next']";
    await page.locator(nextPageSelector).click();
  }

  // Second extracting token details
  const tokensDetails = [];
  for (let index = 0; index < savedLinks.length; index++) {
    const link = savedLinks[index];
    await page.goto(CRYPTO_URL.replace("/price", "") + link);

    const tokenDetails = await page.evaluate(() => {
      const price = document.querySelector(
        "#__next > div.css-bl4fde > div > div > div.css-4u6nh8 > div.css-1s4mo45 > div.chakra-stack.coin-chart.css-1p05f2v > div.chakra-stack.css-l991e7 > div > div.chakra-stack.css-porbmv > h2 > span"
      )?.innerText;
      const volume = document.querySelector(
        "#__next > div.css-bl4fde > div > div > div.css-4u6nh8 > div.css-1s4mo45 > div.chakra-stack.coin-chart.css-1p05f2v > div.css-7zicxd > div:nth-child(2) > p"
      )?.innerText;
      const marketCap = document.querySelector(
        "#__next > div.css-bl4fde > div > div > div.css-4u6nh8 > div.css-1s4mo45 > div.chakra-stack.coin-chart.css-1p05f2v > div.css-7zicxd > div:nth-child(1) > p"
      )?.innerText;
      const totalSupply = document.querySelector(
        "#__next > div.css-bl4fde > div > div > div.css-4u6nh8 > div.css-1s4mo45 > div.chakra-stack.coin-chart.css-1p05f2v > div.css-7zicxd > div.css-1o5ox1r > p"
      )?.innerText;

      let website = document.querySelector(
        "[data-testid='websiteLinksBtn']"
      )?.href;

      return {
        price: price ?? null,
        volume: volume ?? null,
        marketCap: marketCap ?? null,
        totalSupply: marketCap ?? null,
        website: website ?? null,
      };
    });

    tokensDetails.push({ ...tokenDetails, link: CRYPTO_URL + link });

    // Sleeping to avoid being blocked
    await sleep(500);
  }

  // Writing data...
  await writeJsonToFile(tokensDetails, "crypto-dataset.json");

  // Timer end
  console.timeEnd("crypto");
};
