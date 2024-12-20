<script>
	import { slide } from 'svelte/transition';
	import {
		showDisclaimer,
		showWallet,
		showOPML,
		showPreferences,
		rssEditor,
		rightPane
	} from '$/stores';

	let showList = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== 'settings-button') {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}

	function toggleRssEditor() {
		if (!$rssEditor) {
			$rightPane = 'episodeMetadata';
		} else {
			$rightPane = 'showNotes';
		}
		$rssEditor = !$rssEditor;
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div>
	<button id="settings-button" aria-label="Settings" on:click={handleSettingsClick}>Settings</button
	>
	{#if showList}
		<ul on:click={handleUlClick} transition:slide={{ duration: 200 }}>
			<li on:click={() => ($showPreferences = true)}>Preferences</li>
			<li on:click={() => ($showOPML = true)}>OPML</li>
			<li on:click={() => ($showWallet = true)}>Wallet</li>
			<li on:click={() => ($showDisclaimer = true)}>Issues?</li>
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
		height: 42px;
	}
	ul {
		background-color: var(--secondary-color);
		border-radius: 3px;
		width: 200px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		top: 42px;
		right: -36px;
		overflow: hidden;
		box-shadow: var(--dropdown-box-shadow);
		z-index: 4;
	}

	li {
		list-style: none;
		cursor: pointer;
		padding: 0 4px;
		height: 42px;
		line-height: 42px;
	}

	a {
		text-decoration: none;
		font-weight: initial;
		color: var(--primary-text-color);
	}

	li:hover,
	li:hover > a {
		text-decoration: none;
		background-color: var(--tertiary-color);
		color: var(--secondary-text-color);
	}

	button {
		background-color: transparent;
		margin: 0.5em 0.25em 0.25em.25em;
		padding: 0;
		border: none;
		color: var(--primary-text-color);
		font-weight: 550;
	}

	button:hover {
		color: var(--menu-hover-color);
	}
</style>
