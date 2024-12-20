<script>
	import Export from '../OPML/Export.svelte';

	import { podcastDB, userStateDB, podcastStateDB, walletDB, showMobile } from '$/stores';

	async function resetApp() {
		try {
			let res = await fetch(`/api/wallet?route=reset&time=${new Date().getTime()}`);
			console.log(await res.text());
			await userStateDB.clear();
			await podcastStateDB.clear();
			await podcastDB.clear();
			await walletDB.clear();
			location.reload();
		} catch (err) {
			console.log(err);
		}
	}
</script>

<p>
	This app is still in the beta stage of development, and may have changes that will require
	reloading all of your data.
</p>
<p>
	Thanks for being patient as I work out all of the issues. And a huge thanks for being an early
	adopter.
</p>
<p>
	You can report any issues, ask questions, or make suggestions at podcastindex.social. Please make
	all inquiries to @StevenB
</p>
<p>
	You can also email me at <a href="mailto: curiocaster@gmail.com">curiocaster@gmail.com</a>
</p>
<p>
	If things aren't working as expected, try clicking the button below to reset your app. <br
	/>Unfortunately, your data will be lost, but the app will probably start functioning as expected
	again.
</p>

<p>
	You may want to back up your subscriptions by exporting to OPML. You can then reload the OPML file
	once the app resets.
</p>

<div class="button-container" class:mobile={$showMobile}>
	<Export />

	<button class="primary" on:click={resetApp}>Reset App</button>
</div>

<style>
	.button-container {
		display: flex;
		width: 40%;
		justify-content: space-between;
		margin: 0 auto;
	}

	.mobile {
		width: 90%;
	}

	button.primary {
		background-color: hsl(0, 100%, 24%);
		background-image: linear-gradient(hsl(0, 99%, 47%), hsl(0, 100%, 24%));
	}

	p {
		padding: 0 0 16px 0;
	}
</style>
