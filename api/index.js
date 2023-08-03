import express from "express"
import cors from "cors"
import 'dotenv/config'
import gptSampleJsonTemplates from "./utils/gpt_sample_json_templates.js"

const port = process.env.PORT || 4000
const app = express()
app.use(express.json())
app.use(cors({
    origin: [process.env.CORS_ORIGIN]
}))

app.post("/stream-tasks", async (req, res) => {
  try {
    const {
      heading,
      deadline,
    } = req.body

    const gptSampleJSONTemplate = deadline.includes("week") ? gptSampleJsonTemplates.week : gptSampleJsonTemplates.month
    
    const query = `Provide roadmap with time taken for each step and breakdown of tasks to ${heading} in ${deadline}, in below JSON format
    ${gptSampleJSONTemplate}`
    
    const apiKey = process.env.OPEN_AI_KEY

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "user", "content": query}
        ],
        temperature: 0.7,
        stream: true
      })
    })

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Access-Control-Allow-Origin", "*")
    const reader = response.body.getReader();
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      res.write(value)
    }
    res.end()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      error: "There was an issue on the server"
    })
  }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})