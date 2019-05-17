//Dependencies
// =============================================================
require("dotenv").config();
var config = require('./config/config');
var fs = require("fs");
var express = require("express");
var path = require("path");

//Sets up the Express App
// =============================================================
var app = express();
var PORT = config.port;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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

//set changable html element

let poemDiv = $("#poem");

// Generate the poem

const showPoem = () => {
    let thisPoem = new Poem($("#lineNumber").val().trim());
    thisPoem.genPoem();
    poemDiv.text(thisPoem.myLines.join(" "));
    $("#lineNumber").val("");
}



// const savePoem = (poemName) => {
// db.collection("poems").doc(`${poemName}`).set({
//     name: poemName,
//     lines: myLines,
//     author: author
// })
// .then(function() {
//     console.log("Document successfully written!");
// })
// .catch(function(error) {
//     console.error("Error writing document: ", error);
// });

// }

$("#genPoem").on("click", (event) => {
    event.preventDefault();
    showPoem();
})

