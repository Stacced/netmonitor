/*
  Project   : NetMonitor
  Author    : Stacked
  Version   : 27.05.2020 - 1.0.0
  Desc      : UI renderer process
 */
// Constants
const profileArgs = {
    default: "",
    fast: "-T4 -F",
    fastplus: "-sV -T4 -O -F --version-light",
    intense: "-T4 -A -v",
    intenseudp: "-sS -sU -T4 -A -v",
    intensenop: "-T4 -A -v -Pn",
    ping: "-sn",
    custom: ""
}

// Global variables
let selectedProfile = 'default';

/**
 * Sends an event to the main process thru our context bridge to close app
 */
$('#closeApp').click(() => {
    window.bridge.closeApp();
})

/**
 * Sends an event to the main process thru our context bridge to minimize app
 */
$('#minimizeApp').click(() => {
    window.bridge.minimizeApp();
});

/**
 * Handles input event on IP address field
 * Appends user-provided IP address to args field
 */
$('#ipAddress').on('input', () => {
    // Append IP address to args field
    $('#nmapToScan').text($('#ipAddress').val());
});

/**
 * Handles args field read-only state on scan by IP tab
 */
$('#scanProfile').change(() => {
    // Get selected option value and update global reference
    selectedProfile = $('option:selected').val();

    // Display args in field
    $('#nmapArgs').val(profileArgs[selectedProfile]);
    $('#nmapToScan').val($('#ipAddress').val());

    // Check if selected profile is custom to enable / disable args field
    if (selectedProfile === "custom") {
        $('#nmapArgs').prop('readonly', false);
    } else {
        $('#nmapArgs').prop('readonly', true);
    }
});

/**
 * Sends event to main process to start Nmap scan with passed arguments
 * Also validates user input
 */
$('#startScan').click(() => {
    const toScan = $('#ipAddress').val();
    const nmapArgs = $('#nmapArgs').val();

    // Send start scan event thru context bridge
    window.bridge.startScanIp({ip: toScan, nmapArgs: nmapArgs});

    // Display loading screen
    handleClickNavigation('loadingScreen');
});

// Register callback for scan IP done event
window.bridge.onScanIpDone(scanIpDoneCallback);

/**
 * Callback function for scan IP results receive event
 */
function scanIpDoneCallback(event, args) {
    // Display results tab
    handleClickNavigation('scanResults');

    // Load results in <pre> tag
    $('#scanResultsText').text(args);

    // Add simplebar and re-render it
    const simplebar = new SimpleBar($('#scanResultsText')[0]);
    simplebar.recalculate();
}

/**
 * Cancels ongoing scan and sends back user to home tab
 */
$('#cancelOngoingScan').click(() => {
    // Send cancel event
    window.bridge.cancelOngoingScan();

    // Display home tab
    handleClickNavigation('home');
});

/**
 * Sends user back to home tab after cancelling scan
 * Also clears inputs
 */
$('#cancelScan').click(() => {
    // Redirect user to home page
    handleClickNavigation('home');

    // Reset fields
    $('#ipAddress').val('');
    $('#nmapArgs').val('');
    $('option:selected').removeProp('selected');
    $("option[value='default']").prop('selected', 'selected');
});

/**
 * Sends user back to home tab
 */
$('#closeResults').click(() => {
    handleClickNavigation('home');
});

/**
 * Sends event to main process to start Nmap scan on local net
 */
$('.scanLocalNetLink').click(() => {
    // Send start scan local net event thru context bridge
    window.bridge.startScanLocalNet();

    // Display loading screen
    handleClickNavigation('loadingScreen');
});

// Register callback for scan local net done event
window.bridge.onScanLocalNetDone(scanLocalNetDoneCallback);

/**
 * Callback function for local net scan completion
 * @param event
 * @param args
 */
function scanLocalNetDoneCallback(event, args) {
    // Display local net scan results
    handleClickNavigation('scanLocalNet');

    // Populate devices container with actual detected devices
    console.log(args);
}

/**
 * Sets active tab in navbar (basically adds the "active" class to nav link)
 * @param tab
 */
function setActiveTab(tab) {
    $(".nav-link").removeClass('active');
    $(`#${tab}Link`).addClass('active');
}

/**
 * Handles tab switch
 * This is used instead of loading a whole HTML file to keep the app as smooth as possible
 * Using mainWindow.loadFile() would completely refresh the page, and for the end-user it's not that great
 * @param tab
 */
function handleClickNavigation(tab) {
    // Show selected tab
    $(`#${tab}`).css('display', 'block');

    // Set new active tab
    setActiveTab(tab);

    // Loop over other tabs to hide them
    const otherTabs = $('div[class*="tab"]');
    otherTabs.each((tabIndex, tabElement) => {
        if ($(tabElement).attr('id') !== tab) {
            $(tabElement).css('display', 'none');
        }
    });
}