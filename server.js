//* installed express.js by entering 'npm i express' in command-line
//* installed npm package 'npm init -y'
//* installed inquirer package 'npm i inquirer@8.2.4'

//* require express package and set it equal to variable (express dependency in package.json)
const express = require('express');
//* require path package built into node and setting that equal to variable
//* require inquirer package for potential use (writing to, appending to...content to file)
const path = require('path')
const inquirer = require('inquirer')

const uuid = require('./helpers/uuid')


//* initialize our express app
const app = express();

//* require the JSON file and assign it to a variable called db
//* for json files, do not need to export objects (reads objects directly from file)

const dbData = require('./db/db.json');
const fs = require('fs');

//* define the PORT
//* PORT ~ entry point to access server
//* generally over 3000 = since most lower ports used by lower applications
const PORT = 3001;

//* sets up the Express app to handle data parsing (middleware)
//* allows us to send and parse objects from the front end to the backend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//* define middleware
//* any static asset I want to be served from the public folder (so we don't have write whole path each time through public folder)

//* linking public folder with other links to various files
app.use(express.static('public'));


//* creates link for '...localhost/3001'
app.get('/', (req, res) => res.send('Navigate to /index or /notes'));

//* send to public/index.html file instead of opening in default browser to send to server first and then use local host url 
//* dirname = string the defines path from user c-drive
app.get('/index', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//* send back dbData equal to array of objects in db.json file
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`)
    console.log(req.body)
    return res.json(dbData);
})

//* req.body = data sent from the front end to the backend when post request is made
app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request recieved to add new notes`)

    const { title, text } = req.body;
    console.log(title, text)




    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }

        const noteString = JSON.stringify(newNote);

        fs.writeFile(`./db/db.json`, noteString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Note for ${newNote.title} has been written to JSON file`
                ))

        const response = {
            statis: 'success',
            body: newNote,
        }

        console.log(response)
        res.status(201).json(response);

    } else {
        res.status(500).json('Error in posting review');
    }
    //res.json(`New note for ${newNote.title} has been added`)

});







app.listen(PORT, () =>
    console.log(`Jotter app listening at http://localhost:${PORT}`)
);

