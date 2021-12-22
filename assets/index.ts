import electron from 'electron';
import path from 'path';

const {app, BrowserWindow} = electron;

let mainWindow: electron.BrowserWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(path.join(__dirname, 'main.html'));
});
let a;