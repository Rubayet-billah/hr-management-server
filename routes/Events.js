const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// database connection
const client = require('../db/mongodb');
const eventsCollection = client.db('HrManager').collection('events');

router.get('/', async (req, res) => {
    const query = {};
    const events = await eventsCollection.find(query).toArray();
    res.send(events);
})

router.post('/', async (req, res) => {
    const event = req.body;
    const result = await eventsCollection.insertOne(event);
    res.send(result);
})

router.delete('/:id', async (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    const result = await eventsCollection.deleteOne(query);
    res.send(result);
})

module.exports = router;