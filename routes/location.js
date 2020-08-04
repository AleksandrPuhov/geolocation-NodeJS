const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

const dbName = 'locations';
const collectionName = 'user-locations';

const url =
    'mongodb+srv://myTestUser:geLFhDHK7quZX66j@mycluster0.d2n5k.mongodb.net/' +
    dbName +
    '?retryWrites=true&w=majority';

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

router.post('/add-location', async (req, res, next) => {
    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const result = await collection.insertOne({
            address: req.body.address,
            coords: {
                lat: req.body.lat,
                lng: req.body.lng,
            },
        });
        res.json({ message: 'Stored location!', locId: result.insertedId });
    } catch (er) {
        console.log(er);
    } finally {
        await client.close();
    }
});

router.get('/location/:locId', async (req, res, next) => {
    const locationId = req.params.locId;

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const location = await collection.findOne({
            _id: ObjectId(locationId),
        });

        if (!location) {
            return res.status(404).json({ message: 'Not found!' });
        }
        res.json({ address: location.address, coorditates: location.coords });
    } catch (er) {
        console.log(er);
    } finally {
        await client.close();
    }
});

module.exports = router;
