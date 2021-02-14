process.on('uncaughtException', function (err) {
    app.relaunch();
    app.exit();
});

const { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let credentials = getCreds();
let loggedIn = false, listener = true;
let authWin;
let tray = null; 

function bootWindow(){
    const win = new BrowserWindow({
        show: false,
        icon: path.join(app.getAppPath(), './imgs/favicon.ico'),
        webPreferences: {
            preload: path.join(app.getAppPath(), './preload.js')
        }
    });

    win.loadURL('https://qasmt.eq.daymap.net/daymap/student/dayplan.aspx');
    win.webContents.on('did-stop-loading', () => win.maximize());

    globalShortcut.register('Ctrl+\\', ()=>{
        win.isVisible() ? win.hide() : win.show();
    });

    win.on('close', function (event) {
        if (!app.isQuiting){
            event.preventDefault();
            win.hide();
        }
    
        return false;
    });

    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Quit', 
            click:  function(){
                app.isQuiting = true;
                app.quit();
            } 
        }
    ]);

    tray = new Tray(path.join(app.getAppPath(), './imgs/favicon.ico'));
    tray.setToolTip('Right click for options');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => win.show())

};

app.once('ready', bootWindow);

app.on('login', (event, webContents, request, authInfo, callback) => {
    if (listener){
        listener = false;
        ipcMain.on('auth', () => {
            authWin.close();
            credentials = getCreds();
            callback(credentials.proxyUsername, credentials.proxyPassword);
            loggedIn = true;
        });
    };
    event.preventDefault();
    if (!credentials.proxyUsername || !credentials.proxyPassword){
        bootCredentials();
    } else if (!loggedIn){
        loggedIn = true;
        callback(credentials.proxyUsername, credentials.proxyPassword);
    } else {
        loggedIn = false;
        bootCredentials();
    };
});

function bootCredentials(){
    authWin = new BrowserWindow({
        width: 400,
        height: 210,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    authWin.loadFile(path.join(app.getAppPath(),'./authWin.html'));

};

function getCreds() {return store.store};

ipcMain.on('getStore', event => event.returnValue = store.store);
ipcMain.on('setStore', (event, data) => store.store = data);