const electron = require('electron')

//To access the array from main.js since ipc doesn't work for newly created window
let currentWindow = electron.remote.getCurrentWindow();
let arrayOfSentences = currentWindow.custom.array;
console.log(arrayOfSentences);
