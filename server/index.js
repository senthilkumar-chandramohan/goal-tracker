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

app.post("/get-tasks", async (req, res) => {
    try {
        const {
            heading,
            deadline,
        } = req.body

        const gptSampleJSONTemplate = deadline.includes("week") ? gptSampleJsonTemplates.week : gptSampleJsonTemplates.month
        
        const query = `Provide roadmap with time taken for each step and breakdown of tasks to ${heading} in ${deadline}, in below JSON format
        ${gptSampleJSONTemplate}`

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "user", "content": query}
            ],
        })

        if (response.status === 200) {
            return res.status(200).json({
                success: true,
                data: response.data.choices[0].message,
            })
        } else {
            return res.status(response.status).json({
                success: false,
            })
        }
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
