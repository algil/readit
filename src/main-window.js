const {BrowserWindow} = require('electron');

exports.window = null;
exports.createWindow = () => {
  this.window = new BrowserWindow({
    width: 500,
    height: 650,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 310
  });

  //this.window.webContents.openDevTools();
  this.window.loadURL(`file://${__dirname}/app/main.html`);
  this.window.on('closed', () => {
    this.window = null;
  });
};