/*
  Project   : NetMonitor
  Author    : Stacked
  Version   : 27.05.2020 - 1.0.0
  Desc      : App entrypoint, main process
 */

// Dependencies / imports
const { app, BrowserWindow, ipcMain } = require('electron');
const nmap = require('node-nmap');
const path = require('path');

// Global scan reference for all events
let scan = null;

// Auto reload
require('electron-reload')(__dirname);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1050,
        height: 580,
        frame: false,
        resizable: false,
        maximizable: false,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'js/preload.js')
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Listen to close app event from renderer process
ipcMain.on('rendererCloseApp', () => {
    BrowserWindow.getFocusedWindow().close();
});

// Listen to minimize event from renderer process
ipcMain.on('rendererMinimizeApp', () => {
    BrowserWindow.getFocusedWindow().minimize();
})

// Listen to start IP scan event from renderer process
ipcMain.on('rendererStartScanIp', (event, args) => {
    // Extract data from args object
    const toScan = args.ip;
    const nmapArgs = args.nmapArgs;

    // Create new scan object with received IP or domain name and Nmap args
    scan = new nmap.NmapScan(toScan, nmapArgs);

    // Reply to event on complete with scan results
    scan.on('complete', () => {
        event.reply('mainScanIpDone', scan.rawData);
    });

    // Reply to event on error with error flag
    scan.on('error', error => {
        console.error(error); // TODO: send error
    })

    // Reference cancel event
    ipcMain.once('rendererCancelScanIp', () => {
        scan.cancelScan();
    })

    // Start scan on the object
    scan.startScan();
})