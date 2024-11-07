import path from 'node:path'
import { app, BrowserWindow, ipcMain, screen } from 'electron'
import log from 'electron-log'
import electronUpdater from 'electron-updater'
import electronIsDev from 'electron-is-dev'
import ElectronStore from 'electron-store'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs/promises'
import ytdl from '@distube/ytdl-core';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { autoUpdater } = electronUpdater
let appWindow: BrowserWindow | null = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = new ElectronStore()

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

const installExtensions = async () => {
	/**
	 * NOTE:
	 * As of writing this comment, Electron does not support the `scripting` API,
	 * which causes errors in the REACT_DEVELOPER_TOOLS extension.
	 * A possible workaround could be to downgrade the extension but you're on your own with that.
	 */
	/*
	const {
		default: electronDevtoolsInstaller,
		//REACT_DEVELOPER_TOOLS,
		REDUX_DEVTOOLS,
	} = await import('electron-devtools-installer')
	// @ts-expect-error Weird behaviour
	electronDevtoolsInstaller.default([REDUX_DEVTOOLS]).catch(console.log)
	*/
}

const spawnAppWindow = async () => {
	if (electronIsDev) await installExtensions()

	const RESOURCES_PATH = electronIsDev
		? path.join(__dirname, '../../assets')
		: path.join(process.resourcesPath, 'assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths)
	}

	const PRELOAD_PATH = path.join(__dirname, 'preload.js')

	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	appWindow = new BrowserWindow({
		width: width / 2,
		height: height,
		x: 0,
		y: 0,
		icon: getAssetPath('icon.png'),
		show: false,
		webPreferences: {
			preload: PRELOAD_PATH,
		},
	})

	appWindow.loadURL(
		electronIsDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../../frontend/build/index.html')}`
	)
	// appWindow.maximize()
	appWindow.setMenu(null)
	appWindow.show()

	appWindow.webContents.openDevTools({ mode: 'right' })

	appWindow.on('closed', () => {
		appWindow = null
	})
}

app.on('ready', () => {
	new AppUpdater()
	spawnAppWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

/*
 * ======================================================================================
 *                                IPC Main Events
 * ======================================================================================
 */

ipcMain.handle('get-subtitles', async (_, url) => {
	console.log('get-subtitles', url)
	const result = await getCaptions(url)
	console.log('result length', result.length);
	return result;
})

function extractVideoId(urlOrId: string): string {
	// If it's already an ID (11 characters), return it
	if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
		return urlOrId;
	}

	try {
		const url = new URL(urlOrId);
		// Handle youtube.com/watch?v=ID
		if (url.hostname.includes('youtube.com')) {
			return url.searchParams.get('v') || '';
		}
		// Handle youtu.be/ID
		if (url.hostname === 'youtu.be') {
			return url.pathname.slice(1);
		}
	} catch (e) {
		throw new Error('Invalid YouTube URL or video ID');
	}

	throw new Error('Could not extract video ID from URL');
}

async function getCaptions(urlOrId: string, language: string = '', format: string = 'vtt'): Promise<{ startTime: string, line: string }[]> {
	try {
		const videoId = extractVideoId(urlOrId);
		if (!videoId) throw new Error('Invalid YouTube URL or video ID');

		console.log(`Fetching captions for video ID: ${videoId}`);

		const info = await ytdl.getInfo(videoId);
		const trackList = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;

		if (!trackList || trackList.length === 0) {
			throw new Error('No captions available for the provided video URL.');
		}

		const targetTrack = trackList.find((track: any) => !language || track.languageCode === language);
		if (!targetTrack) throw new Error('No captions found for the specified language.');

		const captionUrl = `${targetTrack.baseUrl}&fmt=${format}`;
		const response = await fetch(captionUrl);
		const captionText = await response.text();

		const subtitles = [];
		// Choose regex pattern based on caption format
		const regexPattern = captionText.includes('align:start position')
			? /(\d{2}:\d{2}:\d{2})\.\d{3}.*?align:start position.*?align:start position.*?\n(.*?)\n/gs
			: /(\d{2}:\d{2}:\d{2})\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}(.*?)\n\n/gs;
		const subtitleBlocks = captionText.matchAll(regexPattern);

		for (const match of subtitleBlocks) {
			const startTime = match[1];
			const lineText = match[2].trim();
			subtitles.push({ startTime, line: lineText });
		}
		return subtitles;
	} catch (error: any) {
		console.error(`Error fetching captions: ${error.message}`);
		throw new Error(`Error fetching captions: ${error.message}`);
	}
}
