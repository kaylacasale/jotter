//* installed express.js by entering 'npm i express' in command-line
//* installed npm package 'npm init -y'
//* installed inquirer package 'npm i inquirer@8.2.4'

//* require express package and set it equal to variable (express dependency in package.json)
const express = require('express');
//* require path package built into node and setting that equal to variable
//* require inquirer package for potential use (writing to, appending to...content to file)
const path = require('path')
const inquirer = require('inquirer')


//* initialize our express app
const app = express();

//* require the JSON file and assign it to a variable called db
//* for json files, do not need to export objects (reads objects directly from file)

const dbData = require('./db/db.json');

//* define the PORT
//* PORT ~ entry point to access server
//* generally over 3000 = since most lower ports used by lower applications
const PORT = 3001;


//* define middleware
//* any static asset I want to be served from the public folder (so we don't have write whole path each time through public folder)

//* linking public folder with other links to various files
app.use(express.static('public'));


//* creates link for '...localhost/3001'
app.get('/', (req, res) => res.send('Navigate to /index or /notes'));

//* send back dbData equal to array of objects in db.json dile
app.get('/api', (req, res) => {
    res.json(dbData);
})

//* send to public/index.html file instead of opening in default browser to send to server first and then use local host url 
//* dirname = string the defines path from user c-drive



app.get('/index', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.listen(PORT, () =>
    console.log(`Jotter app listening at http://localhost:${PORT}`)
);

