//Dependencies
// =============================================================
// const requirejs = require('requirejs');
// require("dotenv").config();



// requirejs.config({
  

//   nodeRequire: require
// });

// requirejs(['foo', 'bar'],
// function   (foo,   bar) {
  //foo and bar are loaded according to requirejs
  //config, but if not found, then node's require
  //is used to load the module.
// });

const poems = require("./public/resources/js/poems.js");
const config = require("./config/config");
const fs = require("fs");
const jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
const express = require("express");
const path = require("path");


//Sets up the Express App
// =============================================================
const app = express();
const PORT = config.port;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//set global variables

const poemText = $("#poemText");
const poemDiv = $("#poem");
let thisPoem;


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../index.html"));
  });
  
  // Displays all poems
  app.get("/api/poems", function(req, res) {
    return res.json(poems);
  });
  
  // Displays a single poem, or returns false
  app.get("/api/poems/:poem", function(req, res) {
    var chosen = req.params.poem;
  
    console.log(chosen);
  
    for (var i = 0; i < poems.length; i++) {
      if (chosen === poems[i].name) {
        return res.json(poems[i]);
      }
    }
  
    return res.json(false);
  });


//the poem object
class Poem {
    constructor(lineNum) {
        this.name = "";
        this.lineNum = lineNum;
        this.myLines = [];
        this.author = "";

        //you will have the option to name the poem if you choose to save it
        this.saveName = function(name) {
            this.name = name;
        }

        //likewise, you can add an author name
        this.saveAuthor = function(author) {
            this.author = author;
        }

        //method to generate the poem itself
        this.genPoem = function() {
            fs.readFile("../lines.txt", "utf8", function (error, data) {

                if (error) {
                    return console.log(error);
                }
        
                let dataArr = data.split(",");
                for (let i = 0; i <= this.lineNum; i++) {
                    let index = Math.floor(Math.random() * dataArr.length);
                    let oneLine = `${dataArr[index]}<br />`;
                    console.log(oneLine);
                    this.myLines.push(oneLine);
                }
                //does this need to be a promise?
            }
            )
        }
    }
}

storeLine = () => {
    let line = $("#lineAdd").val().trim();
    console.log(`The line: ${line}`);
    //save it in a text file! HOWSABOUT DAT!?
    fs.appendFile("../lines.txt", `${line},`, function (err) {
        if (err) throw err;

    });
    $("#lineAdd").val("");
}


$("#lineBtn").on("click", (event) => {
    event.preventDefault();
    storeLine();
})


// Generate the poem

const showPoem = () => {
    thisPoem = new Poem($("#lineNumber").val().trim());
    thisPoem.genPoem();
    poemText.text(thisPoem.myLines.join(" "));
    $("#lineNumber").val("");
    poemDiv.show();
}

// Create New poems - takes in JSON input
app.post("/api/poems", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newpoem = req.body;
  
    console.log(newpoem);
  
    // We then add the json the user sent to the poem array
    poems.push(newpoem);
  
    // We then display the JSON to the users
    res.json(newpoem);
  });
  
  // Starts the server to begin listening
  // =============================================================
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  

$("#genPoem").on("click", (event) => {
    event.preventDefault();
    showPoem();
})

$("#save-poem").on("click", function() {
    event.preventDefault();

    thisPoem.saveName($("#name").val().trim());
    thisPoem.saveAuthor($("#creator").val().trim());

      $.post("/api/poems", newpoem)
        .then(function(data) {
          console.log(data);
          poemDiv.hide();
        
        });

    });