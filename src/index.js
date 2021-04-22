const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const wifi = require('node-wifi');
const ip = require('ip');
const shutdown = require('electron-shutdown-command');
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

let mainWindow, wifiWindow, intWindow;

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

ipcMain.on('shutdown', (e, obj) => {
    exec('shutdown now', function(error, stdout, stderr){ callback(stdout); });
})

ipcMain.on('restart', (e, obj) => {
    exec('shutdown -r now', function(error, stdout, stderr){ callback(stdout); });
})

ipcMain.on('getip', (e, obj) => {
    mainWindow.webContents.send('wifi:ip' ,ip.address());
})

// Wifi start
function createWifiWindow() {
    wifiWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        title: 'Configurar Wifi',
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true
        }
    });
    //productWindow.setMenu(null);
    wifiWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/wifi.html"),
        protocol: 'file',
        slashes: true
    }))

    wifiWindow.on('closed', () => {
        wifiWindow = null;
    })
}

ipcMain.on('wifi:window', (e, obj) => {
    createWifiWindow();
})

ipcMain.on('wifi:new', (e, obj) => {
    console.log('ssid: ' + obj.name + ', password: ' + obj.pass);
    wifi.connect({ ssid: obj.name, password: obj.pass }, error => {
        if (error) {
            console.log(error);
        }
        console.log('Connected');
        mainWindow.webContents.send('wifi:ip' ,ip.address());
    });
    wifiWindow.close();
})

ipcMain.on('wifi:scan', (e, obj) => {
    wifi.scan((error, networks) => {
        if (error) {
            return error;
        } else {
            wifiWindow.webContents.send('wifi:list', networks);
        }
    });
})
// Wifi end

// Interaction start
function createIntWindow() {
    intWindow = new BrowserWindow({
        width: 1280,
        height: 480,
        title: 'Interacciones',
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true
        }
    });
    intWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/int.html"),
        protocol: 'file',
        slashes: true
    }))

    intWindow.on('closed', () => {
        intWindow = null;
    })
}

ipcMain.on('int:window', (e, obj) => {
    createIntWindow();
})
ipcMain.on('int:start', (e, obj) => {
    intWindow.close();
    mainWindow.webContents.send('fullscreen');
})
// Interaction end

const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Configurar Wifi',
                accelerator: 'Ctrl+W',
                click() {
                    createWifiWindow();
                }
            },
            {
                label: 'Remove All Products',
                click() {
                    mainWindow.webContents.send('products:remove-all')
                }
            },
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
        submenu: [
            {
                label: 'Show/Hide Dev Tools',
                accelerator: 'F12',
                click(item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }
            }, {
                role: 'reload',
                accelerator: 'F5'
            }
        ]
    })
}