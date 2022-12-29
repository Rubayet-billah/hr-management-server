const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// database connection
const client = require('../db/mongodb');
const candidatesCollection = client.db('HrManager').collection('candidates');

router.get('/', async (req, res) => {
    const query = {};
    const candidates = await candidatesCollection.find(query).sort({ created_at: -1 }).toArray();
    res.send(candidates);
});

router.post('/', async (req, res) => {
    const newCandidate = req.body;
    const newCandidateWithTimeStamp = { ...newCandidate, created_at: Date.now() };
    const insertCandidateResult = await candidatesCollection.insertOne(newCandidateWithTimeStamp);
    res.send(insertCandidateResult);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) }
    const candidateDelete = await candidatesCollection.deleteOne(filter);
    res.send(candidateDelete)
})

module.exports = router;