const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

// JSON Web Token Implemented
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Unauthorized access')
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send('forbidden access')
    }
    req.decoded = decoded;
    next();
  })
}


// routes
const eventsRoute = require("./routes/Events");
const adminsRoute = require("./routes/Admins");
const departmentsRoute = require("./routes/Departments");
const candidatesRoute = require("./routes/Candidates");
const employeesRoute = require("./routes/Employees");
const holidaysRoute = require("./routes/Holidays");
const shortlistedCandidateRoute = require("./routes/ShortlistedCandidates");
const firebaseAdminRoute = require("./firebase/firebase.admin");

// Firebase admin sdk
app.use("/firebase", firebaseAdminRoute);

async function run() {
  try {
    // Departments
    app.use("/departments", departmentsRoute);
    // Candidates
    app.use("/candidates", candidatesRoute);
    // Shortlisted candidates
    app.use("/shortlistedCandidate", shortlistedCandidateRoute);
    // Employees
    app.use("/employees", employeesRoute);
    // Admins
    app.use("/admins", adminsRoute);
    // Events
    app.use("/events", eventsRoute);
    // Holidays
    app.use("/holidays", holidaysRoute);
  } catch (error) {
    verifyJWT()
    console.log(error);
  }
}
run().catch();

app.get("/", async (req, res) => {
  res.send("HR Management Server is running fine");
});

app.listen(port, () => {
  console.log(`running fine on port ${port}`);
});
