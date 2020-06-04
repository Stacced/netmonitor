/*
  Project   : NetMonitor
  Author    : Stacked
  Version   : 04.06.2020 - 1.0.0
  Desc      : App entrypoint, main process
 */

// Dependencies / imports
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const nmap = require('node-nmap');
nmap.nmapLocation = 'nmap-7.80/nmap.exe';
const Traceroute = require('nodejs-traceroute');
const ip = require('ip');
const fs = require('fs');
const path = require('path');
const httpGet = require('http').get;

// Global variables
let scan = null;
let localIpMask = null;
let tracer = null;
let tracerPid = null;

// Auto reload
require('electron-reload')(__dirname);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
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
            preload: path.join(__dirname, 'js/preload.js'),
        },
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
});

// Listen to show message box event from renderer process
ipcMain.on('rendererShowMessageBox', (event, message) => {
    // Display message box
    dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
        type: 'info',
        title: 'NetMonitor - Information',
        message: message,
    });
});

// Listen to show error box event from renderer process
ipcMain.on('rendererShowErrorBox', (event, message) => {
    // Display error box
    dialog.showErrorBox('NetMonitor - Erreur', message);
});

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
    scan.on('error', (error) => {
        console.error(error); // TODO: send error
    });

    // Reference cancel event
    ipcMain.once('rendererCancelScanIp', () => {
        scan.cancelScan();
    });

    // Start scan
    scan.startScan();
});

// Listen to start local net scan event from renderer process
ipcMain.on('rendererStartScanLocalNet', (event, args) => {
    // Get local IP mask if not already defined
    if (localIpMask === null) {
        localIpMask = ip.mask(ip.address(), ip.fromPrefixLen(24));
    }

    // Create new scan object with IP range and args
    // Args will run a fast scan with OS detection and XML output, which will be parsed for us by node-nmap
    scan = new nmap.NmapScan(localIpMask + '/24', '-T4 -F -O -oX -');

    // Reply to event on complete with scan results
    scan.on('complete', () => {
        event.reply('mainScanLocalNetDone', {
            results: scan.scanResults,
            scannedRange: localIpMask,
            machinesCount: scan.scanResults.length,
        });
    });

    // Reply to event on error with error flag
    scan.on('error', (error) => {
        console.error(error); // TODO: send error to renderer process
    });

    // Reference cancel event
    ipcMain.once('rendererCancelScanIp', () => {
        scan.cancelScan();
    });

    // Start scan
    scan.startScan();
});

// Listen to export results event from renderer process
ipcMain.on('rendererExportResults', (event, args) => {
    // Define general dialog options
    const dialogOptions = {
        title: 'NetMonitor - Exporter les résultats',
        defaultPath: '%userprofile%\\.',
        buttonLabel: 'Sauvegarder les résultats',
        filters: [
            { name: 'Fichiers texte', extensions: ['txt'] },
            { name: 'Tous les fichiers', extensions: ['*'] },
        ],
    };

    // Ask filename from user (blocking call, this is on purpose)
    const savePath = dialog.showSaveDialogSync(
        BrowserWindow.getFocusedWindow(),
        dialogOptions
    );

    // Write the file to the selected savePath if dialog wasn't cancelled (savePath != to undefined)
    if (savePath !== undefined) {
        fs.writeFile(savePath, args, (err) => {
            if (err) {
                dialog.showErrorBox(
                    'NetMonitor - Erreur',
                    `Une erreur est survenue à la sauvegarde des résultats : ${err.message}`
                );
            } else {
                dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
                    type: 'info',
                    title: 'NetMonitor - Sauvegarde réussie',
                    message:
                        'Les résultats du scan ont bien été exportés dans le fichier ' +
                        savePath,
                });
            }
        });
    }
});

// Listen to start traceroute event from renderer process
ipcMain.on('rendererStartTraceroute', (event, args) => {
    // First of all, check if we can
    const toTrace = args;

    // Create new Traceroute, force IPv4 for speed purposes
    tracer = new Traceroute('ipv4');

    // Register callbacks for traceroute object
    tracer.on('hop', (hop) => {
        // Check if hop was timed out or if it's the first hop (from host to router)
        if (hop.ip === 'D' || hop.ip === '192.168.1.1') {
            return;
        }

        // Make request to IP API
        const ipApiEndpoint = 'http://ip-api.com/json/' + hop.ip;
        httpGet(ipApiEndpoint, (res) => {
            let hopData = '';
            res.on('data', (data) => (hopData += data));
            res.on('end', () => {
                event.reply('mainReceivedHopData', hopData);
            });
        }).on('error', (err) => {
            // Log error, but discard it since it won't cause any problem on the renderer side
            console.log(err);
        });
    });

    // Save process PID for later if user wants to stop it
    tracer.on('pid', (pid) => {
        tracerPid = pid;
    });

    // Send event to renderer process that traceroute is done
    tracer.on('close', (code) => {
        event.reply('mainTracerouteDone', code);
    });

    // Run traceroute on target
    tracer.trace(toTrace.toString());
});

// Listen to stop traceroute event from renderer process
ipcMain.on('rendererStopTraceroute', (event, args) => {
    // Kill traceroute process
    process.kill(tracerPid);
});
