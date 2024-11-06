'use client'

import { useState } from "react";

const initUrl = 'GpI68hQ3acM';

export default function Home() {
	const [url, setUrl] = useState(initUrl);
	const [subtitles, setSubtitles] = useState('');

	const clickHandler = async () => {
		try {
			setSubtitles('Loading...');
			const data = await window.ipc.invoke('get-subtitles', url);
			console.log(data);
			const newSubtitles = data
				.filter((x: any) => x.line)
				.map((x: any) => `[${x.startTime}] ${x.line}`)
				.join('\n');
			if (!newSubtitles)
				throw new Error(`Invalid subtitles "${newSubtitles}"`);
			setSubtitles(newSubtitles);
		} catch (error) {
			console.error(error);
			setSubtitles('Error');
		}
	};

	return (
		<div>
			<input
				value={url}
				onChange={e => setUrl(e.target.value)}
				placeholder="https://www.youtube.com/watch?v="
			/>
			<button onClick={clickHandler}>Extract Subtitles</button>
			<hr />
			<pre>{subtitles}</pre>
		</div>
	)
}
