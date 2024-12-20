<script>
	import removeEpisodesFromRecent from '$functions/removeEpisodesFromRecent';
	import { mainPodcastList, podcastList, podcastDB, podcastStateDB } from '$/stores';

	let contextMenu;
	let contextData;
	let showContextMenu = false;

	$: if (showContextMenu) {
		contextMenu && contextMenu.focus();
	}

	async function deletePodcast() {
		showContextMenu = false;
		const mainIndex = $mainPodcastList.findIndex(({ id }) => `${id}` === `${contextData.id}`);

		const listIndex = $podcastList.findIndex(({ id }) => `${id}` === `${contextData.id}`);

		$mainPodcastList.splice(mainIndex, 1);
		$podcastList.splice(listIndex, 1);

		$mainPodcastList = $mainPodcastList;

		$podcastList = $podcastList;

		podcastDB.removeItem(`${contextData.id}`);
		podcastStateDB.removeItem(`${contextData.id}`);
		removeEpisodesFromRecent(contextData.id);
	}

	function handleContextMenu(e) {
		showContextMenu = false;
		let fileNode = e.target;
		while (!(fileNode.dataset && fileNode.dataset.id)) {
			fileNode = fileNode.parentElement;
			if (fileNode.nodeName === 'HTML') {
				break;
			}
		}

		if (fileNode.dataset.type === 'podcastList') {
			contextData = fileNode.dataset;
			e.preventDefault();
			let containerNode = fileNode.parentElement.parentElement;
			let containerBounds = containerNode.getBoundingClientRect();
			var x = e.clientX - containerBounds.left;
			var y = e.clientY - containerBounds.top;
			contextMenu.style.top = y + 'px';
			contextMenu.style.left = x + 'px';
			showContextMenu = true;
		}
	}
</script>

<svelte:window
	on:click={(e) => {
		showContextMenu = false;
	}}
	on:contextmenu={handleContextMenu}
/>

<nav
	class:show-menu={showContextMenu}
	bind:this={contextMenu}
	on:blur={() => (showContextMenu = false)}
>
	<ul>
		<li on:click={deletePodcast}>Delete Podcast</li>
	</ul>
</nav>

<style>
	ul {
		padding: 0;
		margin: 0;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
	}

	li {
		width: 100%;
		list-style-type: none;
		height: 60px;
		display: grid;
		place-content: center;
		padding: 0 8px 0 12px;
	}

	li:hover {
		background-color: var(--tertiary-color);
		color: var(--secondary-text-color);
	}

	nav {
		position: absolute;
		display: none;
		top: 0;
		background: var(--secondary-color);
		color: var(--primary-text-color);
		z-index: 99;
		box-shadow: var(--box-shadow);
		border-radius: 4px;
		cursor: pointer;
		user-select: none;
	}
	.show-menu {
		display: block;
	}
</style>
