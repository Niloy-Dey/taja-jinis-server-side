const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require('path')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');



//middle ware 
app.use(cors());
app.use(express.json());

// taja-jinis
// sbtBpOt3yMnh7tZG



const uri = "mongodb+srv://taja-jinis:sbtBpOt3yMnh7tZG@cluster0.kg32tqi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

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
