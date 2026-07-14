<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { page } from '$app/stores';
</script>

<div class="min-h-screen">
	<Navbar />
	<main class="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
		{#key $page.url.pathname}
			<div class="animate-pop">
				<slot />
			</div>
		{/key}
	</main>
</div>
