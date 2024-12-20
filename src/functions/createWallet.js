import {
	satBalance,
	userState,
	walletDisabled,
	defaultBoostValue,
	defaultStream,
	walletSaved,
	loggedIn,
	showLogin
} from '$/stores';

import { get } from 'svelte/store';

let storedUserState = get(userState);

export default async function createWallet() {
	try {
		let data = {
			type: 'createwallet'
		};
		console.log('createWallet function');
		let response = await fetch(`/api/wallet`, {
			method: 'POST',
			body: JSON.stringify(data)
		});
		let res = await response.json();
		if (res.status === 'success') {
			satBalance.set(0);
			storedUserState.wallet = {
				saved: true,
				enabled: true,
				defaultBoost: 0,
				defaultStream: 0
			};
			walletDisabled.set(storedUserState.wallet.disabled);
			defaultBoostValue.set(storedUserState.wallet.defaultBoost);
			defaultStream.set(storedUserState.wallet.defaultStream);
			walletSaved.set(storedUserState.wallet.saved);

			// userStateDB.setItem('userState', storedUserState);
			loggedIn.set(true);
			showLogin.set(false);
		} else {
			loggedIn.set(false);
			showLogin.set(false);
		}
	} catch {
		(err) => console.log('e: ' + err);
	}
}
