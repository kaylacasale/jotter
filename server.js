//* installed express.js by entering 'npm i express' in command-line
//* installed npm package 'npm init -y'
//* installed inquirer package 'npm i inquirer@8.2.4'

//* require express package and set it equal to variable (express dependency in package.json)
const express = require('express');
//* require path package built into node and set that equal to variable
const path = require('path')

// require inquirer package for potential use (writing to, appending to...content to file)
// const inquirer = require('inquirer')
const util = require('util');

//* require a function from helpers folder that generates a string of random numbers and letters that will serve as the note id
const uuid = require('./helpers/uuid')

//* initialize our express app
const app = express();

//* require the JSON database file and assign it to a variable called dbData (not necessary)
//* for json files, do not need to export objects (reads objects directly from file)

const dbData = require('./db/db.json');

//* require the fs module in node to interact with the file system (e.g. read, write, append, etc.) 
const fs = require('fs');

//* define the PORT
//* PORT ~ entry point to access server
//* generally over 3000 = since most lower ports used by lower applications
// const PORT = 3001;
const PORT = process.env.PORT || 3001;

//* sets up the Express app to handle data parsing (middleware)
//* allows us to send and parse objects from the front end to the backend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//* define middleware cont.
//* any static asset I want to be served from the public folder (so we don't have write whole path each time through public folder)
//* linking public folder with other links to various files in routes
//* aka invoke app.use() and serve static files from the '/public' folder 
app.use(express.static('public'));


//* send to public/index.html file instead of opening in default browser to send to server first and then use local host url 
//* 'dirname' = string the defines path from user c-drive

//* GET request to URL ending in '/' which will hit this route to join '/' to path of base URL and redirect user to index.html file in public folder upon entering 'node server.js' in terminal
//* aka GET route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//* GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);
//* wait for info to be read from JSON file in promise
//* aka Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

//* function to write data to JSON file given a destination (dbData or './db/db.json') and content (note object called 'newNote below')
//* @param {string} destination - the JSON file ('./db/db.json') writing note to
//* @param {object} content - the content ('newNote') that will be written to the JSON file (stringify to create a JSON string out of the JS array of objects)
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nNote written to ${destination}`)
    );

//* function to read data from the JSON file and append note content
//* @param {object} content - the content that will be appended to (parse to deserialize a JSON string into a JS object)
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data)
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

// const writeToFile = (destination, content) =>
// fs.writeFile(destination, JSON.stringify(content, null, 4),(err) =>
//* GET Route for retrieving all the notes (stored in the db.json file)
//* send back dbData equal to array of objects in db.json file so JS could read file (converted from string)
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`)

    // console.log(req.body)
    // res.json(`${req.method} request recieved to get notes`)
    // readFromFile('./db/db.json').then((data) => res.json)

    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
    // return res.json(dbData);

})


//* POST Route for submitting notes
//* req.body = data sent from the front end to the backend when post request is made
//* add 'id' property that will accept content generated from uuid helper function that generates a random string
app.post('/api/notes', (req, res) => {
    //* log that POST request was receieved
    console.log(`${req.method} request recieved to add new notes`)

    //* Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    console.log(title, text)

    //* newNote = variable for the object we will save
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);


    } else {
        res.status(500).json('Error in posting note');
    }
    //res.json(`New note for ${newNote.title} has been added`)

});

app.delete('/api/notes/:id', (req, res) => {
    console.log(`${req.method} request recieved to delete a note`)

    readFromFile('./db/db.json').then((data) => {
        let oldNote = JSON.parse(data) //* to make into array of objects so JS can read
        let newNote = oldNote.filter((note) => //* filter the old note to create a new note excluding notes where who's id is associated with delete response from pressing trash can button on notes.html
            note.id !== req.params.id

        )
        writeToFile('./db/db.json', newNote) //* write new filtered notes (excluding deleted note) to JSON file (stringified in 'writeToFile' function defined above)
        res.json(`${req.params.id} has been deleted`)


    })


})



app.listen(PORT, () =>
    console.log(`Jotter app listening at http://localhost:${PORT}`)
);

