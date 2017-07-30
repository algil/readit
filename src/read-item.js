const { BrowserWindow } = require('electron');

let bgItemWindow;

module.exports = (url, callback) => {

  //Create new offscreen window
  bgItemWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    show: false,
    webPreferences: {
      offscreen: true
    }
  });

  //Load read item
  bgItemWindow.loadURL(url);

  //Wait for page to finish loading
  bgItemWindow.webContents.on('did-finish-load', () => {
    //Get screenshot (thumbnail)
    bgItemWindow.webContents.capturePage((image) => {
      //Get image as dataURI
      let screenshot = image.toDataURL();

      //Get page title
      let title = bgItemWindow.getTitle();

      //Return new item via callback
      callback({ title, screenshot, url});

      //Clean up
      bgItemWindow.close();
      bgItemWindow = null;
    });
  });
};