// Modules to control application life and create native browser window
const {ipcMain, app, BrowserWindow, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow,ytWindow;
let ytUrl = null;

let ytMenu = [
  {
    label: 'Download Video',
    click(){
      console.log(ytUrl);
    }
  }
]

ipcMain.on('show-youtube',function(event,args){
  createYTWindow();
  const ytMen = Menu.buildFromTemplate(ytMenu);
  ytWindow.setMenu(ytMen);
})

function createYTWindow () {
  ytWindow = new BrowserWindow({
    width: 900,
    height: 500,
    parent: mainWindow,
    title: 'YouTube',
    icon: __dirname + '/lib/public/fonts/spaceship.png',
    webPreferences: {
      nodeIntegration: true
    }
  })

  ytWindow.loadURL('https://youtube.com');

  ytWindow.on('closed', function () {
    mainWindow = null
  });

  ytWindow.webContents.on('did-navigate-in-page', function(event,url,isMainFrame,frameId,routeId){
    ytUrl = url;
  });

}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    icon: __dirname + '/lib/public/fonts/spaceship.png',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./lib/index.html');
 
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if(ytWindow!=null) ytWindow.close();
    mainWindow = null;
  })
}

let template = [{
  label: 'File',
  submenu: [{
  label: 'Download Link',
  click(){
    mainWindow.webContents.send('show-modal');
  }
  },{
    label: 'Exit'
  }]
 }, {
  label: 'About',
  submenu: [{
  label: 'Version'
  }, {
  label: 'Developers'
  }]
}];

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  createWindow();
  mainWindow.once('ready-to-show', () => {
    const menu = Menu.buildFromTemplate(template);
  mainWindow.setMenu(menu);
    mainWindow.show()
    
  });
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})