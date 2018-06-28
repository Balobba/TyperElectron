const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const url = require('url');
const ipc = electron.ipcRenderer

let previewWindow;

const previewBtn = document.getElementById('previewBtn');

//Preview Button click event
previewBtn.addEventListener('click', function(event) {
  // Create the browser window.
  //KEEP FRAME: TRUE FOR THE MOMENT
  previewWindow = new BrowserWindow({frame: true, fullscreen: false, width: 600, height: 500, title: 'New Window'})

  let sentenceArray = [];

  previewWindow.loadURL(url.format({
    pathname: path.join(__dirname, './preview.html'),
    protocol: 'file',
    slashes: true
  }));

  //Garbage collection handle
  previewWindow.on('closed', function() {
    previewWindow = null;
  });

  //Send sentences
  const nbrOfSentences = document.getElementById("fieldNumber").value;


  for (var i = 0; i <nbrOfSentences ; i++) {
    let tempNbr = 'input'+(i+1);
    let sendInput = document.getElementById(tempNbr).value;
    sentenceArray.push(sendInput);
    //console.log(sentenceArray);
  }
  ipc.send('send-array', sentenceArray);

});

//Add text fields dynamically
function addFields() {
  let number = document.getElementById("fieldNumber").value;
  //console.log(number);

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
