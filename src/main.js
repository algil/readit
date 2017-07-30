const { app, ipcMain } = require('electron');
const mainWindow = require('./main-window');
const readItem = require('./read-item');

// Enable Electron-Reload
require('electron-reload')(__dirname);

ipcMain.on('new-item', (event, itemUrl) => {
  //Get read item with readItem module
  readItem(itemUrl, (item) => {
    event.sender.send('new-item-success', item);
  });
});

app.on('ready', mainWindow.createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow.createWindow();
  }
});