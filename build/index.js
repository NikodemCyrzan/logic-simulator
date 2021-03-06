"use strict";

var _electron = _interopRequireWildcard(require("electron"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  app,
  BrowserWindow,
  ipcMain
} = _electron.default;
let mainWindow;
let saveWindow;
let colorPickerWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    width: 2000,
    height: 2000,
    minWidth: 700,
    minHeight: 500
  });
  mainWindow.maximize();
  mainWindow.loadURL(_path.default.join(__dirname, 'html/main.html'));
  mainWindow.on('closed', () => {
    app.quit();
  });

  const mainMenu = _electron.Menu.buildFromTemplate(menuTemplate);
});

function createSaveWindow() {
  saveWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    width: 300,
    height: 180,
    title: "Zapisz uk??ad",
    minimizable: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    autoHideMenuBar: true,
    modal: true
  });
  saveWindow.loadURL(_path.default.join(__dirname, 'html/save.html'));
  saveWindow.on('close', () => {
    mainWindow.setEnabled(true);
    saveWindow = null;
  });
  mainWindow.setEnabled(false);
}

ipcMain.on('save:circuit', (event, items) => {
  saveWindow.close();

  _fs.default.writeFile(`/circuits/${items[0]}.dat`, JSON.stringify(items[1]), error => {});
});
let saveData;
ipcMain.on('open:save', (event, items) => {
  createSaveWindow();
  saveData = items;
});
ipcMain.on('get-data', () => {
  saveWindow.webContents.send('save:data', saveData);
  saveData = null;
});
const menuTemplate = [{
  label: "Plik",
  submenu: [{
    label: "Nowy uk??ad",
    accelerator: "CmdOrCtrl+N",

    click() {
      mainWindow.webContents.send('ask:new');
    }

  }, {
    label: "Zapisz",
    accelerator: "CmdOrCtrl+S",

    click() {
      mainWindow.webContents.send('ask:save');
    }

  }]
}, {
  label: "Widok",
  submenu: [{
    label: "Tryb siatki",
    accelerator: 'CmdOrCtrl+G',

    click() {
      mainWindow.webContents.send('ask:grid-toggle');
    }

  }]
}, {
  label: "Dokumentacja",

  click() {
    alert("nie ma!");
  }

}];
if (process.platform == 'darwin') menuTemplate.unshift(null);