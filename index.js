const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
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
        const reviewsCollection = client.db('gamingStore').collection('reviews');

        //Services DATA
        app.get('/services', async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        });
        
        app.post('/services', async(req, res)=>{
            const addService = req.body;
            const showService = await serviceCollection.insertOne(addService);
            res.send(showService);
        })
        //User Service DATA
        app.get('/myservices', async(req, res)=>{
            let query ={};
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = serviceCollection.find(query)
            .sort({
                time:-1
            })
            const userSer = await cursor.toArray();
            res.send(userSer);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //reviews api
        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async(req, res)=>{
            let query ={};
            if(req.query.service){
                query={
                    service: req.query.service
                }
            }
            const cursor = reviewsCollection.find(query)
            .sort({
                time:-1
            })
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        //User Reviews DATA
        app.get('/myreviews', async(req, res)=>{
            let query ={};
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query)
            .sort({
                time:-1
            })
            const myReview = await cursor.toArray();
            res.send(myReview);
        })

        app.delete('/reviews/:id'), async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
            console.log(result)
        }
    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Example app listening on port', port)
})