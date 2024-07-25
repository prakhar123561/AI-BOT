const PORT = 8080
const express = require('express')
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())
require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
app.post('/gemini', async function(req, res){
    console.log(req.body.message)
    console.log(req.body.history)
    const model = genAI.getGenerativeModel({ model: "gemini-pro"})
    const chat = model.startChat({
        history: req.body.history
    })
    const msg = req.body.message

    const result = await chat.sendMessage(msg)
    const response = await result.response
    var text = response.text()
    res.send(text)

})

console.log('hi')
app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))
