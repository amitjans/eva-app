const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const wifi = require('node-wifi');

wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
});

// Dev enviroment
if (process.env.NODE_DEV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

//Development

let mainWindow, wifiWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/index.html"),
        protocol: 'file',
        slashes: true
    }))
    //mainWindow.setFullScreen(true);

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
})

function createWifiWindow() {
    wifiWindow = new BrowserWindow({
        width: 900,
        height: 480,
        title: 'Configurar Wifi',
        webPreferences: {
            nodeIntegration: true
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

ipcMain.on('wifi:new', (e, obj) => {
    console.log('ssid: ' + obj.name + ', password: ' + obj.pass);
    wifi.connect({ ssid: obj.name, password: obj.pass }, error => {
        if (error) {
            console.log(error);
        }
        console.log('Connected');
    });
    wifiWindow.close();
})

ipcMain.on('wifi:scan', (e, obj) => {
    wifi.scan((error, networks) => {
        if (error) {
            return error;
        } else {
            console.log(networks);
            wifiWindow.webContents.send('wifi:list', networks);
        }
    });
})

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
                accelerator: 'Ctrl+D',
                click(item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }
            }, {
                role: 'reload'
            }
        ]
    })
}