"use strict";
/**
 * Author: Ian Fowler
 * CS 101 Spring 2021
 * Date: June 3, 2021
 *
 * This is the app.js for the api behind Forgetful Notebook.
 * It is responsible for saving form results (after the message
 * gets modified somehow) and retrieving those results.
 */
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const fsp = require("fs/promises");
const SERVER_ERROR = "Encountered an internal error.";
const app = express();

app.use(express.static("./"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

// Get all saved notes from notes.json
app.get("/allNotes", async (req, res) => {
  try {
    await fsp.access("notes.json");
    let notesFile = await fsp.readFile("notes.json", "utf8");
    let notes = JSON.parse(notesFile);
    res.type("json");
    res.send(notes);
  } catch (err) {
    res.status(500);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * If title, pet, maidenName, and message exist, returns this in an
 * object, except with the message modified following randomly chosen patterns.
 * Otherwise, returns null.
 * @param {string} title
 * @param {string} pet
 * @param {string} maidenName
 * @param {string} message
 * @returns null or object: {title, pet, maidenName, modifiedMessage}
 */
function getModifiedNote(title, pet, maidenName, message) {
  if (!(title && pet && maidenName && message)) {
    return null;
  }
  const rand = Math.random();
  const messageArr = message.split(" ");
  let modifiedMessage;
  if (message.length == 0) {
    modifiedMessage = "I completely forgot, please forgive me.";
  } else if (rand < 0.25) {
    modifiedMessage = "I know it started with " + messageArr[0];
  } else if (rand < 0.5) {
    const last = messageArr[messageArr.length - 1];
    modifiedMessage = "Something, then " + last;
  } else if (messageArr.length > 4 && rand < 0.9) {
    modifiedMessage = "Blah blah blah," + messageArr[4] + "blah, blah, blah";
  } else {
    modifiedMessage =
      "Your voice was so monotonous that all I got was " + messageArr[0];
  }
  return {
    title,
    pet,
    maidenName,
    modifiedMessage,
  };
}

// Add a note to notes.json.
app.post("/addNote", async (req, res, next) => {
  const note = getModifiedNote(
    req.body.title,
    req.body.pet,
    req.body.maidenName,
    req.body.message
  );
  if (!note) {
    res.status(400);
    next(
      Error(
        "/addNote POST parameters must include title, pet, maidenName, and message. \
        Missing one or more of these parameters."
      )
    );
  }

  try {
    if (!fs.existsSync("notes.json")) {
      await fsp.writeFile("notes.json", "[]", "utf8");
    }
    let notesFile = await fsp.readFile("notes.json", "utf8");
    let notes = JSON.parse(notesFile);
    notes.push(note);
    await fsp.writeFile("notes.json", JSON.stringify(notes, null, 2));
    res.type("text");
    res.send("Success! Stored new note.");
  } catch (err) {
    res.status(500);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Middleware function to send errors back to the client
 * @param {*} err error from express
 * @param {*} req request from express
 * @param {*} res result from express
 */
function handleError(err, req, res, next) {
  res.type("text");
  res.send(err.message);
}

app.use(handleError);

// helper functions
const PORT = process.env.PORT || 8000;
app.listen(PORT);
