<script lang="ts">
	import axios from 'axios';

	let url: string;
	let isLoading: boolean = false;
	let short: string;

	let handleNewLink = async () => {
		isLoading = true;
		let { data } = await axios.post('/create', {
			url,
			withCredentials: true
		});

		isLoading = false;
		if (data?.insertOneLink) {
			short = data?.insertOneLink.domain.concat(data.insertOneLink.short);
		}
	};
</script>

{#if short}
	<p>Short link for {url} is: {short}</p>
{:else}
	<input type="text" bind:value={url} disabled={isLoading} />
	<button on:click|preventDefault={handleNewLink} disabled={isLoading}>Create short link</button>
{/if}
