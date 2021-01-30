const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let credentials = getCreds();
let loggedIn = false, listener = true;
let credWin;

function bootWindow(){
    const win = new BrowserWindow({
        show: false
    });

    win.loadURL('https://qasmt.eq.daymap.net/daymap/student/dayplan.aspx');
    win.webContents.on('did-stop-loading', () => win.maximize());

    globalShortcut.register('Ctrl+\\', ()=>{
        win.isVisible() ? win.hide() : win.show();
    });
};

app.once('ready', bootWindow);

app.on('login', (event, webContents, details, authInfo, callback) => {
    if (listener){
        console.log('listener added', listener);
        listener = false;
        ipcMain.on('auth', () => {
            credWin.close();
            credentials = getCreds();
            callback(credentials.username, credentials.password);
            loggedIn = true;
        });
    };
    event.preventDefault();
    if (!credentials.username || !credentials.password){
        console.log('none', loggedIn);
        bootCredentials();
    } else if (!loggedIn){
        console.log('first time', loggedIn);
        loggedIn = true;
        callback(credentials.username, credentials.password);
    } else {
        console.log('fail', loggedIn);
        loggedIn = false;
        bootCredentials('fail');
    };
});
function bootCredentials(fail){
    credWin = new BrowserWindow({
        width: 400,
        height: 210,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    credWin.loadFile(path.join(app.getAppPath(),'./credWin.html'));
    if (fail) credWin.webContents.send('fail', true);
};
function getCreds() {return JSON.parse(fs.readFileSync(path.join(app.getAppPath(),'./credentials.json')));};

ipcMain.on('appPath', event => {
    event.returnValue = app.getAppPath();
})