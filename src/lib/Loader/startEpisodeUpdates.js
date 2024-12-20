import { devMode } from '$/stores';
import updateEpisodes from './updateEpisodes';

export default function startEpisodeUpdates() {
	if (!devMode) {
		setTimeout(updateEpisodes.bind(this, 'initial'), 1000);
	}
	setInterval(updateEpisodes, 30 * 60 * 1000);
}
