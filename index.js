const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');


const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(300).redirect('/index.html')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})