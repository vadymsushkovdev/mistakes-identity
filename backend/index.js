const express = require('express')
const axios = require("axios");
const cors = require('cors')
const FormData = require('form-data')

const app = express()
const port = 3020

app.use(cors())
app.use(express.json())

app.post('/', async (req, res) => {
    try{
        const formData = new FormData()

        formData.append('text', req.body.text)
        formData.append('lang', req.body.lang)

        const {data} = await axios.post(`http://35.197.120.214:5000/api/v1/spell`, formData)

        res.send(data)
    }catch (e) {
        res.status(500).send('Something failed!')
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})