const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const fs = require('fs');

let credentials = getCreds();
let loggedIn = false;

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
    ipcMain.on('auth', () => {
        credentials = getCreds();
        callback(credentials.username, credentials.password);
        loggedIn = true;
    });
    event.preventDefault();
    if (!credentials.username || !credentials.password){
        bootCredentials();
    };
    if (!loggedIn){
        callback(credentials.username, credentials.password);
        loggedIn = true;
    } else {
        bootCredentials('fail');
        loggedIn = false;
    };
});
function bootCredentials(fail){
    const credWin = new BrowserWindow({
        width: 400,
        height: 210,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    credWin.loadFile('./credWin.html');
    if (fail) credWin.webContents.send('fail', true);
};
function getCreds() {return JSON.parse(fs.readFileSync('./credentials.json'));};