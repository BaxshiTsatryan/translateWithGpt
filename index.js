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
                content: `Translate ‘${text}’ into ${targetLanguage} language with no extra text, only English translation`
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
                console.log(`Translating text with key ${key} in file ${file}...`);

                const translatedToRu = await getTranslatedText(originalText, "russian");
                const translatedToSp = await getTranslatedText(originalText, "spanish");
                const translatedToPo = await getTranslatedText(originalText, "portuguese");
                const translatedToGe = await getTranslatedText(originalText, "german");
                const translatedToFr = await getTranslatedText(originalText, "french");

                translatedRu[key] = translatedToRu || "Translation error";
                translatedSp[key] = translatedToSp || "Translation error";
                translatedPo[key] = translatedToPo || "Translation error";
                translatedGe[key] = translatedToGe || "Translation error";
                translatedFr[key] = translatedToFr || "Translation error";
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