const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const wifi = require('node-wifi');
const ip = require('ip');
var exec = require('child_process').exec;

wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
});

// Dev enviroment
if (process.env.NODE_DEV === 'dev') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

//Development
let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/index.html"),
        protocol: 'file',
        slashes: true
    }))
    mainWindow.setFullScreen(true);

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
})

function shutdown(callback){
    exec('shutdown now', function(error, stdout, stderr){ callback(stdout); });
}

function reboot(callback){
    exec('shutdown -r now', function(error, stdout, stderr){ callback(stdout); });
}

ipcMain.on('shutdown', (e, obj) => {
    shutdown(function(output){ console.log(output); });
})

ipcMain.on('restart', (e, obj) => {
    reboot(function(output){ console.log(output); });
})

ipcMain.on('getip', (e, obj) => {
    mainWindow.webContents.send('wifi:ip' ,ip.address());
})

// Wifi start
ipcMain.on('wifi:new', (e, obj) => {
    wifi.connect({ ssid: obj.name, password: obj.pass }, error => {
        if (error) {
            console.log(error);
        }
        console.log('Connected');
        mainWindow.webContents.send('wifi:ip' ,ip.address());
    });
})

ipcMain.on('wifi:scan', (e, obj) => {
    wifi.scan((error, networks) => {
        if (error) {
            return error;
        } else {
            mainWindow.webContents.send('wifi:list', networks);
        }
    });
})

ipcMain.on('wifi:disconnect', (e, obj) => {
    wifi.disconnect(error => {
        if (error) {
            console.log(error);
        } else {
            console.log('Disconnected');
        }
    });
})

ipcMain.on('wifi:current', (e, obj) => {
    wifi.getCurrentConnections((error, currentConnections) => {
        if (error) {
            console.log(error);
        } else {
            console.log(currentConnections);
        }
    });
})

ipcMain.on('wifi:delete', (e, obj) => {
    wifi.deleteConnection({ ssid: obj.name }, error => {
        if (error) {
            console.log(error);
        } else {
            console.log('Deleted');
        }
    });
})
// Wifi end

// Interaction start
ipcMain.on('int:start', (e, obj) => {
    mainWindow.webContents.send('fullscreen');
})
// Interaction end

const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    })
}

if (process.env.NODE_DEV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [{
                label: 'Show/Hide Dev Tools',
                accelerator: 'F12',
                click(item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }}, {
                role: 'reload',
                accelerator: 'F5'
            }
        ]
    })
}