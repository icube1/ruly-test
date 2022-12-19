import fs from "fs";
import fetch from "node-fetch";
import AdmZip from "adm-zip"
import * as convert from "xml-js"

async function downloadBic(fileUrl, destPath) {
    let data = [];

    if (!fileUrl) return Promise.reject(new Error('Invalid fileUrl'));
    if (!destPath) return Promise.reject(new Error('Invalid destPath'));
    console.log('1');
    await new Promise(function (resolve, reject) {
        fetch(fileUrl).then(function (res) {
            const fileStream = fs.createWriteStream(destPath);
            res.body.on('error', reject);
            fileStream.on('finish', resolve);
            res.body.pipe(fileStream);
	    console.log('2');
        });
    }).then(async () => {
        const zip = AdmZip(destPath);
        let zipItems = zip.getEntries();

        let content = zip.readAsText(zipItems[0].entryName);

        let items = await convert.xml2js(content).elements[0].elements;
	console.log('3');
        items.forEach((element) => {

            // Проверка есть ли Account в элементе банка
            if(element.elements.length > 1)
            {
                let NameP = element.elements[0].attributes.NameP;
                let BIC = element.attributes.BIC;

                element.elements.shift();

                element.elements.forEach((element) => {
                    // Проверка на андефайндед Аккаунта, например как у элемента SWBICS
                    if(element.attributes.Account !== undefined)
                    {
                        data.push({
                            bic: BIC,
                            name: NameP,
                            corrAccount: element.attributes.Account
                        });
                    }
                });
            }
        });
    });
    return data;
}

let path = './download/bik.zip';
let fileUrl = 'https://www.cbr.ru/s/newbik'
let data = await downloadBic(fileUrl, path);

console.log(data);

