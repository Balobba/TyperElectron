const {app, BrowserWindow, Menu, ipcMain, powerSaveBlocker} = require('electron')
const url = require('url');
const path = require('path');


let mainWindow;
let previewWindow;
let arrayOfSentences;
let speed;
let cursor;
let fullscreen;
let wait;
let powerSaveBlockerID;

app.on('ready', createWindow);
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/index.html'),
    protocol: 'file',
    slashes: true
  }));

  //Quit app when closed
  mainWindow.on('closed', function() {
    powerSaveBlocker.stop(powerSaveBlockerID);
    app.quit();
  });

  const powerSaveBlockerID = powerSaveBlocker.start('prevent-display-sleep');
}

function createPreviewWindow() {
  // Create the browser window.
  //KEEP FRAME: TRUE FOR THE MOMENT
  previewWindow = new BrowserWindow({frame: !fullscreen, fullscreen: fullscreen, width: 600, height: 500, title: 'New Window'})

  previewWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/preview.html'),
    protocol: 'file',
    slashes: true
  }));

  //Garbage collection handle
  previewWindow.on('closed', function() {
    previewWindow = null;
  });

  //Send over array of sentences
  previewWindow.custom = {
    'array': arrayOfSentences,
    'speed': speed,
    'cursor': cursor,
    'wait': wait
  }


  //Prevents the application



}

//Recieve the array of sentences from index.js and sends to preview.js
ipcMain.on('createPreviewWindow', function(e, array){
  speed = array[0];
  arrayOfSentences = array[1];
  cursor = array[2];
  fullscreen = array[3];
  wait = array[4];
  createPreviewWindow();
})


//Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {role: 'close'},
      {type: 'separator'},
      {
        label: 'Exit',
        accelerator:process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q', //Hotkey for closing the app.
        click(){
          app.quit();
        }
      },

    ]
  }
]

//Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu:[
      {
        label: 'Open Dev Tools',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },{
        role: 'reload'
      }

    ]
  });
}

//Build menu from template
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

//Insert Menu
Menu.setApplicationMenu(mainMenu);
