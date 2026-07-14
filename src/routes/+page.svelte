<script lang="ts">
	import { BookOpen, Target, Flame, Layers, CheckCircle2, Clock } from 'lucide-svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import TopicCard from '$lib/components/TopicCard.svelte';
	import { TOPICS } from '$lib/data/topics';
	import { ALL_CARDS, cardsByTopic } from '$lib/data';
	import { progress, computeStats, topicProgress } from '$lib/stores/progress';

	$: stats = computeStats($progress);

	$: topicStats = TOPICS.map((t) => {
		const cards = cardsByTopic(t.slug);
		const p = topicProgress(cards.map((c) => c.id), $progress);
		return { topic: t, cards, p };
	});

	$: topicsCompleted = topicStats.filter((t) => t.p.total > 0 && t.p.mastered === t.p.total).length;

	$: recentlyStudied = Object.values($progress.cards)
		.filter((c) => c.lastSeen)
		.sort((a, b) => (b.lastSeen ?? 0) - (a.lastSeen ?? 0))
		.slice(0, 5)
		.map((cp) => ({ cp, card: ALL_CARDS.find((c) => c.id === cp.id) }))
		.filter((x) => x.card);

	$: overallMasteryPct = stats.totalCards ? Math.round((stats.mastered / stats.totalCards) * 100) : 0;

	// Suggest a few topics to jump back into: started but not finished, else fresh ones.
	$: suggestedTopics = [...topicStats]
		.sort((a, b) => {
			const aStarted = a.p.seen > 0 && a.p.mastered < a.p.total ? 0 : 1;
			const bStarted = b.p.seen > 0 && b.p.mastered < b.p.total ? 0 : 1;
			return aStarted - bStarted;
		})
		.slice(0, 3);
</script>

<svelte:head>
	<title>Dashboard — Gradient</title>
</svelte:head>

<section class="mb-8">
	<h1 class="font-display text-2xl font-bold text-white sm:text-3xl">
		{stats.streak > 0 ? `${stats.streak}-day streak. Keep it going.` : 'Welcome back.'}
	</h1>
	<p class="mt-1 text-ink-300">Your ML &amp; Statistics mastery, at a glance.</p>
</section>

<section class="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
	<StatCard icon={BookOpen} label="Cards studied today" value={stats.cardsToday} accent="violet" />
	<StatCard icon={Target} label="Accuracy" value="{stats.accuracy}%" accent="cyan" />
	<StatCard icon={Flame} label="Day streak" value={stats.streak} hint="Best: {stats.longestStreak}" accent="amber" />
	<StatCard icon={Layers} label="Total flashcards" value={stats.totalCards} accent="coral" />
</section>

<section class="mb-8 grid gap-4 lg:grid-cols-3">
	<div class="glass-card flex flex-col items-center justify-center gap-3 p-6 lg:col-span-1">
		<ProgressRing value={overallMasteryPct} size={132} stroke={10} label="{overallMasteryPct}%" sublabel="mastered" />
		<p class="text-center text-sm text-ink-300">
			{stats.mastered} of {stats.totalCards} cards mastered
		</p>
	</div>

	<div class="glass-card p-5 lg:col-span-2">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-display text-base font-semibold text-white">Jump back in</h2>
			<a href="/topics" class="text-xs font-medium text-violet-400 hover:text-violet-300">View all topics →</a>
		</div>
		<div class="grid gap-3 sm:grid-cols-3">
			{#each suggestedTopics as { topic, cards, p }}
				<TopicCard
					{topic}
					cardCount={cards.length}
					masteredCount={p.mastered}
					estimatedMinutes={Math.max(3, cards.length * 2)}
				/>
			{/each}
		</div>
	</div>
</section>

<section class="grid gap-4 lg:grid-cols-3">
	<div class="glass-card p-5 lg:col-span-2">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-display text-base font-semibold text-white">Recently studied</h2>
			<CheckCircle2 size={16} class="text-ink-400" />
		</div>
		{#if recentlyStudied.length === 0}
			<div class="flex flex-col items-center gap-2 py-10 text-center">
				<p class="text-ink-300">You haven't studied any cards yet.</p>
				<a href="/topics" class="btn-primary mt-2">Start studying</a>
			</div>
		{:else}
			<ul class="divide-y divide-white/[0.06]">
				{#each recentlyStudied as { cp, card }}
					<li class="flex items-center justify-between gap-3 py-3">
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-white">{card?.question}</p>
							<p class="text-xs text-ink-400">{card?.subtopic} · {card?.difficulty}</p>
						</div>
						<span
							class="pill shrink-0 {cp.mastered ? 'badge-beginner' : 'glass text-ink-300'}"
						>
							{cp.mastered ? 'Mastered' : `${cp.correct}/${cp.correct + cp.incorrect}`}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="glass-card p-5">
		<div class="mb-4 flex items-center gap-2">
			<Clock size={16} class="text-ink-400" />
			<h2 class="font-display text-base font-semibold text-white">Topics completed</h2>
		</div>
		<p class="font-display text-4xl font-bold text-white">{topicsCompleted}<span class="text-lg text-ink-400"> / {TOPICS.length}</span></p>
		<p class="mt-2 text-sm text-ink-300">Fully mastered topic areas across your whole curriculum.</p>
		<a href="/study/all?mode=today" class="btn-ghost mt-5 w-full">Study today's review</a>
	</div>
</section>
