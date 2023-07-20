import express from "express"
import cors from "cors"
import 'dotenv/config'
import { Configuration, OpenAIApi } from "openai"
import gptSampleJsonTemplates from "./utils/gpt_sample_json_templates.js"

const port = process.env.PORT || 4000
const app = express()
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001','https://goaltracker.vercel.app']
}))

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
})
const openai = new OpenAIApi(configuration)

app.get("/hello", async (req, res) => {
    try {
        // const response = await openai.createCompletion({
        //     model: "text-davinci-003",
        //     prompt: `Hello GPT, how are you?`,
        //     max_tokens: 64,
        //     // temperature: 0,
        //     // top_p: 1.0,
        //     // frequency_penalty: 0,
        //     // presence_penalty: 0,
        //     // stop: ["\n"],
        // })

        // console.log(response.data.choices)

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "user", "content": "Who won the world series in 2020?"},
                {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
                {"role": "user", "content": "Where was it played?"}
            ],
        });

        return res.status(200).json({
            success: true,
            // data: response.data.choices[0].text,
            data: response.data.choices[0].message,
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err.response
                ? err.response.data
                : "There was an issue on the server"
        })
    }
})

app.post("/get-tasks", async (req, res) => {
    try {
        const {
            heading,
            deadline,
        } = req.body

        console.log(req.body)

        const gptSampleJSONTemplate = deadline.includes("week") ? gptSampleJsonTemplates.week : gptSampleJsonTemplates.month
        
        const query = `Provide roadmap with time taken for each step and breakdown of tasks to ${heading} in ${deadline}, in below JSON format
        ${gptSampleJSONTemplate}`

        console.log(query)

        // const response = await openai.createCompletion({
        //     model: "davinci:ft-personal-2023-06-30-21-20-23",
        //     prompt: query,
        //     max_tokens: 64,
        //     temperature: 0,
        //     top_p: 1.0,
        //     frequency_penalty: 0,
        //     presence_penalty: 0,
        //     stop: ["\n"],
        // })

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "user", "content": query}
            ],
        });

        console.log(response.data.choices)

        return res.status(200).json({
            success: true,
            // data: response.data.choices[0].text,
            data: response.data.choices[0].message,
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err.response
                ? err.response.data
                : "There was an issue on the server"
        })
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})
