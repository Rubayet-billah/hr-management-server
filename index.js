const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors())
app.use(express.json())

// database connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhwsqpg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const candidateCollection = client.db('HrManager').collection('candidates')
const employeesCollection = client.db('HrManager').collection('employees')

/**
Naming conventions for APIs
 * For Candidates please use the path - '/candidates', '/candidates/:id'
 * For Employees please use the path - '/employees', '/employees/:id'
 * For Admins please use the path - '/admins', '/admins/:id'
 */

async function run() {
    try {
        /*
        Candidates API here
        
        */
        /*
        Employees API here
        
        */
        /*
        Admins API here
        
        */
    } catch (error) {
        console.log(error)
    }
}
run().catch()

app.get('/', async (req, res) => {
    res.send('HR Management Server is running fine')
})

app.listen(port, () => {
    console.log(`running fine on port ${port}`)
})