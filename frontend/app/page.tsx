'use client'

import styles from './page.module.css'

export default function Home() {
	const handleFetch = async () => {
		const date = new Date().toISOString()
		const output = await window.ipc.invoke('write-date', date)
		console.log(`write "${date}" to "${output}"`)
	}

	return (
		<div className={styles.wrapper}>
			<button className="border p-2" onClick={handleFetch} autoFocus>
				Write Date to Desktop
			</button>
		</div>
	)
}
