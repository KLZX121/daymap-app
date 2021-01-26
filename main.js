const { app, BrowserWindow, globalShortcut } = require('electron');

function bootWindow(){
    const win = new BrowserWindow({
    });
    win.loadURL('https://qasmt.eq.daymap.net/daymap/student/dayplan.aspx');
    globalShortcut.register('Ctrl+\\', ()=>{
        win.isVisible() ? win.hide() : win.show();
    });
};

app.once('ready', bootWindow);