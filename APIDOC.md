## **Get all Notes**

Returns json array containing data on all of the recorded notes.

- **URL**

  /allNotes

- **Method:**

  `GET`

- **URL Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** `[ { "title": "Testing", "pet": "My pet's name", "maidenName": "testing mother maiden name ", "modifiedMessage": "Your voice was so monotonous that all I got was contents" }, { "title": "Why is the Earth round?", "pet": "Sparky", "maidenName": "Jones", "modifiedMessage": "Your voice was so monotonous that all I got was false" } ]`

- **Error Response:**

  - **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `Encountered an internal error.`

- **Sample Call:**

  ```javascript
  fetch("/allNotes")
    .then(checkStatus)
    .then((resp) => resp.json())
    .then((result) =>
      result.forEach(({ title, pet, maidenName, modifiedMessage }) =>
        populateResponse(title, pet, maidenName, modifiedMessage)
      )
    )
    .catch(handleError);
  ```

## **Add a Note**

Adds a note to the store of notes.

- **URL**

  /addNote

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  **Required:**

  `title=[string]`
  `pet=[string]`
  `maidenName=[string]`
  `message=[string]`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** `Success! Stored new note.`

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `/addNote POST parameters must include title, pet, maidenName, and message. Missing one or more of these parameters.`

  OR

  - **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `Encountered an internal error.`

- **Sample Call:**

  ```javascript
  const data = new FormData(form);
  fetch("/addNote", { method: "POST", body: data })
    .then(checkStatus)
    .catch(handleError);
  ```
