export default function sortChapters(chapters) {
  if (!chapters || !chapters.chapters || chapters.chapters.length === 0) {
    return undefined;
  }

  return chapters.chapters.sort((a, b) => a.startTime - b.startTime);
}
