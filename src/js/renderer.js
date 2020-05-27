/*
  Project   : NetMonitor
  Author    : Stacked
  Version   : 27.05.2020 - 1.0.0
  Desc      : UI renderer process
 */

/**
 * Sends an event to the main process thru our context bridge to close app
 */
$('#closeApp').click(() => {
    window.bridge.closeApp();
})
