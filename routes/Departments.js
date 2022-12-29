const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// database connection
const client = require('../db/mongodb');
const departmentsCollection = client.db('HrManager').collection('departments');

router.get('/', async (req, res) => {
    const query = {};
    const department = await departmentsCollection.find(query).toArray();
    res.send(department);
});

router.post('/', async (req, res) => {
    const newDepartment = req.body;
    const insertDepartment = await departmentsCollection.insertOne(newDepartment);
    res.send(insertDepartment);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await departmentsCollection.deleteOne(query);
    res.send(result);
});

module.exports = router;