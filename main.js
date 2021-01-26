const { app, BrowserWindow, globalShortcut } = require('electron');

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