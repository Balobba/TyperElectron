const electron = require('electron')
const ipc = electron.ipcRenderer

//let divArray = document.getElementById('divArray');


ipc.on('send-array', function(event, message){
  console.log(message);
  document.write(message);
})
