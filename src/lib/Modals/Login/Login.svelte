<script>
	import { fade } from 'svelte/transition';
	import Spinner from '$lib/Shared/Spinner.svelte';
	let card;

	import {
		showLogin,
		showWallet,
		serverUrl,
		walletSaved,
		loggedIn,
		satBalance,
		userState,
		walletDisabled,
		defaultBoostValue,
		defaultStream,
		walletId
	} from '$/stores';
	export let tab = 'Log In';
	let email = '';
	let pw = '';
	let pwVerification;
	let errorMsg = '';
	let showSpinner = false;

	$: if (tab) {
		email = '';
		pw = '';
		pwVerification = '';
		errorMsg = '';
	}

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	function handleSubmit(e) {
		document.activeElement.blur();
		card.focus();
		if (tab === 'Log In') {
			login();
		} else if (tab === 'Sign Up') {
			signup();
		}
	}

	async function login() {
		if (validateEmail(email) && pw) {
			try {
				let data = {
					email: email,
					pw: pw
				};
				showSpinner = true;
				let response = await fetch(serverUrl + `database/getuser`, {
					credentials: 'include',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				});
				let res = await response.json();

				if (res.balance) {
					// await checkStoredWallet({ loggedIn: true });
					showSpinner = false;
					$walletSaved = true;
					$loggedIn = true;
					$showLogin = false;
					$satBalance = res.balance.balance;
					$walletId = res.balance.id;
				} else if (res.status === 'fail') {
					errorMsg = res.memo;
					showSpinner = false;
				} else {
					console.log(res);
				}
			} catch {
				(err) => console.log(err);
				showSpinner = false;
			}
		} else {
			errorMsg = 'Invalid e-mail and/or password';
			showSpinner = false;
		}
	}

	async function signup() {
		if (pw !== pwVerification) {
			errorMsg = 'Passwords Do Not Match';
		} else if (validateEmail(email) && pw) {
			try {
				let data = {
					email: email,
					pw: pw
				};
				showSpinner = true;
				let response = await fetch(serverUrl + 'database/createuser', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				});

				let res = await response.json();
				let message = res.message;
				showSpinner = false;

				if (response.status === 200) {
					$satBalance = res.balance.balance;
					$userState.wallet = {
						enabled: true,
						defaultBoost: 0,
						defaultStream: 0
					};
					$walletDisabled = false;
					$defaultBoostValue = $userState.wallet.defaultBoost;
					$defaultStream = $userState.wallet.defaultStream;
					$loggedIn = true;
					$showLogin = false;
				} else {
					errorMsg = message;
				}
			} catch {
				(err) => console.log(err);
				errorMsg = 'Server Error. Please try again later.';
				showSpinner = false;
			}
		} else {
			errorMsg = 'Invalid e-mail and/or password';
			showSpinner = false;
		}
	}
</script>

{#if $showLogin}
	<section
		on:mousedown|self={() => {
			$showLogin = false;
			$showWallet = false;
		}}
		on:touchstart|self={() => {
			$showLogin = false;
			$showWallet = false;
		}}
		out:fade={{ duration: 500 }}
	>
		<div class="scroll-bar-clipper" bind:this={card}>
			{#if showSpinner}
				<div class="spinner">
					<Spinner color={'var(--spinner-color)'} />
				</div>
			{/if}
			<div class="copied-card">
				<div class="radio-toolbar">
					<input type="radio" id="signup-radio" bind:group={tab} value={'Sign Up'} />
					<label for="signup-radio">Sign Up</label>

					<input type="radio" id="login-radio" bind:group={tab} value={'Log In'} />
					<label for="login-radio">Log In</label>
				</div>

				<form class="input-container" on:submit|preventDefault={handleSubmit}>
					<label
						>E-mail
						<input type="email" placeholder="you@email.com" bind:value={email} />
					</label>
					<label
						>Password
						<input type="password" placeholder="Y0ur$ecureP@$$w0rd" bind:value={pw} />
					</label>
					<div class="pw-verification">
						{#if tab === 'Sign Up'}
							<input type="password" placeholder="re-enter password" bind:value={pwVerification} />
						{/if}
					</div>
					<p>{errorMsg}</p>
					<div class="button-container ">
						<input type="submit" value={tab} />
					</div>
				</form>
			</div>
		</div>
	</section>
{/if}

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.45);
		height: 100vh;
		width: 100vw;
		display: grid;
		place-items: center center;
		z-index: 9999;
		backdrop-filter: blur(3px);
	}
	.spinner {
		position: fixed;
		top: 0;
		left: 0;
		display: grid;
		place-content: center center;
		width: 100vw;
		height: 100vh;
		z-index: 5;
		color: red;
	}

	.scroll-bar-clipper {
		width: calc(100% - 16px);
		max-width: 344px;
		height: 350px;
		border-radius: 8px;
		overflow: auto;
		z-index: 3;
		background-color: var(--primary-color);
		border: var(--modal-border);
		box-shadow: var(--modal-box-shadow);
	}

	.copied-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		background-color: var(--primary-color);
		color: var(--primary-text-color);
		height: 100%;
		width: 100%;
		border-radius: 8px;
		position: relative;
	}

	.input-container {
		width: 100%;
		padding: 0 8px;
	}
	label {
		font-size: 1.1em;
		font-weight: 600;
	}

	input {
		width: 100%;
		margin: 8px 0;
		background-color: var(--input-background-color);
		border-radius: 20px;
		padding-left: 8px;
		color: var(--secondary-text-color);
	}

	.pw-verification {
		height: 55.06px;
		font-size: 1.1em;
		font-weight: 600;
		width: 100%;
	}

	p {
		margin: 0;
		padding: 0;
		height: 30px;
		width: 100%;
		text-align: center;
		color: red;
	}

	.button-container {
		width: 100%;
		display: flex;
	}

	.button-container > input {
		height: 40px;
		width: 50%;
		margin: 8px auto;
		background-color: var(--primary-button-background-color);
		background-image: var(--primary-button-background-image);
		color: var(--secondary-text-color);
		text-shadow: 0 1px #c0c0c0;
		border: none;
		border-radius: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		flex: none;
	}
	.radio-toolbar {
		width: 100%;
		display: flex;
		background-color: var(--primary-color);
	}

	.radio-toolbar input[type='radio'] {
		opacity: 0;
		position: fixed;
		width: 0;
	}

	.radio-toolbar label {
		display: inline-block;
		background-color: var(--secondary-color);
		padding: 10px 20px;
		font-family: sans-serif, Arial;
		font-size: 16px;
		border-radius: 4px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		cursor: pointer;
	}

	.radio-toolbar label:first-of-type {
		border-bottom-left-radius: 0;
	}

	.radio-toolbar label:last-of-type {
		border-bottom-right-radius: 0;
	}

	.radio-toolbar input[type='radio']:checked + label {
		background-color: var(--primary-color);
		color: var(--primary-text-color);
		font-weight: 700;
	}
</style>
