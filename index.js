const {session, app, BrowserWindow} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

exports.create_window = function() 
{
    // Create the browser window.
    win = new BrowserWindow(
    {
        width: 800, 
        height: 600, 
        frame:false,
        icon: __dirname + '/img/icon.png',
        webPreferences:
        {
            nodeIntegration: true,
            webviewTag: true,
            contextIsolation: false
        }
    })

    win.maximize()

    // and load the index.html of the app.
    win.loadURL("file://" + path.join(__dirname, "index.html"))

    // Emitted when the window is closed.
    win.on('closed', () => 
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('disable-smooth-scrolling')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', exports.create_window)

// Quit when all windows are closed.
app.on('window-all-closed', () => 
{
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if(process.platform !== 'darwin') 
    {
        session.defaultSession.cookies.flushStore()

        .then(()=>
        {
            console.info("Quitting normally")
            app.quit()
        })
        
        .catch(err =>
        {
            console.error(err)
            app.quit()
        })
    }
})

app.on('activate', () => 
{
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(win === null) 
    {
        create_window()
    }
})

// Listen for web contents being created
app.on('web-contents-created', (e, contents) => 
{
    // Check for a webview
    if(contents.getType() === 'webview') 
    {
        // Listen for any new window events
        contents.on('new-window', (e, url) => 
        {
            contents.loadURL(url)
        })
    }
})