import { COINMARKETCAP_URL } from "../constants.mjs";
import { sleep, writeJsonToFile } from "../utils.mjs";

export const extractFromCoinmarketcap = async (browser) => {
  // Timer start
  console.time("coinmarketcap");

  const page = await browser.newPage();
  await page.goto(COINMARKETCAP_URL);

  // First, extracting the tokens page links
  const savedLinks = [];
  for (let tokensTablePage = 1; tokensTablePage < 2; tokensTablePage++) {
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
    savedLinks.push(links[0]);

    // const nextPageSelector = `.next a`;
    // await page.locator(nextPageSelector).click();
    // await page.waitForNavigation();

    // Second extracting token details
    const tokensDetails = [];
    for (let index = 0; index < savedLinks.length; index++) {
      const link = savedLinks[index];
      await page.goto(COINMARKETCAP_URL + link);

      const tokenDetails = await page.evaluate(() => {
        const price = document.querySelector(
          "#section-coin-overview > div.sc-d1ede7e3-0.gNSoet.flexStart.alignBaseline > span"
        )?.innerText;
        const volume = document
          .querySelector(
            "#section-coin-stats > div > dl > div:nth-child(2) > div.sc-d1ede7e3-0.sc-cd4f73ae-0.bwRagp.iWXelA.flexBetween > dd"
          )
          ?.innerText.match(/\$[\d,]+/)[0];
        const marketCap = document
          .querySelector(
            "#section-coin-stats > div > dl > div:nth-child(1) > div.sc-d1ede7e3-0.sc-cd4f73ae-0.bwRagp.iWXelA.flexBetween > dd"
          )
          ?.innerText.match(/\$[\d,]+/)[0];
        const totalSupply = document.querySelector(
          "#section-coin-stats > div > dl > div:nth-child(5) > div > dd"
        )?.innerText;

        let website = document.querySelector(
          "#__next > div.sc-8fab8d8d-1.kYUKSZ.global-layout-v2 > div > div.cmc-body-wrapper > div > div > div.sc-4c05d6ef-0.sc-55349342-0.dlQYLv.gELPTu.coin-stats > div.sc-d1ede7e3-0.jLnhLV > section:nth-child(2) > div > div.sc-d1ede7e3-0.cvkYMS.coin-info-links > div:nth-child(1) > div.sc-d1ede7e3-0.bwRagp > div > div:nth-child(1) > a"
        )?.href;
        if (!website) website = "unknown";

        return { price, volume, marketCap, totalSupply, website };
      });

      tokensDetails.push({ ...tokenDetails, link: COINMARKETCAP_URL + link });

      // Sleeping to avoid being blocked
      await sleep(500);
    }

    // Writing data...
    await writeJsonToFile(tokensDetails, "coinmarketcap-dataset.json");

    // Timer end
    console.timeEnd("coinmarketcap");
  }
};
