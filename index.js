const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const path = require("path");
require("dotenv").config();
// const SSLCommerzPayment = require('sslcommerz')
const SSLCommerzPayment = require('sslcommerz-lts')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const express = require('express')

require("dotenv").config();

//middle ware
app.use(cors());
app.use(express.json());

// taja-jinis
// sbtBpOt3yMnh7tZG

const uri =
  "mongodb+srv://taja-jinis:sbtBpOt3yMnh7tZG@cluster0.kg32tqi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log('database connected');
    const productCollection = client.db("taja-jinis").collection("products");
    const ordersCollection = client.db("taja-jinis").collection("orderDetails");
    const reviewCollection = client.db("taja-jinis").collection("review");
    const userCollection = client.db("taja-jinis").collection("users");
    const peopleCollection = client.db("taja-jinis").collection("allPeople");
    const completeOrderCollection = client.db("taja-jinis").collection("completeOrder");

    const farmerCollection = client
      .db("taja-jinis")
      .collection("farmerRequest");

    /* get method for all products data loading in UI  */
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    /* post method for adding new product */
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //  single data finding for showing
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    /* post method for orders details */
    app.post("/orderDetails", async (req, res) => {
      const orders = req.body;
      // console.log(orders);
      const newOrder = await ordersCollection.insertOne(orders);
      console.log(newOrder);
      res.send(newOrder);
    });

    app.get("/orderDetails", async (req, res) => {
      const query = {};
      const cursor = ordersCollection.find(query);
      const allOrder = await cursor.toArray();
      res.send(allOrder);
    });

    // Deleting  product  data from admin and farmer
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deletedData = await productCollection.deleteOne(query);
      res.send(deletedData);
    });

    // Deleting  ordered product data from dashboard
    app.delete("/orderDetails/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      // console.log(query)
      const deletedData = await ordersCollection.deleteOne(query);
      // console.log(deletedData);
      res.send(deletedData);
    });

    /* post method for add review in database */
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    /* Get method for review showing ui */
    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    // delete review from admin dashboard
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deletedData = await reviewCollection.deleteOne(query);
      res.send(deletedData);
    });



    // ========================================================
    /* Get method for all user data load and  showing ui */
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    app.post("/user", async (req, res) => {
      const requests = req.body;
      const result = await userCollection.insertOne(requests);
      res.json(result);
    });
    /* ==================================================================================== */
    /* Get order details for dashboard  */

    // Farmer Requests for Dashboard
    app.get("/farmerRequest", async (req, res) => {
      const cursor = farmerCollection.find({});
      const farmerRequests = await cursor.toArray();
      res.send(farmerRequests);
    });

    app.post("/farmerRequest", async (req, res) => {
      const requests = req.body;
      const result = await farmerCollection.insertOne(requests);
      res.json(result);
    });

    app.put("/farmerRequest/:id", async (req, res) => {
      const id = req.params.id;
      const updatedRequest = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedRequest.status,
        },
      };
      const result = await farmerCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });


    // farmer delete request from admin dashboard 
    app.delete("/farmerRequest/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await farmerCollection.deleteOne(query);
      res.json(result);
    });

    /* user information put process (update data) */


    /////Adding All People/////////
    app.post("/allPeople", async (req, res) => {
      const requests = req.body;
      const result = await peopleCollection.insertOne(requests);
      res.json(result);
    });
    app.post("/user", async (req, res) => {
      const requests = req.body;
      const result = await userCollection.insertOne(requests);
      res.json(result);
    });


    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    /* Make a admin from user  */
    app.put("/user/admin/:email", async (req, res) => {
      const email = req.params.email;
      // const requester = req.decoded.email;
      // const requesterAccount = await userCollection.findOne({ email: requester });
      // if (requesterAccount.role === 'admin') {
      const filter = { email: email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    /* get method for admin call */
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    });






/* ----------------------------------------------------------------
      ssl-commerz payment method code start here 
----------------------------------------------------------------- */

//sslcommerz init
app.post('/init', async(req, res) => {
  // console.log(req.body)
  const data = {
      total_amount: req.body.total_amount,
      currency: 'BDT',
      tran_id: 'REF123',
      success_url: 'http://localhost:5000/success',
      fail_url: 'http://localhost:5000/failure',
      cancel_url: 'http://localhost:5000/cancel',
      ipn_url: 'http://localhost:5000/ipn',
      shipping_method: 'Courier',
      product_name: req.body.product_name,
      product_category: 'food',
      product_profile: req.body.product_profile,
      product_image: req.body.product_image,
      cus_name: req.body.cus_name,
      cus_email: req.body.cus_email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
      multi_card_name: 'mastercard',
      value_a: 'ref001_A',
      value_b: 'ref002_B',
      value_c: 'ref003_C',
      value_d: 'ref004_D'
  };
  // console.log(data);
  const sslcommer = new SSLCommerzPayment('tajaj6378ffa9e14bd','tajaj6378ffa9e14bd@ssl',false) //true for live default false for sandbox
  sslcommer.init(data).then(data => {
      //process the response that got from sslcommerz 
      //https://developer.sslcommerz.com/doc/v4/#returned-parameters
      //console.log(data);
      //res.redirect(data.GatewayPageURL)


      // pop up node js  to frot-end  
      if(data?.GatewayPageURL){
        res.json(data?.GatewayPageURL);
      }
      else{
        return res.status(400).json({
          message:"payment session is failed"
        })
      }
  });
})



  app.post('/success', async(req, res)=> {
    // console.log(req.body);
    res.status(200).redirect(`http://localhost:3000/success`);
  });

  app.post('/fail', async(req, res)=> {
    // console.log(req.body);
    res.status(400).redirect(`http://localhost:3000`);
  });
  
  app.post('/cancel', async(req, res)=> {
    // console.log(req.body);
    res.status(200).redirect(`http://localhost:3000`);
  });
  


  







//   //sslcommerz init
// app.get('/init', (req, res) => {
//   const data = {
//       total_amount: 100,
//       currency: 'BDT',
//       tran_id: 'REF123',
//       success_url: 'http://localhost:5000/success',
//       fail_url: 'http://localhost:5000/fail',
//       cancel_url: 'http://localhost:5000/cancel',
//       ipn_url: 'http://yoursite.com/ipn',
//       shipping_method: 'Courier',
//       product_name: 'Computer.',
//       product_category: 'Electronic',
//       product_profile: 'general',
//       cus_name: 'Customer Name',
//       cus_email: 'cust@yahoo.com',
//       cus_add1: 'Dhaka',
//       cus_add2: 'Dhaka',
//       cus_city: 'Dhaka',
//       cus_state: 'Dhaka',
//       cus_postcode: '1000',
//       cus_country: 'Bangladesh',
//       cus_phone: '01711111111',
//       cus_fax: '01711111111',
//       ship_name: 'Customer Name',
//       ship_add1: 'Dhaka',
//       ship_add2: 'Dhaka',
//       ship_city: 'Dhaka',
//       ship_state: 'Dhaka',
//       ship_postcode: 1000,
//       ship_country: 'Bangladesh',
//       multi_card_name: 'mastercard',
//       value_a: 'ref001_A',
//       value_b: 'ref002_B',
//       value_c: 'ref003_C',
//       value_d: 'ref004_D'
//   };
//   const sslcommer = new SSLCommerzPayment('tajaj6378ffa9e14bd', 'tajaj6378ffa9e14bd@ssl',false) //true for live default false for sandbox
//   sslcommer.init(data).then(data => {
//       //process the response that got from sslcommerz 
//       //https://developer.sslcommerz.com/doc/v4/#returned-parameters

//     res.redirect(data.GatewayPageURL);
//   });
// })

// app.post('/success', async(req, res)=> {
//   console.log(req.body);
//   res.status(200).json(req.body);
// });


// app.post('/fail', async(req, res)=> {
//   console.log(req.body);
//   res.status(400).json(req.body);
// });

// app.post('/cancel', async(req, res)=> {
//   console.log(req.body);
//   res.status(200).json(req.body);
// });


  } 
  finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome taja jinis website");
});

app.listen(port, () => {
  console.log(`taja jinis website listening on port ${port}`);
});

module.exports = app;