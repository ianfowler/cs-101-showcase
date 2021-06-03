/**
 * Name: Ian Fowler
 * CS 101 Spring 2021
 * Date: April 10th, 2021
 * This is the index.js page for Spectrogram Viewer.
 * It implements the functionality for adding
 * spectrograms to the page using the library SpectrogramJS.
 * The library is located here: https://github.com/vlandham/spectrogramJS
 */

// Keep a tally of all sections added to the DOM to maintain unique IDs.
let count = 0;

/**
 * deleteCell:
 *  Remove a spectrogram and its corresponding section from the DOM
 *
 *  Arguments:
 *    id - the id of the section to remove
 *
 *  Returns: None.
 */
deleteCell = (id) => {
  var myobj = document.getElementById(id);
  console.log(id);
  if (myobj) myobj.remove();
};

/**
 * addSpectrogram:
 *  Inject a sepctrogram into the surrounding html from addFile
 *
 *  Arguments:
 *    target - the response recieved by the input element which contained file
 *    file - the audio file to add
 *    id - the id of the div in which to inject a spectrogram
 *
 *  Returns: None.
 */
addSpectrogram = (target, file, id) => {
  var reader = new FileReader();
  if (target.files && file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      new Spectrogram(e.target.result, "#" + id, {
        width: 720,
        height: 200,
        colorScheme: [
          "#440154",
          "#472877",
          "#3e4a89",
          "#31688d",
          "#26838e",
          "#1f9e89",
          "#36b778",
          "#6dcd59",
          "#b4dd2c",
          "#fde725",
        ],
      });
    };
    reader.readAsDataURL(file);
  }
};

/**
 * addFile:
 *  Injects html surrounding a new spectrogram
 *
 *  Arguments:
 *    file - the audio file to add
 *    target - the response recieved by the input element which contained file
 *
 *  Returns: None.
 */
addFile = async (file, target) => {
  let sectionID = `sec${count}`;
  let deleteButtonID = `id${count}`;
  let spectrogramID = `vis${count}`;
  var d1 = document.getElementById("add-song");
  await d1.insertAdjacentHTML(
    "beforebegin",
    `
    <section id="${sectionID}">
      <span class="row-group">
        <h2>${file.name}</h2>
        <button class="outline-button" type="button" id="${deleteButtonID}">
            Delete
        </button>
      </span>
      <div id="${spectrogramID}" class="spectrogram"></div>
    </section>
    `
  );
  document
    .getElementById(deleteButtonID)
    .addEventListener("click", () => deleteCell(sectionID));
  addSpectrogram(target, file, spectrogramID);
  count += 1;
};

// Listen for files to be uploaded, then send to addFile
window.onload = () => {
  fileSelector = document.getElementById("file-selector");
  fileSelector.addEventListener("change", (event) => {
    let target = event.target;
    let fileList = target.files;
    for (var i = 0; i < fileList.length; i++) {
      let file = fileList.item(i);
      addFile(file, target);
    }
  });
};
