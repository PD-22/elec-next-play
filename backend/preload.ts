/* eslint-disable @typescript-eslint/no-var-requires */
// Electron doesnt support ESM for renderer process. Alternatively, pass this file
// through a bundler but that feels like an overkill
const { contextBridge, ipcRenderer } = require('electron')

const handler = {
	send(channel: string, value: unknown) {
		ipcRenderer.send(channel, value)
	},
	on(channel: string, callback: (...args: unknown[]) => void) {
		const subscription = (_event: unknown, ...args: unknown[]) =>
			callback(...args)
		ipcRenderer.on(channel, subscription)

		return () => {
			ipcRenderer.removeListener(channel, subscription)
		}
	},
	invoke(channel: string, ...args: unknown[]): unknown {
		return ipcRenderer.invoke(channel, ...args)
	},
}

contextBridge.exposeInMainWorld('ipc', handler)
