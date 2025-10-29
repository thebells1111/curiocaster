import sortChapters from "./sortChapters";
import { remoteServer } from '$/stores';

export default async function getChapters(url) {
  if (!url) {
    return;
  }

  try {
    const res = await fetch(
      remoteServer + `api/proxy?url=` +
        encodeURIComponent(url)
    );
    const chapters = await res.json();
    return sortChapters(chapters);
  }
  catch (err) {
    console.error('Unable to load chapters: ' + err);
    return;
  }
}