const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require("cors")
require('dotenv').config();

const app = express()
const port = process.env.PORT

const client = new MongoClient(process.env.FINAL_URL)

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(300).redirect('/index.html')
})

app.get('/recipes', async (req, res) => {
    try {
        await client.connect();

        const coll = client.db('FrontEnd').collection('recipes');
        const recipes = await coll.find({}).toArray();


        //send data
        res.status(200).send(recipes);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close()
    }
})

app.post('/recipes', async (req, res) => {
    /* can only send data in the body */
    try {
        //connect with database
        await client.connect();
        const coll = client.db('FrontEnd').collection('recipes');


         //validation for double challenges 
         const myDoc = await coll.findOne({
             recipe_id: req.body.recipe_id
         }); 
         // Find document 
         if (myDoc) {
             res.status(400).send('Bad request: book already exists with id ' + req.body.recipe_id);
            return; //cause we don't want the code to continue
         }

         //save new challenge
         let newRecipe = {
           id: req.body.recipe_id,
           steps: req.body.steps,
           score: req.body.score,
           ingredients: req.body.ingredients,
           title: req.body.title,
           time: req.body.time,
           servings: req.body.servings,
           image: req.body.image,
           dishTypes: req.body.type
         }

         //insert into database
         let insertResult = await coll.insertOne(newRecipe);

        // //send back succes message

         res.status(201).send(newRecipe);
         console.log(newRecipe)
         return;

    } catch (error) {
        console.log('error');
        res.status(500).send({
            error: 'an error has occured',
            value: error
        });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})