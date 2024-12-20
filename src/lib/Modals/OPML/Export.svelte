<script>
	import { mainPodcastList, showOPML } from '$/stores';

	function exportOPML() {
		let newOpml = jsonToXML($mainPodcastList);
		let file = new Blob([newOpml], { type: 'text/xml' });

		let a = document.createElement('a');
		a.href = URL.createObjectURL(file);
		a.download = 'podcast.opml';
		a.click();
		a.remove();
		$showOPML = false;

		function escapeEntities(str) {
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			// replace(/&/g, '&amp;')
			// .replace(/"/g, '&quot;')
			// .replace(/'/g, '&apos;');
		}

		function jsonToXML(json) {
			return `<?xml version="1.0"?><opml version="1.0"><head><title>OPML exported from CurioCaster</title>
  <dateCreated>${new Date()}</dateCreated><dateModified>${new Date()}</dateModified></head><body>${json
				.map(
					(podcast) =>
						`<outline text="${escapeEntities(podcast.title)}" type="rss" xmlUrl="${podcast.url}"/>`
				)
				.join(' ')}</body></opml>`;
		}
	}
</script>

<button class="primary" on:click={exportOPML}>Export OPML</button>

<style>
</style>
