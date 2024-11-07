import { FormEvent, useState } from 'react';

const initUrl = 'GpI68hQ3acM';

export default function Home() {
  const [url, setUrl] = useState(initUrl);
  const [subtitles, setSubtitles] = useState('');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSubtitles('Loading...');
      const data = await window.electron.ipcRenderer.invoke(
        'get-subtitles',
        url,
      );
      console.log(data);
      const newSubtitles = data
        .filter((x: any) => x.line)
        .map((x: any) => `[${x.startTime}] ${x.line}`)
        .join('\n');
      if (!newSubtitles) throw new Error(`Invalid subtitles "${newSubtitles}"`);
      setSubtitles(newSubtitles);
    } catch (error) {
      console.error(error);
      setSubtitles('Error');
    }
  };

  return (
    <div>
      <form className="flex gap-1" onSubmit={submitHandler}>
        <input
          className="bg-background text-foreground border px-2 py-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v="
        />
        <button className="border px-2 py-1" type="submit">
          Extract Subtitles
        </button>
      </form>
      <pre className="px-2 py-1">{subtitles}</pre>
    </div>
  );
}
