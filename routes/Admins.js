const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// database connection
const client = require('../db/mongodb');
const adminsCollection = client.db('HrManager').collection('admins');

router.get('/', async (req, res) => {
    const query = {};
    const admins = await adminsCollection.find(query).toArray();
    res.send(admins);
});

router.get('/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email }
    const admin = await adminsCollection.findOne(query);
    res.send(admin)
})

router.post('/', async (req, res) => {
    const admin = req.body;
    const insertAdminResult = await adminsCollection.insertOne(admin);
    res.send(insertAdminResult);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await adminsCollection.deleteOne(query);
    res.send(result);
});

module.exports = router;