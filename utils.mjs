import { writeFile } from "fs/promises";

export const sleep = async (ms = 1000) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const writeJsonToFile = async (data, filename) => {
  await writeFile("./datasets/" + filename, JSON.stringify(data), (err) => {
    if (err) {
      console.error("Error on write:", err);
      return;
    }
    console.log("Success!");
  });
};
