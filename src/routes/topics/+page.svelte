<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, SlidersHorizontal } from 'lucide-svelte';
	import TopicCard from '$lib/components/TopicCard.svelte';
	import { TOPICS, TOPIC_GROUPS } from '$lib/data/topics';
	import { cardsByTopic } from '$lib/data';
	import { progress, topicProgress } from '$lib/stores/progress';

	let query = '';
	let difficultyFilter: 'All' | 'Beginner' | 'Intermediate' | 'Advanced' = 'All';
	let searchInput: HTMLInputElement;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('focus') === 'search') searchInput?.focus();
	});

	$: filteredTopics = TOPICS.filter((t) => {
		const q = query.trim().toLowerCase();
		const matchesQuery =
			!q ||
			t.name.toLowerCase().includes(q) ||
			t.description.toLowerCase().includes(q) ||
			cardsByTopic(t.slug).some(
				(c) =>
					c.question.toLowerCase().includes(q) ||
					c.tags.some((tag) => tag.toLowerCase().includes(q)) ||
					c.subtopic.toLowerCase().includes(q)
			);

		const cards = cardsByTopic(t.slug);
		const matchesDifficulty =
			difficultyFilter === 'All' || cards.some((c) => c.difficulty === difficultyFilter);

		return matchesQuery && matchesDifficulty;
	});

	$: groupedTopics = TOPIC_GROUPS.map((group) => ({
		group,
		topics: filteredTopics.filter((t) => t.group === group)
	})).filter((g) => g.topics.length > 0);
</script>

<svelte:head>
	<title>Topics — Gradient</title>
</svelte:head>

<section class="mb-6">
	<h1 class="font-display text-2xl font-bold text-white sm:text-3xl">Topics</h1>
	<p class="mt-1 text-ink-300">{TOPICS.length} topics covering statistics through AI engineering.</p>
</section>

<section class="mb-8 flex flex-col gap-3 sm:flex-row">
	<div class="glass-card flex flex-1 items-center gap-2 px-3.5 py-2.5">
		<Search size={17} class="shrink-0 text-ink-400" />
		<input
			bind:this={searchInput}
			bind:value={query}
			type="text"
			placeholder="Search topics, questions, or tags..."
			class="w-full bg-transparent text-sm text-white placeholder:text-ink-500 focus:outline-none"
		/>
	</div>
	<div class="glass-card flex items-center gap-2 px-3.5 py-2.5">
		<SlidersHorizontal size={15} class="shrink-0 text-ink-400" />
		<select
			bind:value={difficultyFilter}
			class="w-full bg-transparent text-sm text-white focus:outline-none sm:w-40"
		>
			<option class="bg-ink-800" value="All">All levels</option>
			<option class="bg-ink-800" value="Beginner">Beginner</option>
			<option class="bg-ink-800" value="Intermediate">Intermediate</option>
			<option class="bg-ink-800" value="Advanced">Advanced</option>
		</select>
	</div>
</section>

{#if groupedTopics.length === 0}
	<div class="glass-card py-16 text-center text-ink-300">No topics match your search.</div>
{/if}

{#each groupedTopics as { group, topics } (group)}
	<section class="mb-9">
		<h2 class="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-400">{group}</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each topics as topic (topic.slug)}
				{@const cards = cardsByTopic(topic.slug)}
				{@const p = topicProgress(cards.map((c) => c.id), $progress)}
				<TopicCard
					{topic}
					cardCount={cards.length}
					masteredCount={p.mastered}
					estimatedMinutes={Math.max(3, cards.length * 2)}
				/>
			{/each}
		</div>
	</section>
{/each}
