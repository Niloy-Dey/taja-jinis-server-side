const express = require('express')
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// const http = require("http");
// const { Socket } = require('socket.io');
// const {Server} = http.createServer(app);





//middle ware 
app.use(cors());
app.use(express.json());

// taja-jinis
// sbtBpOt3yMnh7tZG


const uri = "mongodb+srv://taja-jinis:sbtBpOt3yMnh7tZG@cluster0.kg32tqi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// server-side
// const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     }
//   });
  

// io.on("connection", (socket) =>{
//     console.log(socket.id);
    
// })



async function run() {
    try {
        await client.connect();
        // console.log('database connected');
        const productCollection = client.db('taja-jinis').collection('products');
        const ordersCollection = client.db('taja-jinis').collection('orderDetails');
        const reviewCollection = client.db('taja-jinis').collection('review');
        const userCollection = client.db('taja-jinis').collection('users');

      /* socket io coding   */
      app.get('/', (req, res) => {
        res.sendFile(__dirname + '/Chat.js');
      });








        /* get method for all products data loading in UI  */
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query)
            const products = await cursor.toArray();
            res.send(products);

        })

        /* post method for adding new product */
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        //  single data finding for showing 
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        /* post method for orders details */
        app.post('/orderDetails', async (req, res) => {
            const orders = req.body;
            // console.log(orders);
            const newOrder = await ordersCollection.insertOne(orders);
            console.log(newOrder);
            res.send(newOrder);
        })

        app.get('/orderDetails', async (req, res) => {
            const query = {};
            const cursor = ordersCollection.find(query)
            const allOrder = await cursor.toArray();
            res.send(allOrder);
        })

        // Deleting  product  data from admin and farmer
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedData = await productCollection.deleteOne(query);
            res.send(deletedData);
        });

        // Deleting  ordered product data from dashboard
        app.delete('/orderDetails/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            // console.log(query)
            const deletedData = await ordersCollection.deleteOne(query);
            // console.log(deletedData);
            res.send(deletedData);
        });


        /* post method for add review in database */
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        /* Get method for review showing ui */
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray();
            res.send(review);

        })

        // delete review from admin dashboard
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedData = await reviewCollection.deleteOne(query);
            res.send(deletedData);
        });





        /* ==================================================================================== */
        /* Get order details for dashboard  */











        /* user information put process (update data) */
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })


        /* Get method for all user data load and  showing ui */
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query)
            const users = await cursor.toArray();
            res.send(users);

        })



        /* Make a admin from user  */
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            // const requester = req.decoded.email;
            // const requesterAccount = await userCollection.findOne({ email: requester });
            // if (requesterAccount.role === 'admin') {
            const filter = { email: email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        }
        )


        /* get method for admin call */
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin });
        })






    }
    finally {

    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('welcome taja jinis website');
})

app.listen(port, () => {
    console.log(`taja jinis website listening on port ${port}`)
})
