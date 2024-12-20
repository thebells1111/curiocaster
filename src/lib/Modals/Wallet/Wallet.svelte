<script>
	import WalletSettings from './WalletSettings/WalletSettingsModal.svelte';
	import SetupWallet from './SetupWallet/SetupWallet.svelte';

	import { loggedIn, showLogin, showWallet } from '$/stores';
	let balanceCheckFlag = false;
</script>

{#if $showWallet}
	{#if $loggedIn}
		<WalletSettings bind:balanceCheckFlag />
	{:else}
		<SetupWallet />
	{/if}
{/if}

<style>
</style>
