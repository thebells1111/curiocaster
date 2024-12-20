<script>
	import {
		nickName,
		anonStream,
		anonBoost,
		anonBoostagram,
		userState,
		userStateDB,
		showMobile
	} from '$/stores';
	function handleAnonChange(e, type) {
		$userState.anon = $userState.anon || {};
		$userState.anon[type] = e.target.checked;
		$userState = $userState;
		userStateDB.setItem('userState', $userState);
	}
</script>

<ul class="anon-container">
	<li>
		<label>
			<p>User Name to Send to Podcasters</p>
			<input type="text" bind:value={$nickName} />
		</label>
	</li>
	<li class="anon-choices" class:mobile={$showMobile}>
		<label>
			<input
				type="checkbox"
				bind:checked={$anonStream}
				on:change={(e) => handleAnonChange(e, 'stream')}
			/>
			<p>Stream anonymously?</p>
		</label>
		<label>
			<input
				type="checkbox"
				bind:checked={$anonBoost}
				on:change={(e) => handleAnonChange(e, 'boost')}
			/>
			<p>Boost anonymously?</p>
		</label>
		<label>
			<input
				type="checkbox"
				bind:checked={$anonBoostagram}
				on:change={(e) => handleAnonChange(e, 'boostagram')}
			/>
			<p>Boostagram anonymously?</p>
		</label>
	</li>
</ul>

<style>
	ul {
		border-top: 1px solid var(--border-color);
		padding: 8px 0;
	}

	input[type='text'] {
		width: calc(100% - 8px);
		margin-left: 8px;
	}

	p {
		margin: 0 0 4px 0;
	}

	.anon-choices {
		display: flex;
		align-items: center;
	}
	.anon-choices label {
		display: flex;
		align-items: center;
		cursor: pointer;
		user-select: none;
	}

	.anon-choices input {
		display: flex;
		align-items: center;
		margin: 0 8px 0 32px;
	}

	.mobile {
		flex-direction: column;
		align-items: flex-start;
	}

	.mobile label {
		margin: 4px 0;
	}
</style>
