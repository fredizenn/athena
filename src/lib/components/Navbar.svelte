<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutDashboard, Layers, BarChart2, Bookmark, Search, Flame } from 'lucide-svelte';
	import { progress } from '$lib/stores/progress';

	const links = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/topics', label: 'Topics', icon: Layers },
		{ href: '/stats', label: 'Stats', icon: BarChart2 },
		{ href: '/bookmarks', label: 'Bookmarks', icon: Bookmark }
	];

	$: currentPath = $page.url.pathname;
</script>

<header class="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-xl">
	<div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
		<a href="/" class="flex items-center gap-2 font-display text-lg font-semibold text-white shrink-0">
			<span
				class="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-ink-950 shadow-glow"
			>
				G
			</span>
			<span class="hidden sm:inline">Gradient</span>
		</a>

		<nav class="ml-2 hidden gap-1 md:flex">
			{#each links as link}
				<a
					href={link.href}
					class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
						{currentPath === link.href
						? 'bg-white/[0.08] text-white'
						: 'text-ink-300 hover:text-white hover:bg-white/[0.05]'}"
				>
					<svelte:component this={link.icon} size={16} strokeWidth={2.2} />
					{link.label}
				</a>
			{/each}
		</nav>

		<a
			href="/topics?focus=search"
			class="ml-auto flex items-center gap-2 rounded-lg glass px-3 py-2 text-sm text-ink-300 hover:text-white transition-colors"
			aria-label="Search flashcards"
		>
			<Search size={16} />
			<span class="hidden sm:inline">Search</span>
		</a>

		<div class="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 text-sm font-semibold text-amber-400">
			<Flame size={16} class={$progress.streak > 0 ? 'animate-float' : ''} />
			{$progress.streak}
		</div>
	</div>

	<nav class="flex gap-1 overflow-x-auto border-t border-white/[0.06] px-4 py-1.5 no-scrollbar md:hidden">
		{#each links as link}
			<a
				href={link.href}
				class="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors
					{currentPath === link.href ? 'bg-white/[0.08] text-white' : 'text-ink-300'}"
			>
				<svelte:component this={link.icon} size={14} />
				{link.label}
			</a>
		{/each}
	</nav>
</header>
