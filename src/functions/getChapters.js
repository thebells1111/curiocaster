import sortChapters from "./sortChapters";

export default async function getChapters(url) {
  if (!url) {
    return;
  }

  try {
    const res = await fetch(
      `/api/httpsproxy?url=` +
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