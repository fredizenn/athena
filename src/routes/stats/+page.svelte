<script lang="ts">
	import { Flame, Target, Clock, Layers, TrendingUp, TrendingDown } from 'lucide-svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import { TOPICS } from '$lib/data/topics';
	import { cardsByTopic } from '$lib/data';
	import { progress, computeStats, topicProgress } from '$lib/stores/progress';

	$: stats = computeStats($progress);

	$: topicBreakdown = TOPICS.map((t) => {
		const cards = cardsByTopic(t.slug);
		const p = topicProgress(cards.map((c) => c.id), $progress);
		return { topic: t, ...p };
	}).filter((t) => t.seen > 0);

	$: strongest = [...topicBreakdown].sort((a, b) => b.pct - a.pct).slice(0, 3);
	$: weakest = [...topicBreakdown].sort((a, b) => a.pct - b.pct).slice(0, 3);

	$: last7 = Object.values($progress.logs)
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-7);
	$: weeklyStudied = last7.reduce((a, l) => a + l.studied, 0);

	$: last30 = Object.values($progress.logs)
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-30);
	$: monthlyStudied = last30.reduce((a, l) => a + l.studied, 0);
</script>

<svelte:head>
	<title>Stats — Gradient</title>
</svelte:head>

<section class="mb-8">
	<h1 class="font-display text-2xl font-bold text-white sm:text-3xl">Statistics</h1>
	<p class="mt-1 text-ink-300">A closer look at your learning trends.</p>
</section>

<section class="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
	<StatCard icon={Flame} label="Current streak" value={stats.streak} hint="Longest: {stats.longestStreak} days" accent="amber" />
	<StatCard icon={Target} label="Overall accuracy" value="{stats.accuracy}%" accent="cyan" />
	<StatCard icon={Layers} label="Cards mastered" value="{stats.mastered}/{stats.totalCards}" accent="violet" />
	<StatCard icon={Clock} label="Time studied" value="{stats.totalTimeMinutes}m" accent="coral" />
</section>

<section class="mb-8 grid gap-4 lg:grid-cols-3">
	<div class="glass-card p-5 lg:col-span-2">
		<h2 class="mb-1 font-display text-base font-semibold text-white">Study heatmap</h2>
		<p class="mb-4 text-xs text-ink-400">Cards studied per day, last ~18 weeks</p>
		<Heatmap logs={$progress.logs} />
		<div class="mt-5 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4 text-sm">
			<div>
				<p class="text-ink-400">This week</p>
				<p class="font-display text-xl font-bold text-white">{weeklyStudied} cards</p>
			</div>
			<div>
				<p class="text-ink-400">This month</p>
				<p class="font-display text-xl font-bold text-white">{monthlyStudied} cards</p>
			</div>
		</div>
	</div>

	<div class="glass-card flex flex-col items-center justify-center gap-3 p-6">
		<ProgressRing
			value={stats.totalCards ? Math.round((stats.mastered / stats.totalCards) * 100) : 0}
			size={128}
			stroke={10}
			sublabel="mastered"
		/>
		<p class="text-center text-sm text-ink-300">{stats.cardsSeen} of {stats.totalCards} cards attempted</p>
	</div>
</section>

<section class="grid gap-4 lg:grid-cols-2">
	<div class="glass-card p-5">
		<div class="mb-4 flex items-center gap-2">
			<TrendingUp size={16} class="text-cyan-400" />
			<h2 class="font-display text-base font-semibold text-white">Strongest topics</h2>
		</div>
		{#if strongest.length === 0}
			<p class="text-sm text-ink-400">Start studying to see your strongest topics.</p>
		{:else}
			<ul class="space-y-3">
				{#each strongest as t}
					<li>
						<div class="mb-1 flex justify-between text-sm">
							<span class="text-white">{t.topic.name}</span>
							<span class="text-ink-400">{t.pct}%</span>
						</div>
						<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
							<div class="h-full rounded-full bg-cyan-400" style="width: {t.pct}%"></div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="glass-card p-5">
		<div class="mb-4 flex items-center gap-2">
			<TrendingDown size={16} class="text-coral-400" />
			<h2 class="font-display text-base font-semibold text-white">Needs more review</h2>
		</div>
		{#if weakest.length === 0}
			<p class="text-sm text-ink-400">Start studying to see topics that need more review.</p>
		{:else}
			<ul class="space-y-3">
				{#each weakest as t}
					<li>
						<a href="/study/{t.topic.slug}?mode=hard" class="block">
							<div class="mb-1 flex justify-between text-sm">
								<span class="text-white">{t.topic.name}</span>
								<span class="text-ink-400">{t.pct}%</span>
							</div>
							<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
								<div class="h-full rounded-full bg-coral-400" style="width: {t.pct}%"></div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
