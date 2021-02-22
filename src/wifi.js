const wifictrl = require('node-wifi');
const wifi = {};

// Initialize wifi module
// Absolutely necessary even to set interface to null
wifictrl.init({
    iface: null // network interface, choose a random wifi interface if set to null
});

wifi.getCurrentConnections = function (params) {
    return wifictrl.getCurrentConnections((error, currentConnections) => {
        if (error) {
            return error;
        } else {
            return currentConnections;
        }
    });    
}

wifi.scan = function () {
    return wifictrl.scan((error, networks) => {
        if (error) {
            return error;
        } else {
            return networks;
        }
    });
}

// Connect to a network
wifictrl.connect({ ssid: 'ssid', password: 'password' }, error => {
    if (error) {
        console.log(error);
    }
    console.log('Connected');
});

// Disconnect from a network
// not available on all os for now
wifictrl.disconnect(error => {
    if (error) {
        console.log(error);
    } else {
        console.log('Disconnected');
    }
});

// Delete a saved network
// not available on all os for now
wifictrl.deleteConnection({ ssid: 'ssid' }, error => {
    if (error) {
        console.log(error);
    } else {
        console.log('Deleted');
    }
});