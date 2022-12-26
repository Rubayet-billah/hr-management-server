const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors())
app.use(express.json())

// database connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhwsqpg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const candidatesCollection = client.db('HrManager').collection('candidates')
const departmentsCollection = client.db('HrManager').collection('departments')
const employeesCollection = client.db('HrManager').collection('employees')
const adminsCollection = client.db('HrManager').collection('admins')
const shortlistedCandidatesCollection = client.db('HrManager').collection('shortlistedCandidates')

/*
Naming conventions for APIs
 * For Candidates please use the path - '/candidates', '/candidates/:id'
 * For Candidates please use the path - '/shortlistedCandidate', '/shortlistedCandidate/:id'
 * For Employees please use the path - '/employees', '/employees/:id'
 * For Admins please use the path - '/admins', '/admins/:id'
 */

async function run() {
    try {
        /*------Department APIs start here ------- */
        app.get('/department', async (req, res) => {
            const query = {}
            const department = await departmentsCollection.find(query).toArray()
            res.send(department)
        })

        app.post('/department', async (req, res) => {
            const newDepartment = req.body;
            const insertDepartment = await departmentsCollection.insertOne(newDepartment);
            res.send(insertDepartment)
        })

        app.delete('/department/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await departmentsCollection.deleteOne(query);
            res.send(result)
        })

        /*--------- Department Api End Here--------- */


        /*---- Candidates APIs starts here ----*/
        app.get('/candidates', async (req, res) => {
            const query = {}
            const candidates = await candidatesCollection.find(query).sort({ applyDate: -1 }).toArray()
            res.send(candidates)
        })
        app.post('/candidates', async (req, res) => {
            const newCandidate = req.body;
            const insertCandidateResult = await candidatesCollection.insertOne(newCandidate);
            res.send(insertCandidateResult)
        })
        /*---- Candidates APIs ends here ----*/

        /*---- Shortlisted Candidates APIs starts here ----*/
        app.get('/shortlistedCandidate', async (req, res) => {
            const query = {};
            const shortlistedCandidate = await shortlistedCandidatesCollection.find(query).sort({ applyDate: -1 }).toArray();
            res.send(shortlistedCandidate)
        })
        app.post('/shortlistedCandidate', async (req, res) => {
            const shortlistedCandidate = req.body;
            const shortlistedCandidateId = shortlistedCandidate._id;
            const filter = { _id: ObjectId(shortlistedCandidateId) }
            const removeCandidateFromMainDB = await candidatesCollection.deleteOne(filter);
            const insertShortlistedCandidateResult = await shortlistedCandidatesCollection.insertOne(shortlistedCandidate);
            res.send(insertShortlistedCandidateResult);
        })
        /*---- Shortlisted Candidates APIs ends here ----*/

        /*---- Employees APIs starts here ----*/
        app.get('/employees', async (req, res) => {
            const query = {};
            const employees = await employeesCollection.find(query).toArray();
            res.send(employees);
        })
        app.post('/employees', async (req, res) => {
            const newEmployee = req.body;
            const insertEmployeeResult = await employeesCollection.insertOne(newEmployee);
            res.send(insertEmployeeResult);
        })
        /*---- Employees APIs ends here ----*/

        /*---- Admins APIs starts here ----*/
        app.get('/admins', async (req, res) => {
            const query = {};
            const admins = await adminsCollection.find(query).toArray();
            res.send(admins)
        })
        app.post('/admins', async (req, res) => {
            const admin = req.body;
            const insertAdminResult = await adminsCollection.insertOne(admin)
            res.send(insertAdminResult);
        })
        app.delete('/admins/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminsCollection.deleteOne(query);
            res.send(result);
        })
        /*---- Admins APIs ends here ----*/


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