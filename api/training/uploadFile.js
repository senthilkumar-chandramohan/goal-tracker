import { openai } from "./api.js"
import fs from "fs"

const upload = async () => {
    try {
        const response = await openai.createFile(
            fs.createReadStream("./data_prepared.jsonl"),
            "fine-tune"
        )

        console.log("File ID: ", response.data.id)
    } catch (err) {
        //console.log("Error :", err)
    }
}

upload()