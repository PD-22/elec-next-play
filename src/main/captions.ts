import ytdl from '@distube/ytdl-core';

// import { FileStringCache } from '../../../utils/fileStringCache'; // Adjust the path as needed

// interface CaptionRequest {
//   url: string;
//   language?: string;
//   format?: 'xml' | 'ttml' | 'vtt' | 'srv1' | 'srv2' | 'srv3';
// }

// const cache = new FileStringCache('captionsCache', './cache', 'captions', true);

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

export default async function getCaptions(
  urlOrId: string,
  language: string = '',
  format: string = 'vtt',
): Promise<{ startTime: string; line: string }[]> {
  // TEMP: fake youtube captions response
  // return Array.from({ length: 4 }, (_v, i) => ({
  //   startTime: `startTime #${i}`,
  //   line: `line #${i}`,
  // }));
  try {
    const videoId = extractVideoId(urlOrId);
    if (!videoId) throw new Error('Invalid YouTube URL or video ID');

    console.log(`Fetching captions for video ID: ${videoId}`);
    // const cacheKey = videoId;

    // const cachedCaptions = await cache.getCache(cacheKey);
    // if (cachedCaptions) {
    //   console.log('Returning cached captions', cachedCaptions);

    //   return JSON.parse(cachedCaptions);
    // }

    const info = await ytdl.getInfo(videoId);
    const trackList =
      info.player_response.captions?.playerCaptionsTracklistRenderer
        ?.captionTracks;

    if (!trackList || trackList.length === 0) {
      throw new Error('No captions available for the provided video URL.');
    }

    const targetTrack = trackList.find(
      (track: any) => !language || track.languageCode === language,
    );
    if (!targetTrack)
      throw new Error('No captions found for the specified language.');

    const captionUrl = `${targetTrack.baseUrl}&fmt=${format}`;
    const response = await fetch(captionUrl);
    const captionText = await response.text();

    // Choose regex pattern based on caption format
    const regexPattern = captionText.includes('align:start position')
      ? /(\d{2}:\d{2}:\d{2})\.\d{3}.*?align:start position.*?align:start position.*?\n(.*?)\n/gs
      : /(\d{2}:\d{2}:\d{2})\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}(.*?)\n\n/gs;
    console.log(regexPattern);
    const subtitleBlocks = captionText.matchAll(regexPattern);

    const subtitles = Array.from(subtitleBlocks).map((match) => {
      const startTime = match[1];
      const lineText = match[2].trim();
      return { startTime, line: lineText };
    });
    // await cache.saveCache(cacheKey, JSON.stringify(subtitles));
    return subtitles;
  } catch (error: any) {
    console.error(`Error fetching captions: ${error.message}`);
    throw new Error(`Error fetching captions: ${error.message}`);
  }
}
