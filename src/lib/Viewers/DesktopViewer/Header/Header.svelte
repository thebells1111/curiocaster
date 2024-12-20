<script>
	import PodcastSearch from '$lib/Shared/PodcastSearch/PodcastSearch.svelte';
	import Search from '$lib/icons/Search.svelte';
	import Menu from './Menu/Menu.svelte';
	let showSearch = false;
	let searchBar;
</script>

<div class="container">
	<div class="menu"><Menu /></div>
	<div class="search-container">
		<div
			class="search-icon"
			on:click={() => {
				showSearch = !showSearch;
				if (showSearch) {
					searchBar.focus();
				}
			}}
		>
			<Search size="24" />
		</div>
		<div class="search" class:show-search={showSearch}>
			<PodcastSearch bind:searchBar />
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		background-color: transparent;
		padding: 0 8px;
	}

	.menu {
		color: var(-primary-text-color);
		user-select: none;
		margin: 0;
	}

	.search-container {
		position: relative;
	}
	.search-icon {
		color: var(--primary-text-color);
		position: absolute;
		top: 11px;
		left: 11px;
		cursor: pointer;
	}

	.search {
		width: 0px;
		margin: 8px 16px 8px 8px;
		height: 30px;
		background-color: transparent;
		border-radius: 30px;
		border: 1px solid var(--border-color);
		display: flex;
		padding: 0 14px;
		transition: width 0.25s;
	}

	.show-search {
		width: 260px;
		padding: 0 4px 0 24px;
		transition: width 0.25s;
	}
</style>
