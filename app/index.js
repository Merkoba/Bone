const {session, app, BrowserWindow, globalShortcut} = require('electron')
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

    win.on('focus', () => 
    {
        globalShortcut.register('CommandOrControl+F', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-find', '')
            }
        })

        globalShortcut.register('CommandOrControl+T', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-new-space', '')
            }
        })

        globalShortcut.register('CommandOrControl+N', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-new-space', '')
            }
        })

        globalShortcut.register('CommandOrControl+=', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-zoom-in', '')
            }
        })

        globalShortcut.register('CommandOrControl+-', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-zoom-out', '')
            }
        })

        globalShortcut.register('CommandOrControl+0', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-zoom-reset', '')
            }
        })

        globalShortcut.register('CommandOrControl+Enter', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-show-recent', '')
            }
        })

        globalShortcut.register('CommandOrControl+Left', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-webview-cycle-left', '')
            }
        })

        globalShortcut.register('CommandOrControl+Right', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-webview-cycle-right', '')
            }
        })

        globalShortcut.register('CommandOrControl+Shift+Left', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-space-cycle-left', '')
            }
        })

        globalShortcut.register('CommandOrControl+Shift+Right', function () 
        {
            if(win && win.webContents) 
            {
                win.webContents.send('on-space-cycle-right', '')
            }
        })
    })

    win.on('blur', () => 
    {
        unregister_shortcuts()
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
    unregister_shortcuts()

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

function unregister_shortcuts()
{
    globalShortcut.unregister('CommandOrControl+F')
    globalShortcut.unregister('CommandOrControl+T')
    globalShortcut.unregister('CommandOrControl+N')
    globalShortcut.unregister('CommandOrControl+=')
    globalShortcut.unregister('CommandOrControl+-')
    globalShortcut.unregister('CommandOrControl+0')
    globalShortcut.unregister('CommandOrControl+Enter')
    globalShortcut.unregister('CommandOrControl+Left')
    globalShortcut.unregister('CommandOrControl+Right')
    globalShortcut.unregister('CommandOrControl+Shift+Left')
    globalShortcut.unregister('CommandOrControl+Shift+Right')
}