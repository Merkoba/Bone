const fs = require('fs')
const {session, app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let bypass_save_dialog_url = false
let bypass_save_dialog_destination = false
let bypass_save_dialog_date = 0

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
    win.loadURL('file://' + path.join(__dirname, 'index.html'))

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
        register_shortcuts()
    })

    win.on('blur', () => 
    {
        unregister_shortcuts()
    })

    win.webContents.session.on('will-download', (event, item, webContents) => 
    {
        let dpath = app.getPath('downloads')

        if(bypass_save_dialog_url === item.getURL())
        {
            if(Date.now() - bypass_save_dialog_date < 10000)
            {
                dpath = bypass_save_dialog_destination
            }
        }
        
        if(fs.existsSync(dpath))
        {
            let file_split = path.basename(dpath).split('.')
            let num = Date.now().toString().slice(-4)
            let new_file_name = `${file_split.slice(0, -1).join('.')}_${num}.${file_split.slice(-1)[0]}`
            dpath = `${path.dirname(dpath)}/${new_file_name}`
        }
        
        item.setSavePath(dpath)
        let id = `${Date.now().toString().slice(-5)}_${random_sequence(5)}`
        win.webContents.send('download-start', {id:id, item:item})

        item.on('updated', (event, state) => 
        {
            win.webContents.send('download-update', {id:id, received_bytes:item.getReceivedBytes(), total_bytes:item.getTotalBytes()})
        })
        
        item.once('done', (event, state) => 
        {
            win.webContents.send('download-done', {id:id, destination:dpath, state:state})
        })
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
            console.info('Quitting normally')
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

function register_shortcut(keys, action)
{
    let f

    if(typeof action === 'string')
    {
        f = function()
        {
            win.webContents.send(action, '')
        }
    }

    else if(typeof action === 'function')
    {
        f = action
    }

    globalShortcut.register(keys, f)
}

function register_shortcuts()
{
    register_shortcut('CommandOrControl+F', 'on-find')
    register_shortcut('CommandOrControl+T', 'on-new-space')
    register_shortcut('CommandOrControl+N', 'on-new-space')
    register_shortcut('CommandOrControl+=', 'on-zoom-in')
    register_shortcut('CommandOrControl+-', 'on-zoom-out')
    register_shortcut('CommandOrControl+0', 'on-zoom-reset')
    register_shortcut('CommandOrControl+Enter', 'on-show-recent')
    register_shortcut('CommandOrControl+Tab', 'on-webview-cycle-right')
    register_shortcut('CommandOrControl+Shift+Tab', 'on-webview-cycle-left')
    register_shortcut('CommandOrControl+Left', 'on-space-cycle-left')
    register_shortcut('CommandOrControl+Right', 'on-space-cycle-right')
    register_shortcut('CommandOrControl+F5', 'on-hard-reload')
    register_shortcut('F5', 'on-reload')
    register_shortcut('F6', 'on-focus-url')
    register_shortcut('F12', () => win.toggleDevTools())
}

function unregister_shortcuts()
{
    globalShortcut.unregisterAll()
}

ipcMain.on('download-options-update', function(event, arg) 
{
    bypass_save_dialog_url = arg.bypass_save_dialog_url
    bypass_save_dialog_destination = arg.bypass_save_dialog_destination
    bypass_save_dialog_date = arg.bypass_save_dialog_date
    event.returnValue = 'ok'
})

function get_random_int(min, max, exclude=undefined)
{
    let num = Math.floor(Math.random() * (max - min + 1) + min)

    if(exclude !== undefined)
    {
        if(num === exclude)
        {
            if(num + 1 <= max)
            {
                num = num + 1
            }

            else if(num - 1 >= min)
            {
                num = num - 1
            }
        }
    }

    return num
}

function random_sequence(n)
{
    let s = ''

    for(let i=0; i<n; i++)
    {
        s += get_random_int(0, 9)
    }

    return s
}