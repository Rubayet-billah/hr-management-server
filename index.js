const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

/*
Naming conventions for APIs
* For Candidates please use the path - '/candidates', '/candidates/:id'
* For Candidates please use the path - '/shortlistedCandidate', '/shortlistedCandidate/:id'
* For Employees please use the path - '/employees', '/employees/:id'
* For Admins please use the path - '/admins', '/admins/:id'
*/

// routes
const eventsRoute = require('./routes/Events');
const adminsRoute = require('./routes/Admins');
const departmentsRoute = require('./routes/Departments');
const candidatesRoute = require('./routes/Candidates');
const employeesRoute = require('./routes/Employees');
const shortlistedCandidateRoute = require('./routes/ShortlistedCandidates');
const firebaseAdminRoute = require('./firebase/firebase.admin');

// Firebase admin sdk
app.use('/firebase', firebaseAdminRoute);

async function run() {
  try {
    // Departments
    app.use('/departments', departmentsRoute);
    // Candidates
    app.use('/candidates', candidatesRoute);
    // Shortlisted candidates
    app.use('/shortlistedCandidate', shortlistedCandidateRoute);
    // Employees
    app.use('/employees', employeesRoute);
    // Admins
    app.use('/admins', adminsRoute);
    // Events
    app.use('/events', eventsRoute);

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
