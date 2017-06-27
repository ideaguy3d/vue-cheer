import { app, BrowserWindow } from 'electron'
import fs from "fs";
try{
     fs.lstatSync("app_client_config.json").isFile()
}catch(e){
   // Handle error
   if(e.code == 'ENOENT'){
     fs.writeFileSync('app_client_config.json', JSON.stringify({
       ServerIP: "127.0.0.1"
     }));
     //no such file or directory
     //do something
   }else {
     //do something else
   }
}


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 720,
    minWidth: 1280,
    height: 800,
    useContentSize: true,
    width: 1000
  })
  mainWindow.maximize();

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null;
    fs.unlinkSync("token.json");
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
