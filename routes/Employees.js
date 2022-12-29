const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// database connection
const client = require('../db/mongodb');
const employeesCollection = client.db('HrManager').collection('employees');


/*---- Employees APIs starts here ----*/
router.get('/', async (req, res) => {
    const query = {};
    const employees = await employeesCollection.find(query).sort({ created_at: -1 }).toArray();
    res.send(employees);
});

router.post('/', async (req, res) => {
    const newEmployee = req.body;
    const newEmployeeWithTimeStamp = { ...newEmployee, created_at: Date.now(), absent: 0 };
    const insertEmployeeResult = await employeesCollection.insertOne(newEmployeeWithTimeStamp);
    res.send(insertEmployeeResult);
});

router.patch('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await employeesCollection.deleteOne(query);
    res.send(result);
});

router.patch('/absent/:id', async (req, res) => {
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

module.exports = router;