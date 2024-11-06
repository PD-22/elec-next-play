const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");

let appServe;

(async () => {
    if (app.isPackaged) {
        const { default: serve } = await import("electron-serve");
        appServe = serve({ directory: path.join(__dirname, "../out") });
    }

    const createWindow = async () => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js")
            }
        });

        if (app.isPackaged) {
            await appServe(win);
            win.loadURL("app://-");
        } else {
            win.loadURL("http://localhost:3000");
            win.webContents.openDevTools();
            win.webContents.on("did-fail-load", (e, code, desc) => {
                win.webContents.reloadIgnoringCache();
            });
        }
    };

    app.on("ready", createWindow);

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    ipcMain.handle('write-date', async (_, message) => {
        console.log('message:', message);
        const output = path.join(app.getPath('desktop'), 'date.txt');
        await fs.writeFile(output, message);
        console.log('output:', output);
        return output;
    });
})();
