const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const url = require('url');
const ipc = electron.ipcRenderer


const previewBtn = document.getElementById('previewBtn');

//Preview Button click event
previewBtn.addEventListener('click', function(event) {


  let sentenceArray = [];

  //Send sentences
  const nbrOfSentences = document.getElementById("fieldNumber").value;

  for (var i = 0; i <nbrOfSentences ; i++) {
    let tempNbr = 'input'+(i+1);
    let sendInput = document.getElementById(tempNbr).value;
    sentenceArray.push(sendInput);
  }
  //Send the array through the main.js to a preview window
  ipc.send('createPreviewWindow', sentenceArray);
});

//Add text fields dynamically
function addFields() {
  let number = document.getElementById("fieldNumber").value;

  let container = document.getElementById('textForm');

  while(container.hasChildNodes()){
    container.removeChild(container.lastChild);
  }

  for (i = 0; i < number; i++) {
     container.appendChild(document.createTextNode("Sentence " + (i+1)));

     let input = document.createElement("input");
     input.type="text";
     input.placeholder = "Insert text";
     input.id = "input" + (i+1);
     container.appendChild(input);
     container.appendChild(document.createElement("br"));
  }
}
