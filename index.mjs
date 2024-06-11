import puppeteer from "puppeteer";
import { extractFromCryptocompare } from "./crawlers/cryptocompare.mjs";

// ========== MAIN FUNCTION ============
const main = async () => {
  const browser = await puppeteer.launch({ headless: false });

  // await extractFromCoingecko(browser);
  // await extractFromCoinmarketcap(browser);
  await extractFromCryptocompare(browser);

  await browser.close();
};

// Executing the main function
main()
  .then(() => {
    console.log("Successfully executed the crawler!");
    process.exit(0);
  })
  .catch((reason) => {
    console.log(reason);
    process.exit(1);
  });
