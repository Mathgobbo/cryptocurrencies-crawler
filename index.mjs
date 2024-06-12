import puppeteer from "puppeteer";
import { extractFromCoingecko } from "./crawlers/coingecko.mjs";
import { extractFromCoinmarketcap } from "./crawlers/coinmarketcap.mjs";
import { extractFromCrypto } from "./crawlers/crypto.mjs";

// ========== MAIN FUNCTION ============
const main = async () => {
  const browser = await puppeteer.launch({ headless: false });

  await extractFromCrypto(browser);
  await extractFromCoingecko(browser);
  await extractFromCoinmarketcap(browser);

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
