/*
  Project   : NetMonitor
  Author    : Stacked
  Version   : 27.05.2020 - 1.0.0
  Desc      : Preload stuff for renderer process, such as specific Node.js APIs or packages for safety purposes
 */
// Require the stuff we're gonna need
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that renderer process can use
contextBridge.exposeInMainWorld(
    'bridge', {
        closeApp: () => {
            ipcRenderer.send('rendererCloseApp');
        },
        minimizeApp: () => {
            ipcRenderer.send('rendererMinimizeApp');
        },
        startScanIp: (scanArgs) => {
            ipcRenderer.send('rendererStartScanIp', scanArgs);
        },
        onScanIpDone: (scanIpDoneCallback) => {
            ipcRenderer.on('mainScanIpDone', scanIpDoneCallback);
        }
    }
)
