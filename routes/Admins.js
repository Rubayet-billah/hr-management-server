const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// database connection
const client = require('../db/mongodb');
const adminsCollection = client.db('HrManager').collection('admins');

// middlewares
const verifyIsSuperAdmin = async (req, res, next) => {
    const email = req.query.email;
    const isSuperAdmin = await adminsCollection.findOne({ email, isSuperAdmin: true });
    if (!isSuperAdmin) {
        return res.send({ status: 404, message: 'unauthorized access' });
    }
    next();
}

router.get('/', async (req, res) => {
    const query = {};
    const admins = await adminsCollection.find(query).toArray();
    res.send(admins);
});

router.post('/', verifyIsSuperAdmin, async (req, res) => {
    const admin = req.body;
    const insertAdminResult = await adminsCollection.insertOne(admin);
    res.send(insertAdminResult);
});

router.delete('/:id', verifyIsSuperAdmin, async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await adminsCollection.deleteOne(query);
    res.send(result);
});

module.exports = router;