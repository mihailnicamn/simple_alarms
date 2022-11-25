const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: "img/icon.icns",
    })
  
    win.loadFile('api.html')
  }

app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    app.quit();
  });
  