/*
  Project   : NetMonitor
  Author    : Stacked
  Version   : 04.06.2020 - 1.0.0
  Desc      : Preload stuff for renderer process, such as specific Node.js APIs or packages for safety purposes
 */
// Require the stuff we're gonna need
const { contextBridge, ipcRenderer } = require('electron');
const validator = require('validator');

// Expose protected methods that renderer process can use
contextBridge.exposeInMainWorld('bridge', {
    closeApp: () => {
        ipcRenderer.send('rendererCloseApp');
    },
    minimizeApp: () => {
        ipcRenderer.send('rendererMinimizeApp');
    },
    validateIp: (ip) => {
        return validator.isFQDN(ip) || validator.isIP(ip);
    },
    showMessageBox: (content) => {
        ipcRenderer.send('rendererShowMessageBox', content);
    },
    showErrorBox: (content) => {
        ipcRenderer.send('rendererShowErrorBox', content);
    },
    startScanIp: (scanArgs) => {
        ipcRenderer.send('rendererStartScanIp', scanArgs);
    },
    cancelOngoingScan: () => {
        ipcRenderer.send('rendererCancelScanIp');
    },
    onScanIpDone: (scanIpDoneCallback) => {
        ipcRenderer.on('mainScanIpDone', scanIpDoneCallback);
    },
    startScanLocalNet: () => {
        ipcRenderer.send('rendererStartScanLocalNet');
    },
    onScanLocalNetDone: (scanLocalNetDoneCallback) => {
        ipcRenderer.on('mainScanLocalNetDone', scanLocalNetDoneCallback);
    },
    exportResults: (results) => {
        ipcRenderer.send('rendererExportResults', results);
    },
    startTraceroute: (toScan) => {
        ipcRenderer.send('rendererStartTraceroute', toScan);
    },
    onTracerouteReceivedHopData: (receivedHopDataCallback) => {
        ipcRenderer.on('mainReceivedHopData', receivedHopDataCallback);
    },
    onTracerouteDone: (tracerouteDoneCallback) => {
        ipcRenderer.on('mainTracerouteDone', tracerouteDoneCallback);
    },
});
