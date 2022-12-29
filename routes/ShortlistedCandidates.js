const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// database connection
const client = require('../db/mongodb');
const candidatesCollection = client.db('HrManager').collection('candidates');
const shortlistedCandidatesCollection = client.db('HrManager').collection('shortlistedCandidates');


/*---- Shortlisted Candidates APIs starts here ----*/
router.get('/', async (req, res) => {
    const query = {};
    const shortlistedCandidate = await shortlistedCandidatesCollection.find(query).toArray();
    res.send(shortlistedCandidate);
});

router.post('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const deleteCandidateResult = await shortlistedCandidatesCollection.deleteOne(filter);
    res.send(deleteCandidateResult);
});


module.exports = router;