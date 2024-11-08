'use client';

import { useState } from 'react';
import { z } from 'zod';

interface Caption {
  startTime: string;
  line: string;
}

const ChapterSchema = z.object({
  startingTime: z.string(),
  title: z.string(),
  summary: z.string(),
});
type Chapter = z.infer<typeof ChapterSchema>;

// TEMP: temp debug init url
const INIT_URL = 'GpI68hQ3acM';

export default function YoutubeCaptionExtractor() {
  const [videoId, setVideoId] = useState<string>(INIT_URL);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chapterizing, setChapterizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const extractVideoId = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v') || '';
      }
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    setCaptions([]);
    setChapters([]); // Clear chapterized summary when starting a new extraction

    try {
      const extractedVideoId = extractVideoId(videoId);
      const newCaptions = await window.electron.ipcRenderer.invoke(
        'get-subtitles',
        { url: extractedVideoId, language: '', format: 'vtt' },
      );
      setCaptions(newCaptions || []);
    } catch (e: any) {
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const parseTimecode = (timecode: string): number => {
    const [hours, minutes, seconds] = timecode.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleCopySubtitles = () => {
    const formattedSubtitles = captions
      .map((caption) => `${caption.startTime} ${caption.line}`)
      .join('\n');

    navigator.clipboard
      .writeText(formattedSubtitles)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
        return true;
      })
      .catch((err) => setError(`Failed to copy: ${err.message}`));
  };

  const sendMessageToOpenAI = async (
    messages: { role: string; content: string }[],
  ) => {
    try {
      const data = await window.electron.ipcRenderer.invoke(
        'request-openai',
        messages,
      );
      const err = data?.error;
      if (err && typeof err === 'string') throw new Error(err);
      return data.choices[0].message.content;
    } catch (e: any) {
      console.error('Error:', e);
      throw e;
    }
  };

  const handleChapterizeSubtitles = async () => {
    const formattedSubtitles = captions
      .map((caption) => `${caption.startTime} ${caption.line}`)
      .join('\n');

    const messages = [
      {
        role: 'user',
        content: formattedSubtitles,
      },
      {
        role: 'user',
        content: `Chapterize video subtitles provided below based on text and timecodes.
                  - Chapter number can be flexible. It should depend on: logical block count, total video length.
                  - Each chapter size not less than 13% of video duration, and not more than 20% of video duration.
                  - For each chapter: show when it starts, its short title (up to 7 words), its short summary (up to 50 words, but explaining main ideas).
                  - Keep chapter title and short summaries language the same as subtitles language.
                  - Return result as JSON array. Each element like: {startingTime: "XX:XX:XX", title: "", summary: ""}`,
      },
    ];

    try {
      setChapterizing(true);
      setChapters([]);
      const response = await sendMessageToOpenAI(messages);
      // Clean up the response to isolate the JSON array if there is extra surrounding text
      const jsonStart = response.indexOf('[');
      const jsonEnd = response.lastIndexOf(']');
      const cleanResponse = response.substring(jsonStart, jsonEnd + 1);

      // Parse the cleaned response as JSON
      const json = JSON.parse(cleanResponse);
      const chapterData: Chapter[] = z.array(ChapterSchema).parse(json);
      setChapters(chapterData);
    } catch (e) {
      if (!(e && typeof e === 'object' && 'message' in e))
        throw new Error('invalid error type');
      setError(`Error: ${e.message}`);
    } finally {
      setChapterizing(false);
    }
  };

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold mb-8">YouTube Caption Extractor</h1>
      <input
        type="text"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        placeholder="Enter YouTube video ID or link"
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={handleExtract}
          style={{
            padding: '10px 20px',
            border: '1px solid #333',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Extracting...' : 'Extract'}
        </button>

        {captions.length > 0 && (
          <>
            <button
              type="button"
              onClick={handleCopySubtitles}
              style={{
                padding: '10px 20px',
                border: '1px solid #333',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Copy Subtitles
            </button>
            <button
              type="button"
              onClick={handleChapterizeSubtitles}
              style={{
                padding: '10px 20px',
                border: '1px solid #333',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {chapterizing ? 'Chapterizing...' : 'Chapterize Subtitles'}
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display Chapterized Output */}
        {chapters.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h1>Chapterized Output:</h1>
            {chapters.map((chapter, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                style={{ marginBottom: '10px' }}
              >
                <a
                  href={`https://www.youtube.com/watch?v=${extractVideoId(videoId)}&t=${parseTimecode(chapter.startingTime)}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  <strong>
                    {chapter.startingTime} {chapter.title}
                  </strong>
                </a>

                <p>{chapter.summary}</p>
              </div>
            ))}
          </div>
        )}

        {/* Display Extracted Captions */}
        {captions.length > 0
          ? captions.map((caption, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>
                <a
                  href={`https://www.youtube.com/watch?v=${extractVideoId(videoId)}&t=${Math.floor(parseTimecode(caption.startTime))}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  <strong>{caption.startTime}</strong>
                </a>
                : {caption.line}
              </div>
            ))
          : !loading && !error && <p>No captions found.</p>}
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
