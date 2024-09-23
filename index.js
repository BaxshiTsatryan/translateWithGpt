require("dotenv").config();
const fs = require("fs");
const openai = require("openai");
const openAi = new openai({ apiKey: process.env.API_KEY });

async function getTranslatedText(text, targetLanguage) {
    try {
        const res = await openAi.chat.completions.create({
            model: "gpt-4o",
            messages: [{
                role: "user",
                content: `Переводи "${text}" на ${targetLanguage} язык без лишних текстов, только английский перевод`
            }],
        });
        return res.choices[0].message.content;
    } catch (error) {
        console.error("Error:", error);
    }
}


async function translateTexts(files) {
    for (const file of files) {
        const data = fs.readFileSync(file, "utf-8");
        const texts = JSON.parse(data);

        const translatedRu = {};
        const translatedSp = {};
        const translatedPo = {};
        const translatedGe = {};
        const translatedFr = {};

        for (const key in texts) {
            if (texts.hasOwnProperty(key)) {
                const originalText = texts[key];
                console.log(`Перевод текста с ключом ${key} в файле ${file}...`);

                const translatedToRu = await getTranslatedText(originalText, "русский");
                const translatedToSp = await getTranslatedText(originalText, "испанский");
                const translatedToPo = await getTranslatedText(originalText, "португальский");
                const translatedToGe = await getTranslatedText(originalText, "немецкий");
                const translatedToFr = await getTranslatedText(originalText, "французский");

                translatedRu[key] = translatedToRu || "Ошибка перевода";
                translatedSp[key] = translatedToSp || "Ошибка перевода";
                translatedPo[key] = translatedToPo || "Ошибка перевода";
                translatedGe[key] = translatedToGe || "Ошибка перевода";
                translatedFr[key] = translatedToFr || "Ошибка перевода";
            }
        }

        const fileNameWithoutExtension = file.split(".")[0];
        fs.writeFileSync(`${fileNameWithoutExtension}Ru.json`, JSON.stringify(translatedRu, null, 2), "utf-8");
        fs.writeFileSync(`${fileNameWithoutExtension}Sp.json`, JSON.stringify(translatedSp, null, 2), "utf-8");
        fs.writeFileSync(`${fileNameWithoutExtension}Po.json`, JSON.stringify(translatedPo, null, 2), "utf-8");
        fs.writeFileSync(`${fileNameWithoutExtension}Ge.json`, JSON.stringify(translatedGe, null, 2), "utf-8");
        fs.writeFileSync(`${fileNameWithoutExtension}Fr.json`, JSON.stringify(translatedFr, null, 2), "utf-8");

        console.log(`Переводы для файла ${file} завершены и сохранены.`);
    }
}

const filesToTranslate = ["texts.json", "texts2.json"];

translateTexts(filesToTranslate);