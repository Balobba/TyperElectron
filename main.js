const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const url = require('url');
const path = require('path');

let mainWindow;
let newWindow;

app.on('ready', createWindow)
  function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'mainwindow.html'),
      protocol: 'file',
      slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function() {
      app.quit();
    });
  }

  //Handle new window
  function addNewWindow() {
    // Create the browser window.
    newWindow = new BrowserWindow({width: 300, height: 200, title: 'New Window'})

    newWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'newwindow.html'),
      protocol: 'file',
      slashes: true
    }));

    //Garbage collection handle
    newWindow.on('closed', function() {
      newWindow = null;
    });
  }

  //Catch item:add
  ipcMain.on('item:add', function(e, item) {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    newWindow.close();
  })


  //Create menu template
  const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Open Window / Add Item',
        click(){
          addNewWindow();
        }
      },
      {
        label: 'Clear List',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
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
