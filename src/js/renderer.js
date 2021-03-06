/*
  Project   : NetMonitor
  Author    : Stacked
  Version   : 09.06.2020 - 1.0.0
  Desc      : UI renderer process
 */
// Constants
const profileArgs = {
    default: '',
    fast: '-T4 -F',
    fastplus: '-sV -T4 -O -F --version-light',
    intense: '-T4 -A -v',
    intenseudp: '-sS -sU -T4 -A -v',
    intensenop: '-T4 -A -v -Pn',
    ping: '-sn',
    custom: '',
};

// Global variables
let currentEvent = null;
let selectedProfile = 'default';
let performedLocalNetScan = false;
let prevLat = null;
let prevLon = null;
let polyLine = null;
let hopCount = 0;

// Initialize Leaflet map
const hopsMap = L.map('hopsMap').setView([46, 4], 5);

// Add world map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(hopsMap);

// Add hops layer
const hopsLayer = L.featureGroup().addTo(hopsMap);

/**
 * Sends an event to the main process thru our context bridge to close app
 */
$('#closeApp').click(() => {
    window.bridge.closeApp();
});

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
    if (selectedProfile === 'custom') {
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

    // Validate fields
    if (window.bridge.validateIp(toScan)) {
        // Send start scan event thru context bridge
        window.bridge.startScanIp({ ip: toScan, nmapArgs: nmapArgs });

        // Display loading screen
        handleClickNavigation('loadingScreen');

        // Set current event
        currentEvent = 'scan';
    } else {
        // Display error box
        window.bridge.showErrorBox(
            "L'IP ou nom de domaine entré n'est pas valide !"
        );
    }
});

// Register callback for scan IP done event
window.bridge.onScanIpDone(scanIpDoneCallback);

/**
 * Callback function for scan IP results receive event
 */
function scanIpDoneCallback(event, args) {
    currentEvent = null;

    // Display results tab
    handleClickNavigation('scanResults');

    // Load results in <pre> tag
    $('#scanResultsText .simplebar-content').text(args);
}

/**
 * Cancels ongoing scan and sends back user to home tab
 */
$('#cancelOngoingOperation').click(() => {
    // Send cancel event depending what type of event the user was running
    if (currentEvent === 'scan') {
        window.bridge.cancelOngoingScan();
    } else if (currentEvent === 'traceroute') {
        window.bridge.cancelTraceroute();

        // Clear temp traceroute results
        resetTraceroute();
    }
    currentEvent = null;

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
    $('#nmapToScan').text('');
    $('option:selected').removeProp('selected');
    $("option[value='default']").prop('selected', 'selected');
});

/**
 * Sends user back to home tab
 */
$('#closeResults').click(() => {
    handleClickNavigation('home');
});

// Register callback for scan local net done event
window.bridge.onScanLocalNetDone(scanLocalNetDoneCallback);

/**
 * Callback function for local net scan completion
 * @param event
 * @param args
 */
function scanLocalNetDoneCallback(event, args) {
    // Update performed scan var
    performedLocalNetScan = true;
    currentEvent = null;

    // Display local net scan results
    handleClickNavigation('scanLocalNet');

    // Populate devices container with actual detected devices
    $('#scannedRange').text(args.scannedRange);
    $('#machinesCount').text(args.machinesCount);

    // Clear previous results
    $('#devicesContainer .simplebar-content').text('');

    // Loop over machines and add them to our list
    const machineChunks = chunkArray(args.results, 4);
    machineChunks.forEach((chunk) => {
        // Create row
        const row = document.createElement('div');
        row.classList.add('row');
        row.classList.add('text-center');
        row.classList.add('mt-4');

        // Loop over machines and add them to the row
        chunk.forEach((machine) => {
            let iconPath;
            let osName =
                machine.osNmap !== null ? machine.osNmap.toString() : '';

            // Select appropriate icon
            if (osName.includes('Windows')) {
                iconPath = 'img/w10-logo.png';
            } else if (osName.includes('Apple')) {
                iconPath = 'img/macos-logo.png';
            } else if (osName.includes('Linux')) {
                iconPath = 'img/linux-logo.png';
            } else {
                iconPath = 'img/unknown-os.png';
            }

            // Create machine div
            const div = document.createElement('div');
            div.classList.add('col');
            div.classList.add('detectedMachine');
            div.innerHTML = `<img src="${iconPath}" alt="Logo OS"/><br><span>${machine.hostname}</span>`;
            div.addEventListener('click', () => {
                // Redirect user to scan IP tab
                handleClickNavigation('scanIp');

                // Pre-fill IP address field with selected machine's IP
                $('#ipAddress').val(machine.ip);
                $('#nmapToScan').text(machine.ip);
            });

            // Append machine to row
            row.append(div);
        });

        // Append row to container
        $('#devicesContainer .simplebar-content').append(row);
    });
}

$('#restartScanLocalNet').click(() => {
    // Update performed scan var
    performedLocalNetScan = false;

    // Simulate local net scan click
    handleClickNavigation('scanLocalNet');
});

/**
 * Handles export result button click
 * Sends export results event to main process with results
 */
$('#exportResults').click(() => {
    // Ask user to choose export path
    window.bridge.exportResults(
        $('#scanResultsText .simplebar-content').text()
    );
});

/**
 * Starts traceroute on IP address
 */
$('#startTraceroute').click(() => {
    // Get IP or domain to scan
    const toScan = $('#tracerouteIpAddress').val();

    // Validate field
    if (window.bridge.validateIp(toScan)) {
        // Clear previous results
        resetTraceroute();

        // Send event to main process to start traceroute
        window.bridge.startTraceroute(toScan);

        // Set current event
        currentEvent = 'traceroute';

        // Send user to loading screen
        handleClickNavigation('loadingScreen');
    } else {
        // Display error box
        window.bridge.showErrorBox(
            "L'IP ou nom de domaine entré n'est pas valide !"
        );
    }
});

// Register on received hop data callback
window.bridge.onTracerouteReceivedHopData(onReceivedHopDataCallback);

/**
 * Callback function for traceroute hop data
 * Adds hop to table and map
 * @param event Event object from Electron
 * @param hopData JSON data string sent from main process
 */
function onReceivedHopDataCallback(event, hopData) {
    hopData = JSON.parse(hopData);

    // Don't plot duplicate hop
    if (hopData.lat === prevLat && hopData.lon === prevLon) {
        return;
    }

    hopCount++;

    // Create row for table
    const hopRow =
        '<tr><td>' +
        hopCount +
        '</td><td>' +
        hopData.query +
        '</td><td>' +
        hopData.city +
        '</td><td>' +
        hopData.region +
        '</td><td>' +
        hopData.country +
        '</td></tr>';
    $('#hops tbody').append(hopRow);

    // Save GPS coordinates
    prevLat = hopData.lat;
    prevLon = hopData.lon;

    // Create marker and add it to layer group
    L.marker([hopData.lat, hopData.lon], { title: 'Saut ' + hopCount }).addTo(
        hopsLayer
    );

    // Draw poly line
    if (polyLine === null) {
        polyLine = L.polyline([[hopData.lat, hopData.lon]], {
            color: 'red',
        }).addTo(hopsLayer);
    } else {
        polyLine.addLatLng(L.latLng(hopData.lat, hopData.lon));
    }
}

// Register on traceroute done callback
window.bridge.onTracerouteDone(onTracerouteDoneCallback);

/**
 * Callback function for traceroute done event
 * Display results to user
 * @param event Event object from Electron
 * @param statusCode Status code of traceroute
 */
function onTracerouteDoneCallback(event, statusCode) {
    // Set current event
    currentEvent = null;

    // Show results on traceroute
    handleClickNavigation('traceroute');

    // Fit map zoom to layer bounds
    hopsMap.fitBounds(hopsLayer.getBounds());
}

// Register on scan error callback
window.bridge.onScanError(onScanErrorCallback);

/**
 * Redirects user to home page and resets scan-related variables
 */
function onScanErrorCallback() {
    // Reset data
    currentEvent = null;
    performedLocalNetScan = false;

    // Redirect user to home page
    handleClickNavigation('home');
}

/**
 * Resets traceroute page to default state
 */
function resetTraceroute() {
    // Clear everything !
    hopsLayer.clearLayers();
    polyLine = null;
    hopCount = 0;
    $('#hops tbody').text('');
}

/**
 * Sets active tab in navbar (basically adds the "active" class to nav link)
 * @param tab
 */
function setActiveTab(tab) {
    $('.nav-link').removeClass('active');
    $(`#${tab}Link`).addClass('active');
}

/**
 * Handles tab switch
 * This is used instead of loading a whole HTML file to keep the app as smooth as possible
 * Using mainWindow.loadFile() would completely refresh the page, and for the end-user it's not that great
 * @param tab
 */
function handleClickNavigation(tab) {
    // Disable navigation if app is running a scan or a traceroute
    if (currentEvent != null && tab !== 'loadingScreen') {
        return;
    }

    // If selected tab is scan local net, check if scan was already performed
    if (tab === 'scanLocalNet') {
        if (!performedLocalNetScan) {
            // Send start scan local net event thru context bridge
            window.bridge.startScanLocalNet();

            // Set current event
            currentEvent = 'scan';

            // Display loading screen
            handleClickNavigation('loadingScreen');
            return;
        }
    }

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

    // If selected tab is traceroute, invalidate map size to load tiles properly
    // This needs to be done AFTER displaying the page, otherwise it'll have no effect
    if (tab === 'traceroute') {
        hopsMap.invalidateSize();
    }
}

/**
 * Returns an array with arrays of the given size.
 * https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 *
 * @param array {Array} array to split
 * @param chunkSize {int} Size of every group
 */
function chunkArray(array, chunkSize) {
    // Array containing all chunks
    const chunks = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        // Push chunk into array
        chunks.push(array.slice(i, i + chunkSize));
    }

    return chunks;
}
