const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const url = require('url');
const ipc = electron.ipcRenderer


const previewBtn = document.getElementById('previewBtn');

//Preview Button click event
previewBtn.addEventListener('click', function(event) {

  //The array that sends information to the preview window
  let info = [];

  //text speed
  let speed = 150;

  let radios = document.getElementsByName('exampleRadios');
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      // do whatever you want with the checked radio
      speed = radios[i].value;
      info.push(speed);
      // only one radio can be logically checked, don't check the rest
      break;
    }
  }


  //sentences filled in
  let sentenceArray = [];

  //Send sentences
  const nbrOfSentences = document.getElementById("fieldNumber").value;

  for (var i = 0; i <nbrOfSentences ; i++) {
    let tempNbr = 'input'+(i+1);
    let sendInput = document.getElementById(tempNbr).value;
    sentenceArray.push(sendInput);
  }

  //Add sentences to info array
  info.push(sentenceArray);


  //toggle cursor
  let cursor = document.getElementById('checkboxCursor').checked;
  info.push(cursor);

  //toggle fullscreen
  let fullscreen = document.getElementById('checkboxFullscreen').checked;
  info.push(fullscreen);



  //Send the array through the main.js to a preview window
  ipc.send('createPreviewWindow', info);
});

//Add text fields dynamically
function addFields() {
  let errorMessage;
  let number = document.getElementById("fieldNumber").value;
  let container = document.getElementById('textForm');

  if (isNaN(number) || number < 1 || number > 5 || number % 1!= 0) {
    let errorMessage = document.getElementById('errorMessage').style.display = "block";
    while (container.firstChild) {
    container.removeChild(container.firstChild);
}
  } else {
    let errorMessage = document.getElementById('errorMessage').style.display = "none";


    while(container.hasChildNodes()){
      container.removeChild(container.lastChild);
    }

    for (i = 0; i < number; i++) {
      container.appendChild(document.createTextNode("Sentence " + (i+1) + " "));

      let input = document.createElement("input");
      input.type="text";
      input.placeholder = "Insert text";
      input.id = "input" + (i+1);
      container.appendChild(input);
      container.appendChild(document.createElement("br"));
    }

    previewBtn.disabled = false;
  }
}
