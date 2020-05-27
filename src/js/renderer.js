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

/**
 * Sends an event to the main process thru our context bridge to minimize app
 */
$('#minimizeApp').click(() => {
    window.bridge.minimizeApp();
});

/*
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
 * Adds Boostrap class selected on active tab
 */
$(".nav-link").click((e) => {
    $(".nav-link").removeClass('active');
    $(e.target).addClass('active');
});

/**
 * Handles tab switch
 * This is used instead of loading a whole HTML file to keep the app as smooth as possible
 * Using mainWindow.loadFile() would completely refresh the page, and for the end-user it's not that great
 * @param tab
 */
function handleClickNavigation(tab) {
    // Show selected tab
    $(`#${tab}`).css('display', 'block');

    // Loop over other tabs to hide them
    const otherTabs = $('div[class*="tab"]');
    otherTabs.each((tabIndex, tabElement) => {
        if ($(tabElement).attr('id') !== tab) {
            $(tabElement).css('display', 'none');
        }
    });
}