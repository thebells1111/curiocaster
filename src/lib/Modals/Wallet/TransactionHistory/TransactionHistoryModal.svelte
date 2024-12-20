<script>
	import TransactionHistory from './TransactionHistory.svelte';

	export let showHistory = false;
	let currentPage = 0;
	let list;
	export let errorNotice = false;
</script>

<section
	on:click|self={() => {
		errorNotice = false;
		showHistory = false;
		currentPage = 0;
	}}
>
	<div class="scroll-bar-clipper" bind:this={list}>
		<TransactionHistory bind:list bind:currentPage bind:errorNotice />
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		display: grid;
		place-items: center;
		z-index: 10;
	}

	.scroll-bar-clipper {
		width: calc(100% - 16px);
		max-width: 360px;
		height: calc(100% - 80px);
		max-height: 700px;
		background-color: var(--primary-color);
		color: #333;
		border-radius: 5px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		position: absolute;
		border: var(--modal-border);
		box-shadow: var(--modal-box-shadow);
	}
</style>
