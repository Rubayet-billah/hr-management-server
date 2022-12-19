const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors())
app.use(express.json())



app.get('/', async (req, res) => {
    res.send('HR Management Server is running fine')
})

app.get('/app', async (req, res) => {
    res.send('app route hit ')
})

app.listen(port, () => {
    console.log(`running fine on port ${port}`)
})