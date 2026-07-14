<script lang="ts">
	import * as icons from 'lucide-svelte';
	import { page } from '$app/stores';
	import { Shuffle, RotateCcw, Briefcase, ListChecks, Timer, Flame as FlameIcon, Star, CalendarCheck, Play } from 'lucide-svelte';
	import { getTopic } from '$lib/data/topics';
	import { cardsByTopic } from '$lib/data';
	import { progress, topicProgress } from '$lib/stores/progress';

	$: slug = $page.params.topic;
	$: topic = getTopic(slug);
	$: cards = cardsByTopic(slug);
	$: p = topicProgress(cards.map((c) => c.id), $progress);

	function toPascal(kebab: string) {
		return kebab
			.split('-')
			.map((s) => s[0].toUpperCase() + s.slice(1))
			.join('');
	}
	$: Icon = topic ? (icons as any)[toPascal(topic.icon)] ?? icons.Sparkles : icons.Sparkles;

	const modes = [
		{ id: 'normal', label: 'Normal', desc: 'Go through cards in order', icon: Play },
		{ id: 'random', label: 'Random', desc: 'Shuffled order', icon: Shuffle },
		{ id: 'review', label: 'Review', desc: 'Cards due for review', icon: RotateCcw },
		{ id: 'hard', label: 'Hard cards only', desc: 'Cards you often miss', icon: FlameIcon },
		{ id: 'favorites', label: 'Favorites', desc: 'Your bookmarked cards', icon: Star },
		{ id: 'interview', label: 'Interview mode', desc: 'Interview-style questions', icon: Briefcase },
		{ id: 'quiz', label: 'Quiz mode', desc: 'Self-graded rapid quiz', icon: ListChecks },
		{ id: 'timed', label: 'Timed mode', desc: '60 seconds per card', icon: Timer },
		{ id: 'today', label: "Today's review", desc: 'Everything due today', icon: CalendarCheck }
	] as const;
</script>

<svelte:head>
	<title>{topic?.name ?? 'Topic'} — Gradient</title>
</svelte:head>

{#if !topic}
	<div class="glass-card py-16 text-center text-ink-300">Topic not found.</div>
{:else}
	<section class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-4">
			<div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-violet-400">
				<svelte:component this={Icon} size={26} />
			</div>
			<div>
				<h1 class="font-display text-2xl font-bold text-white sm:text-3xl">{topic.name}</h1>
				<p class="mt-1 text-ink-300">{topic.description}</p>
			</div>
		</div>
		<div class="flex items-center gap-4 text-sm text-ink-300">
			<div><span class="font-display text-lg font-bold text-white">{cards.length}</span> cards</div>
			<div><span class="font-display text-lg font-bold text-white">{p.mastered}</span> mastered</div>
			<div><span class="font-display text-lg font-bold text-white">~{Math.max(3, cards.length * 2)}</span> min</div>
		</div>
	</section>

	<div class="mb-8 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
		<div
			class="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
			style="width: {p.pct}%"
		></div>
	</div>

	<section class="mb-10">
		<h2 class="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-400">Choose a study mode</h2>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each modes as mode}
				<a
					href="/study/{slug}?mode={mode.id}"
					class="glass-card group flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-white/[0.14]"
				>
					<div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-violet-400 group-hover:bg-violet-500/15">
						<svelte:component this={mode.icon} size={18} />
					</div>
					<div>
						<p class="text-sm font-semibold text-white">{mode.label}</p>
						<p class="text-xs text-ink-400">{mode.desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
			All cards in this topic
		</h2>
		<div class="glass-card divide-y divide-white/[0.06]">
			{#each cards as card (card.id)}
				{@const cp = $progress.cards[card.id]}
				<div class="flex items-center justify-between gap-3 p-4">
					<div class="min-w-0">
						<p class="truncate text-sm font-medium text-white">{card.question}</p>
						<p class="mt-0.5 text-xs text-ink-400">{card.subtopic}</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<span
							class={card.difficulty === 'Beginner'
								? 'badge-beginner'
								: card.difficulty === 'Intermediate'
									? 'badge-intermediate'
									: 'badge-advanced'}>{card.difficulty}</span
						>
						{#if cp?.mastered}
							<span class="pill bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Mastered</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}
