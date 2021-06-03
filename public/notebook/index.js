/**
 * Author: Ian Fowler
 * CS 101 Spring 2021
 * Date: June 3, 2021
 * 
 * This is the index.js for Forgetful Notebook.
 * It is responsible for responding to changes in the interface,
 * flipping between screens and pulling data from the API.
 */

(function () {
  "use strict";

  const ERROR_MESSAGE =
    "Forgetful Notebook encountered an error. Sorry for the inconvenience (but not that sorry).";
  const BUTTON_TEXT_ON_FORM = "View Submissions";
  const BUTTON_TEXT_ON_SUBMISSIONS = "Take Notes";

  /**
   * Extracts the notebook form, appending the text-area for message.
   * @returns FormData the data from the notebook form
   */
  function extractFormData() {
    const form = id("notes-form");
    const data = new FormData(form);
    const message = id("message-field").value;
    data.append("message", message);
    return data;
  }

  /**
   * Submits form data to the API.
   */
  function sendData() {
    const data = extractFormData();
    id("notes-form").reset();
    fetch("/addNote", { method: "POST", body: data })
      .then(checkStatus)
      .catch(handleError);
  }

  /**
   * Add a single response from /allNotes to the screen.
   * @param {string} title title from the form
   * @param {string} pet pet from the form
   * @param {string} maidenName maidenName from the form
   * @param {string} message message from the form
   */
  function populateResponse(title, pet, maidenName, message) {
    let container = document.createElement("article");
    container.classList.add("outline-container");
    const genAttribute = (title, val) => {
      let p = document.createElement("p");
      p.innerHTML = title.bold() + ": " + val;
      container.appendChild(p);
    };
    genAttribute("Title", title);
    genAttribute("Pet", pet);
    genAttribute("Mother's maiden name", maidenName);
    genAttribute("Message", message);
    id("saved-responses").appendChild(container);
  }

  /**
   * Fetch all responses from the /allNotes endpoints and
   * populate them on the screen.
   */
  function populateResponses() {
    const parent = id("saved-responses");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    fetch("/allNotes")
      .then(checkStatus)
      .then((resp) => resp.json())
      .then((result) =>
        result.forEach(({ title, pet, maidenName, modifiedMessage }) =>
          populateResponse(title, pet, maidenName, modifiedMessage)
        )
      )
      .catch(handleError);
  }

  /**
   * Alert the user of an error
   * @param {*} err fetch error
   */
  function handleError(err) {
    id("message-board").textContent = ERROR_MESSAGE;
  }

  /**
   * Setup event listeners for screen components.
   */
  function init() {
    const screenButton = id("screen-button");
    screenButton.addEventListener("click", () => {
      id("notes-form").classList.toggle("hidden");
      id("saved-responses").classList.toggle("hidden");

      if (id("notes-form").classList.contains("hidden")) {
        populateResponses();
        screenButton.textContent = BUTTON_TEXT_ON_SUBMISSIONS;
      } else {
        screenButton.textContent = BUTTON_TEXT_ON_FORM;
      }
    });

    id("notes-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = extractFormData();
      const hasAllFields = ["title", "pet", "maidenName", "message"].every(
        (key) => data.get(key)
      );
      if (!hasAllFields) {
        alert("Fill out all the fields! Gosh!");
      } else {
        sendData();
      }
    });
  }

  /** ------------------------------ Helper Shorthand Functions ------------------------------ */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if none).
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Processes a fetch Response, returning it unchanged if status code is 200-level,
   * otherwise throws an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

  init();
})();
