<script lang="ts">
	import { session } from '$app/stores';
	import { hydrateApolloClient } from '$lib/ApolloClient';

	hydrateApolloClient($session);
</script>

<slot />
