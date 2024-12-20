export default function sortPodcastList(list, pinNew) {
	let sorted = list.sort((a, b) => {
		return a.title > b.title ? 1 : -1;
	});
	return sorted;
}
