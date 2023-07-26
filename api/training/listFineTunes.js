import { openai } from "./api.js"

const listFineTunes = async () => {
    try {
        const response = await openai.listFineTunes()
        console.log("Data :", response.data.data)
    } catch (err) {
        console.log("Error :", err)
    }
}

listFineTunes()
