const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('working')
})

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpqcv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(url);

client.connect(err => {
    const routineCollection = client.db("cse").collection("routine");
    const noticeCollection = client.db("cse").collection("notice");
    const classLinkCollection = client.db("cse").collection("classLink");
    const resourceCollection = client.db("cse").collection("resource");
    const adminCollection = client.db("cse").collection("admin");
      
      // add routine
      app.post('/add-routine', (req, res) => {
          const routine = req.body;
          routineCollection.insertOne(routine)
          .then(result => console.log(result.insertedCount))
          res.send(result.insertedCount > 0)
      })
      // make admin
      app.post('/make-a-admin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
        .then(result => console.log(result.insertedCount))
        res.send(result.insertedCount > 0)
    })

    // get admin
    app.get('/admin/:email', (req, res) => {
        adminCollection.find({email: req.params.email})
        .toArray((err, items) => {
            res.send(items);
            //console.log(items);
        })
      })

      // add notice
      app.post('/add-notice', (req, res) => {
        const notice = req.body;
        noticeCollection.insertOne(notice)
        .then(result => console.log(result.insertedCount))
        res.send(result.insertedCount > 0)
    })

    // add class link
    app.post('/add-class-link', (req, res) => {
        const classLink = req.body;
        classLinkCollection.insertOne(classLink)
        .then(result => console.log(result.insertedCount))
        res.send(result.insertedCount > 0)
    })

    // add resource link
    app.post('/add-resource', (req, res) => {
        const resource = req.body;
        resourceCollection.insertOne(resource)
        .then(result => console.log(result.insertedCount))
        res.send(result.insertedCount > 0)
    })

    // get class routine
    app.get('/routine', (req, res) => {
        routineCollection.find()
        .toArray((err, items) => {
            res.send(items);
            // console.log(items);
        })
    })

    // update routine
    app.patch('/update-routine/:id', (req, res) => {
        console.log(req.body.class1);
        routineCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {class1: req.body.class1, class2: req.body.class2, class3: req.body.class3, class4: req.body.class4, class5: req.body.class5, class6: req.body.class6, time1: req.body.time1, time2: req.body.time2, time3: req.body.time3, time4: req.body.time4, time5: req.body.time5, time6: req.body.time6}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })

    // get resource
    app.get('/resource-link', (req, res) => {
        resourceCollection.find()
        .toArray((err, items) => {
            res.send(items);
            // console.log(items);
        })
    })

    // delete resource link
    app.delete('/delete-resource-link/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        resourceCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(!!documents.value));
        
      })

    // get class link
    app.get('/class-link', (req, res) => {
        classLinkCollection.find()
        .toArray((err, items) => {
            res.send(items);
            // console.log(items);
        })
    })

    // update class link
    app.patch('/update-class-link/:id', (req, res) => {
        console.log(req.body.class1);
        classLinkCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {classLink: req.body.classLink}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })

    // delete class link
    app.delete('/delete-class-link/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        classLinkCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(!!documents.value));
        
      })

    // get notice
    app.get('/notice', (req, res) => {
        noticeCollection.find()
        .toArray((err, items) => {
            res.send(items);
            // console.log(items);
        })
    })

    // delete notice
    app.delete('/delete-notice/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        noticeCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(!!documents.value));
        
      })
  });
  

app.listen(port, ()=>{
    console.log('Listening');
})