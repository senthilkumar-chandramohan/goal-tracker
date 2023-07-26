import { openai } from "./api.js"

const createFineTune = async () => {
    try {
        const response = await openai.createFineTune({
            training_file: "file-GoqnMwxJnNwFadFFTSEKYmOj",
            model: "davinci" 
        })

        console.log("Response :", response)
    } catch (err) {
        console.log("Error :", err)
    }
}

createFineTune()
