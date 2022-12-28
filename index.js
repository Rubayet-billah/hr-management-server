const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// database connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhwsqpg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const candidatesCollection = client.db('HrManager').collection('candidates');
const departmentsCollection = client.db('HrManager').collection('departments');
const employeesCollection = client.db('HrManager').collection('employees');
const adminsCollection = client.db('HrManager').collection('admins');
const shortlistedCandidatesCollection = client.db('HrManager').collection('shortlistedCandidates');
const eventsCollection = client.db('HrManager').collection('events');

// ---------------------------------------------
// DELETEING A FIREBASE USER (USING FIREBASE SDK)
// ---------------------------------------------

const admin = require('firebase-admin');
const auth = require('firebase-admin/auth');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
  }),
});

app.get('/firebase/deleteUser/:email', async (req, res) => {
  const email = req.params.email;
  auth
    .getAuth()
    .getUserByEmail(email)
    .then((user) => {
      auth
        .getAuth()
        .deleteUser(user.uid)
        .then(() => {
          res.send({ status: 'success', message: 'User deleted successfully' });
        })
        .catch((error) => {
          res.send({ status: 'error', message: 'Error deleting user' });
        });
    })
    .catch((error) => {
      res.send({ status: 'error', message: 'User not found' });
    });
});

// ---------------------------------------------
// ---------------------------------------------

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
      const query = {};
      const department = await departmentsCollection.find(query).toArray();
      res.send(department);
    });

    app.post('/department', async (req, res) => {
      const newDepartment = req.body;
      const insertDepartment = await departmentsCollection.insertOne(newDepartment);
      res.send(insertDepartment);
    });

    app.delete('/department/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await departmentsCollection.deleteOne(query);
      res.send(result);
    });

    /*--------- Department Api End Here--------- */

    /*---- Candidates APIs starts here ----*/
    app.get('/candidates', async (req, res) => {
      const query = {};
      const candidates = await candidatesCollection.find(query).sort({ created_at: -1 }).toArray();
      res.send(candidates);
    });
    app.post('/candidates', async (req, res) => {
      const newCandidate = req.body;
      const newCandidateWithTimeStamp = { ...newCandidate, created_at: Date.now() };
      const insertCandidateResult = await candidatesCollection.insertOne(newCandidateWithTimeStamp);
      res.send(insertCandidateResult);
    });
    app.delete('/candidates/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const candidateDelete = await candidatesCollection.deleteOne(filter);
      res.send(candidateDelete)
    })
    /*---- Candidates APIs ends here ----*/

    /*---- Shortlisted Candidates APIs starts here ----*/
    app.get('/shortlistedCandidate', async (req, res) => {
      const query = {};
      const shortlistedCandidate = await shortlistedCandidatesCollection.find(query).toArray();
      res.send(shortlistedCandidate);
    });
    app.post('/shortlistedCandidate', async (req, res) => {
      const shortlistedCandidate = req.body;
      const { _id, ...cleanShortlistedCandidate } = shortlistedCandidate;
      const shortlistedCandidateId = shortlistedCandidate._id;
      const filter = { _id: ObjectId(shortlistedCandidateId) };
      const removeCandidateFromMainDB = await candidatesCollection.deleteOne(filter);
      const insertShortlistedCandidateResult = await shortlistedCandidatesCollection.insertOne(
        cleanShortlistedCandidate
      );
      res.send(insertShortlistedCandidateResult);
    });
    app.delete('/shortlistedCandidate/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const deleteCandidateResult = await shortlistedCandidatesCollection.deleteOne(filter);
      res.send(deleteCandidateResult);
    });
    /*---- Shortlisted Candidates APIs ends here ----*/

    /*---- Employees APIs starts here ----*/
    app.get('/employees', async (req, res) => {
      const query = {};
      const employees = await employeesCollection.find(query).sort({ created_at: -1 }).toArray();
      res.send(employees);
    });

    app.post('/employees', async (req, res) => {
      const newEmployee = req.body;
      const newEmployeeWithTimeStamp = { ...newEmployee, created_at: Date.now(), absent: 0 };
      const insertEmployeeResult = await employeesCollection.insertOne(newEmployeeWithTimeStamp);
      res.send(insertEmployeeResult);
    });

    app.patch('/employees', async (req, res) => {
      const employeesUpdateData = req.body;
      const filter = { _id: ObjectId(employeesUpdateData._id) };
      const { _id, ...rest } = employeesUpdateData;
      const employeesCleanUpdateData = rest;

      const updateDoc = {
        $set: {
          ...employeesCleanUpdateData,
          updated_at: Date.now(),
        },
      };
      const result = await employeesCollection.updateOne(filter, updateDoc, { upsert: true });
      res.send(result);
    });

    app.delete('/employees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await employeesCollection.deleteOne(query);
      res.send(result);
    });

    app.patch('/employees/absent/:id', async (req, res) => {
      const id = req.params.id;
      const action = req.query.action;
      const value = req.query.value;
      const filter = { _id: ObjectId(id) };

      console.log(id, action, value);

      if (action === 'increment') {
        const updateDoc = {
          $set: {
            absent: +value + 1,
          },
        };
        const result = await employeesCollection.updateOne(filter, updateDoc, { upsert: true });
        return res.send(result);
      }
      if (action === 'decrement' && +value > 0) {
        const updateDoc = {
          $set: {
            absent: +value - 1,
          },
        };
        const result = await employeesCollection.updateOne(filter, updateDoc, { upsert: true });
        return res.send(result);
      }

      res.send({});
    });

    /*---- Employees APIs ends here ----*/

    /*---- Admins APIs starts here ----*/
    app.get('/admins', async (req, res) => {
      const query = {};
      const admins = await adminsCollection.find(query).toArray();
      res.send(admins);
    });
    app.post('/admins', async (req, res) => {
      const admin = req.body;
      const insertAdminResult = await adminsCollection.insertOne(admin);
      res.send(insertAdminResult);
    });
    app.delete('/admins/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await adminsCollection.deleteOne(query);
      res.send(result);
    });
    /*---- Admins APIs ends here ----*/
  } catch (error) {
    console.log(error);
  }
}
run().catch();

app.get('/', async (req, res) => {
  res.send('HR Management Server is running fine');
});

app.listen(port, () => {
  console.log(`running fine on port ${port}`);
});
