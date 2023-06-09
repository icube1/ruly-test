import { createWriteStream } from "fs";
import fetch from "node-fetch";
import AdmZip from "adm-zip";
import { xml2js } from "xml-js";
import { performance } from "perf_hooks";
import { memoryUsage } from "process";
import iconv from "iconv-lite";

// Функция для проверки валидности передаваемых параметров
function validateParams(fileUrl, destPath) {
  if (!fileUrl) throw new Error("Invalid fileUrl");
  if (!destPath) throw new Error("Invalid destPath");
}

// Функция для скачивания данных из URL и записи их в файл
async function downloadFile(fileUrl, destPath) {
  await new Promise(function (resolve, reject) {
    fetch(fileUrl)
      .then(function (res) {
        const fileStream = createWriteStream(destPath);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
        res.body.pipe(fileStream);
      })
      .catch((err) => console.log(err));
  });
}

// Функция для распаковки архива zip и чтения содержимого
function extractZipContent(destPath) {
  const zip = AdmZip(destPath);
  const zipItems = zip.getEntries();
  const content = zip.readAsText(zipItems[0].entryName);
  const items = xml2js(content).elements[0].elements;
  return items;
}

// Функция для обработки данных
function processData(items) {
  const data = [];
  items.forEach((element) => {
    if (element.elements.length > 1) {
      const NameP = iconv.decode(
        Buffer.from(element.elements[0].attributes.NameP, "binary"),
        "win1251"
      );
      const BIC = element.attributes.BIC;
      element.elements.shift();

      const accounts = element.elements.reduce((data, el) => {
        if (el.attributes.Account) {
          data.push({
            bic: BIC,
            name: NameP,
            corrAccount: el.attributes.Account,
          });
        }
        return data;
      }, []);

      data.push(...accounts);
    }
  });
  return data;
}

// Основная асинхронная функция для загрузки данных и обработки
async function downloadBic(fileUrl, destPath) {
  validateParams(fileUrl, destPath);
  await downloadFile(fileUrl, destPath);
  const items = extractZipContent(destPath);
  const data = processData(items);
  return data;
}

// Функция для измерения затраченного времени
async function measureTime(callback) {
  const start = performance.now();
  const result = await callback();
  const end = performance.now();
  const time = end - start;
  return { result, time };
}

// Функция для измерения расхода памяти
function measureMemory() {
  const used = memoryUsage().heapUsed / 1024 / 1024;
  return used;
}

// Вызов основной функции и вывод результата на консоль, включая время и память
let path = "./download/bik.zip";
let fileUrl = "https://www.cbr.ru/s/newbik";
const { result, time } = await measureTime(() => downloadBic(fileUrl, path));
const memory = measureMemory();

console.log("Result:", result);
console.log("Time:", time, "ms");
console.log("Memory:", memory, "MB");
