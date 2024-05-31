import puppeteer from "puppeteer";

// Object with Websites and keys
const WEBSITES = {
  0: "https://coinmarketcap.com/pt-br/",
  1: "https://www.coingecko.com/pt",
  2: "https://www.cryptocompare.com/",
};

// ========== MAIN FUNCTION ============
const main = async () => {
  const browser = await puppeteer.launch();

  // TO DO
  // Create a function for each website and get the data

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
