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
      console.error("Erro ao escrever no arquivo:", err);
      return;
    }
    console.log("Os dados foram escritos no arquivo com sucesso!");
  });
};
