/* -----------------------------------------------------
/	Filename:	msntv-runetime.js
/	Pupose	:	A mock runtime to simulate the internal API calls for an MSNTV 2 set top box.
/	Author	:	Michael Ward (mward139)
/	Created	:   03/10/2026
/	Modified:	03/10/2026
/
/	Copyright (c) 2026 Michael Ward
/  -----------------------------------------------------
*/

// Product / service labels
let ProductShortName = "MSN TV 2";
let ServiceShortName = "MSN TV Service";
let ServiceFullName = "MSN TV Service";

// Holds onto parameters used by ConnectionError.html.
let parameters = {
    ErrorCode: ""
};

// Error codes and flags
// ConnectError types:
let ConnectError_NoLine = 1;
let ConnectError_RequireWirelessSettings = 2;
let ConnectError_WepKeyIncorrect = 3;
let ConnectError_NoAdapter = 4;
let ConnectError_NoCarrier = 5;
let ConnectError_NoDialTone = 6;
let ConnectError_NoAnswer = 7;
let ConnectError_ExtensionOffhook = 8;
let ConnectError_IncomingCall = 9;
let ConnectError_LineInUse = 10;

// Flags for type of connection:
let UsingBroadband = true;
let UsingWireless = true;

// General error info:
let ErrorCode = 0;
let ErrorMode = null;
let WANErrorMode = "wan";

// Error Info setting:
/*
    Sets the error mode to the given error mode.
    @param givenMode The error mode given by the user.
*/
function SetErrorMode(givenMode) {
    ErrorMode = givenMode;
}
/*
    Gets the current error mode.
    @return ErrorMode The current error mode.
*/
function GetErrorMode() {
    return ErrorMode;
}
/*
    Sets the error code to the given error code.
    @param givenMode The error code given by the user.
*/
function SetErrorCode(givenCode) {
    ErrorCode = givenCode;
}
/*
    Gets the current error code.
    @return ErrorCode The current error code.
*/
function GetErrorCode() {
    return ErrorCode;
}

// Error messages:
/*
    Handles title generation for a connection error.
    @return Connection error title to display.
*/
function FriendlyErrorTitle() {
    errorTitle = "Unable to connect"
    if (ErrorCode === ConnectError_RequireWirelessSettings) {
        errorTitle = "Wireless settings required"
    }
    return errorTitle;
}
/*
    Handles body generation for a connection error.
    @return base The body to display for a connection error.
*/
function FriendlyErrorBody(includeExtra) {
    let base = "Your" + ProductShortName + " could not connect to the Internet.";
    if (ErrorCode === ConnectError_RequireWirelessSettings) {
        base += " Your need to choose a wireless network and enter its security information.";
    }
    if (includeExtra) {
        base += " Check your cables or wireless settings, then try again.";
    }
    return "<p>" + base + "</p>";
}
/*
    Additional connection error cases. 
    @return shortError The error message to be displayed.
*/
function ShortErrorMessage() {
    shortError = "Connection failed."
    switch(ErrorCode) {
        case ConnectError_NoDialTone:
            shortError = "No dial tone detected.";
        case ConnectError_NoLine:
            shortError = "No network cable detected.";
    }
    return shortError;
}

/*
    An object designed to simulate the TVShell of the MSN 2 TV box's internal API.
*/
let TVShell = {
    /*
        Logging TVShell message info in the console.
    */
    Message: function (givenMsg) {
        console.log("[TVShell.Message]", givenMsg);
    },
    /*
        Sets up a dummy panel object to work with.
    */
    PanelManager: {
        Item: function(givenName) {
            return { NoBackToMe: false };
        }
    },
    /*
        Sample network info.
    */
    WirelessAdapter: {
        Settings: {
            SSID: "My Test Network"
        },
        /*
            Returns a sample OK (0) status once connected.
        */
        CheckStatus: function() {
            return 0;
        }
    },
    EthernetAdapter: {
        /*
            Returns a sample OK (0) status once connected.
            Will use ConnectError_NoLine to simulate an unplugged device.
        */
        CheckStatus: function() {
            return 0;
        }
    },
    /*
        Would normally save network info. Since we only have one example
        network in the simulation, we simply log when a network save req is called.
    */
    Save: function() {
        console.log("[ConnectionManager.Save] called");
    }
};

// Connection type constants:
const MSNIAModemProviderName = "phone";
const BYOAEthernetProviderName = "broadband";

/*
    Allows the user to choose a connection type.
    @param givenConnectionType The connection type chosen by the user.
*/
function SetConnectionType(givenConnectionType) {
    UsingBroadband = (givenConnectionType === BYOAEthernetProviderName);
    UsingWireless = UsingBroadband;
    console.log("[SetConnectionType]", givenConnectionType, { UsingBroadband, UsingWireless });
}

/*
    Simulated login / registration.
*/
function LoginToService(givenContext) {
    // Logs the givenContext.
    console.log("[LoginToService] context =", givenContext);
    if (UsingBroadband) {
        window.location.href = "ConnectedWireless.html"
    }
    // Simulating that the box isn't plugged into a phone line.
    else {
        parameters.ErrorCode = ConnectError_NoDialTone;
        window.location.href = "ConnectionError.html";
    }
}