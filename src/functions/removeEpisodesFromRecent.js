import { recentEpisodes } from '$/stores';
import { get } from 'svelte/store';

export default function removeEpisodesFromRecent(id) {
	let $recentEpisodes = get(recentEpisodes);
	$recentEpisodes = $recentEpisodes.filter((v) => {
		return v.podcast != id;
	});
	recentEpisodes.set($recentEpisodes);
}
