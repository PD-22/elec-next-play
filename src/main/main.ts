/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, ipcMain, screen, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import getCaptions from './captions';
import MenuBuilder from './menu';
import perplexity from './perplexity';
import { resolveHtmlPath } from './util';
import { clearApiKey, loadApiKey, saveApiKey } from './utils/settingsManager';
import requestOpenai from './openai';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

type GetSubtitles = { startTime: string; line: string }[];
ipcMain.handle(
  'get-subtitles',
  async (_, { url, language, format }): Promise<GetSubtitles> => {
    console.log('get-subtitles', { url, language, format });
    const result = await getCaptions(url, language, format);
    console.log('get-subtitles result length', result.length);
    return result;
  },
);

ipcMain.handle('perplexity', async (_, { Question, Instruction }) => {
  if (typeof Question !== 'string')
    throw new Error(`Invalid question: "${Question}"`);
  if (typeof Instruction !== 'string')
    throw new Error(`Invalid instruction: "${Instruction}"`);
  return perplexity(Question, Instruction);
});

// Error invoking remote method 'save-api-key': Error: Invalid serviceName: "OPENAI"
ipcMain.handle('save-api-key', (_, serviceName, key) => {
  if (serviceName !== 'OPENAI' && serviceName !== 'PERPLEXITY')
    throw new Error(`Invalid serviceName: "${serviceName}"`);
  if (typeof key !== 'string') throw new Error(`Invalid key: "${key}"`);
  saveApiKey(serviceName, key);
  return true;
});

ipcMain.handle('load-api-key', (_, serviceName) => loadApiKey(serviceName));

ipcMain.handle('clear-api-key', (_, serviceName) => {
  if (serviceName !== 'OPENAI' || serviceName !== 'PERPLEXITY')
    throw new Error(`Invalid serviceName: "${serviceName}"`);
  clearApiKey(serviceName);
  return true;
});

ipcMain.handle('request-openai', async (_, arg) => {
  const result = await requestOpenai(arg);
  return result;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDev = process.env.NODE_ENV === 'development';
const isDebug = isDev || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  if (isDev) mainWindow.setBounds({ x: 0, y: 0, width: width / 2, height });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
