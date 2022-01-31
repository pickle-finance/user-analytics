<script lang="ts">
	import { session, page } from '$app/stores';
	import { hydrateApolloClient } from '$lib/ApolloClient';
	import { config } from '$lib/config';
	import { CookieManager } from 'svelboost/src';
	import '$lib/scripts';

	hydrateApolloClient($session);

	page.subscribe((newPage) => {
		if (typeof window !== 'undefined' && window?.posthog) {
			let cookieManager = new CookieManager();
			let userId = cookieManager.checkCookie(config.posthog.cookieName);
			let aliasCreated = cookieManager.getCookie('posthog_alias');

			if (userId && !aliasCreated) {
				cookieManager.setCookie('posthog_alias', true);
				window?.posthog?.alias(userId);
			}
		}
		return newPage;
	});
</script>

<slot />
