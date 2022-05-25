const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3rpud.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('vitaMeals').collection('inventoryItems');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventoryItems = await cursor.toArray();
            res.send(inventoryItems);
        });

        // this route- for get single item
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventoryItem = await inventoryCollection.findOne(query);
            res.send(inventoryItem);
        });

        // POST
        app.post('/inventory', async (req, res) => {
            const newItem = req.body;
            const result = await inventoryCollection.insertOne(newItem);
            res.send(result);
        });

        // DELETE
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        });

        //Update
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updateItem
            };
            const result = await inventoryCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running VitaMeals server!!!');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})