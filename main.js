const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const url = require('url');
const path = require('path');



let mainWindow;


app.on('ready', createWindow)
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
      app.quit();
    });

  }


  //Recieve the array of sentences from index.js and sends to preview.js
  ipcMain.on('send-array', function(e, array) {
    console.log(array);
    mainWindow.webContents.send('sentenceValue', array);
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
