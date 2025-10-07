import { parse } from '@plussub/srt-vtt-parser';
import { remoteServer } from '$/stores';

export default async function getTranscript(transcripts) {

  const transcriptFile = transcripts?.find(
    ({ type }) =>
      type === "application/srt" ||
      type === "text/srt" ||
      type === "application/x-subrip" ||
      type === "text/vtt"
  );

  if (!transcriptFile?.url) {
    return null;
  }

  try {
    const res = await fetch(remoteServer + `api/proxy?url=` + encodeURIComponent(transcriptFile.url));

    if (res.status !== 200) {
      console.error(`Failed to load transcript: ${res.status}`);
      return null;
    }

    const text = await res.text();
    const parsed = parse(text);

    // convert to old transcript format
    const transcript = parsed.entries.map(x => ({
      id: x.id,
      start: x.from / 1000, // ms to seconds
      end: x.to / 1000,
      text: x.text,
    }));

    const t = transcript
      .map((v) => v.text)
      .join(' ')
      .replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ');

    transcript.full = t.split('|-|').join(' ');

    return transcript;
  }
  catch (err) {
    console.error("Error getting episode transcript:", err);
    return null;
  }
}
