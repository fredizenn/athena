<script lang="ts">
	import { Star, Play } from 'lucide-svelte';
	import { ALL_CARDS } from '$lib/data';
	import { getTopic } from '$lib/data/topics';
	import { progress } from '$lib/stores/progress';

	$: bookmarkedCards = ALL_CARDS.filter((c) => $progress.cards[c.id]?.bookmarked);
</script>

<svelte:head>
	<title>Bookmarks — Gradient</title>
</svelte:head>

<section class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="font-display text-2xl font-bold text-white sm:text-3xl">Bookmarks</h1>
		<p class="mt-1 text-ink-300">{bookmarkedCards.length} card{bookmarkedCards.length === 1 ? '' : 's'} saved for later.</p>
	</div>
	{#if bookmarkedCards.length > 0}
		<a href="/study/all?mode=favorites" class="btn-primary">
			<Play size={16} /> Study bookmarks
		</a>
	{/if}
</section>

{#if bookmarkedCards.length === 0}
	<div class="glass-card flex flex-col items-center gap-3 py-16 text-center">
		<Star size={28} class="text-ink-500" />
		<p class="text-ink-300">No bookmarks yet. Tap the star icon on any flashcard to save it here.</p>
		<a href="/topics" class="btn-ghost mt-2">Browse topics</a>
	</div>
{:else}
	<div class="glass-card divide-y divide-white/[0.06]">
		{#each bookmarkedCards as card (card.id)}
			{@const t = getTopic(card.topic)}
			<div class="flex items-center justify-between gap-3 p-4">
				<div class="min-w-0">
					<p class="truncate text-sm font-medium text-white">{card.question}</p>
					<p class="mt-0.5 text-xs text-ink-400">{t?.name} · {card.subtopic}</p>
				</div>
				<span
					class={card.difficulty === 'Beginner'
						? 'badge-beginner'
						: card.difficulty === 'Intermediate'
							? 'badge-intermediate'
							: 'badge-advanced'}>{card.difficulty}</span
				>
			</div>
		{/each}
	</div>
{/if}
