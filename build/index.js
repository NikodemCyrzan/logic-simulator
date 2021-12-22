"use strict";

var _electron = _interopRequireDefault(require("electron"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  app,
  BrowserWindow
} = _electron.default;
let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(_path.default.join(__dirname, 'main.html'));
});