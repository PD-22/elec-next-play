/* ********************************************************************
 *   Declaration file for the API exposed over the context bridge
 *********************************************************************/

export declare global {
	interface Window {
		ipc: IpcHandler
	}
}
