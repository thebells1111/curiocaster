import { liveEpisodes, pendingEpisodes, feedItems } from '$/stores';
import checklive from './checklive.js';

function parseValue(v) {
	if (v) {
		let value = {
			model: {
				method: v['@_method'],
				suggested: v['@_suggested'],
				type: v['@_type']
			}
		};
		let destinations = v['podcast:valueRecipient'].map((w) => {
			return {
				address: w['@_address'],
				customKey: w['@_customKey'],
				customValue: w['@_customValue'],
				name: w['@_name'],
				split: w['@_split'],
				type: w['@_type']
			};
		});

		value.destinations = destinations;
		return value;
	}
	return undefined;
}
export default async function getRSSEditorFeed(url) {
	return new Promise(async (resolve, reject) => {
		const feed = await checklive(encodeURIComponent(url));
		console.log(feed);

		liveEpisodes.set(feed.live || []);

		pendingEpisodes.set(feed.pending || []);

		feedItems.set(feed.item || []);

		resolve(feed);
	});
}
