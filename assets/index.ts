import electron, { Menu } from 'electron';
import path from 'path';
import fs from 'fs';

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow: electron.BrowserWindow;
let saveWindow: electron.BrowserWindow;
let colorPickerWindow: electron.BrowserWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 2000,
        height: 2000,
        minWidth: 700,
        minHeight: 500,
    });
    mainWindow.maximize();
    mainWindow.loadURL(path.join(__dirname, 'html/main.html'));
    
    mainWindow.on('closed', () => {
        app.quit();
    })
    
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
});

function createSaveWindow(){
    saveWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        width: 300,
        height: 180,
        title: "Zapisz układ",
        minimizable: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        autoHideMenuBar: true,
        modal: true
    });
    saveWindow.loadURL(path.join(__dirname, 'html/save.html'));

    saveWindow.on('close', () => {
        mainWindow.setEnabled(true);
        saveWindow = null;
    })

    mainWindow.setEnabled(false);
}

ipcMain.on('save:circuit', (event, items) => {
    saveWindow.close();
    fs.writeFile(`/circuits/${items[0]}.dat`, JSON.stringify(items[1]), error => {});
})

let saveData;
ipcMain.on('open:save', (event, items) => {
    createSaveWindow();
    saveData = items;
})
ipcMain.on('get-data', () => {
    saveWindow.webContents.send('save:data', saveData);
    saveData = null;
})

const menuTemplate = [
    {
        label: "Plik",
        submenu: [
            {
                label: "Nowy układ",
                accelerator: "CmdOrCtrl+N",
                click(){
                    mainWindow.webContents.send('ask:new')
                }
            },
            {
                label: "Zapisz",
                accelerator: "CmdOrCtrl+S",
                click(){
                    mainWindow.webContents.send('ask:save');
                }
            }
        ]
    },
    {
        label: "Widok",
        submenu: [
            {
                label: "Tryb siatki",
                accelerator: 'CmdOrCtrl+G',
                click(){
                    mainWindow.webContents.send('ask:grid-toggle');
                }
            }
        ]
    },
    {
        label: "Dokumentacja",
        click(){
            alert("nie ma!")
        }
    }
];

if (process.platform == 'darwin')
    menuTemplate.unshift(null);