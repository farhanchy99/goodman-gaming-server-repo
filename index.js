const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config();


//goodmanDbUser
//8U8qKlJhqACMc5Fs

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mar6xi9.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('gamingStore').collection('services');

        app.get('/services', async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
    }
    finally{

    }
}

run().catch(err => console.error(err));



// const categories = require('./data/category.json')
// const data = require ('./data/data.json')

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// app.get('/services', (req, res) =>{
//     res.send(data)
// })
// app.get('/courses/:id', (req, res) =>{
//     const id = req.params.id;
//     const categoryFullDetails = data.filter(
//         (n) => n.id === id
//     );
//     res.send(categoryFullDetails)
// }) 
app.listen(port, () => {
    console.log('Example app listening on port', port)
})