import { writeFile } from "fs/promises";
import path from "path";

export const sleep = async (ms = 1000) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const writeJsonToFile = async (data, filename) => {
  await writeFile("./datasets/" + filename, JSON.stringify(data));
};
