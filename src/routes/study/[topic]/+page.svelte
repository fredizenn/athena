<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { ArrowLeft, Timer, PartyPopper } from 'lucide-svelte';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import Confetti from '$lib/components/Confetti.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import { getTopic } from '$lib/data/topics';
	import { ALL_CARDS, cardsByTopic } from '$lib/data';
	import { progress } from '$lib/stores/progress';
	import type { Flashcard as FlashcardType, StudyMode } from '$lib/types';

	$: slug = $page.params.topic;
	$: mode = ($page.url.searchParams.get('mode') as StudyMode) ?? 'normal';
	$: topic = slug === 'all' ? null : getTopic(slug);

	function shuffle<T>(arr: T[]): T[] {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function buildDeck(mode: StudyMode, topicSlug: string): FlashcardType[] {
		const pool = topicSlug === 'all' ? ALL_CARDS : cardsByTopic(topicSlug);
		const state = $progress;
		const now = Date.now();

		switch (mode) {
			case 'random':
				return shuffle(pool);
			case 'favorites':
				return pool.filter((c) => state.cards[c.id]?.bookmarked);
			case 'hard':
				return pool
					.filter((c) => (state.cards[c.id]?.incorrect ?? 0) > 0)
					.sort((a, b) => {
						const ai = state.cards[a.id],
							bi = state.cards[b.id];
						const aRatio = ai ? ai.incorrect / Math.max(1, ai.correct + ai.incorrect) : 0;
						const bRatio = bi ? bi.incorrect / Math.max(1, bi.correct + bi.incorrect) : 0;
						return bRatio - aRatio;
					});
			case 'interview':
				return pool.filter((c) => !!c.interview_question);
			case 'review':
				return pool.filter((c) => {
					const cp = state.cards[c.id];
					return cp && cp.nextReview !== null && cp.nextReview <= now;
				});
			case 'today':
				return shuffle(
					pool.filter((c) => {
						const cp = state.cards[c.id];
						return !cp || cp.seen === 0 || (cp.nextReview !== null && cp.nextReview <= now);
					})
				);
			case 'quiz':
			case 'timed':
			case 'normal':
			default:
				return pool;
		}
	}

	let deck: FlashcardType[] = [];
	let index = 0;
	let sessionCorrect = 0;
	let sessionTotal = 0;
	let finished = false;
	let cardKey = 0; // forces Flashcard remount/reset between cards
	let timeLeft = 60;
	let timerInterval: ReturnType<typeof setInterval> | undefined;

	$: {
		// Rebuild the deck whenever mode or topic changes (not on every progress tick).
		slug, mode;
		deck = buildDeck(mode, slug);
		index = 0;
		sessionCorrect = 0;
		sessionTotal = 0;
		finished = deck.length === 0;
		cardKey++;
		startTimerIfNeeded();
	}

	function startTimerIfNeeded() {
		clearInterval(timerInterval);
		if (mode !== 'timed') return;
		timeLeft = 60;
		timerInterval = setInterval(() => {
			timeLeft -= 1;
			if (timeLeft <= 0) {
				handleAnswer({ detail: { correct: false } } as CustomEvent<{ correct: boolean }>);
			}
		}, 1000);
	}

	onDestroy(() => clearInterval(timerInterval));

	function handleAnswer(e: CustomEvent<{ correct: boolean }>) {
		sessionTotal++;
		if (e.detail.correct) sessionCorrect++;
		setTimeout(() => {
			if (index + 1 >= deck.length) {
				finished = true;
				clearInterval(timerInterval);
			} else {
				index++;
				cardKey++;
				startTimerIfNeeded();
			}
		}, 550);
	}

	function restart() {
		deck = shuffle(deck);
		index = 0;
		sessionCorrect = 0;
		sessionTotal = 0;
		finished = false;
		cardKey++;
		startTimerIfNeeded();
	}

	$: currentCard = deck[index];
	$: progressPct = deck.length ? Math.round(((index + (finished ? 1 : 0)) / deck.length) * 100) : 0;
	$: accuracyPct = sessionTotal ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
</script>

<svelte:head>
	<title>Study {topic?.name ?? 'All Topics'} — Gradient</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<div class="mb-5 flex items-center justify-between">
		<a
			href={slug === 'all' ? '/' : `/topics/${slug}`}
			class="flex items-center gap-1.5 text-sm text-ink-300 hover:text-white"
		>
			<ArrowLeft size={16} /> Back
		</a>
		<div class="flex items-center gap-3">
			{#if mode === 'timed' && !finished && deck.length > 0}
				<span class="pill flex items-center gap-1 {timeLeft <= 10 ? 'badge-advanced' : 'glass text-ink-300'}">
					<Timer size={13} /> {timeLeft}s
				</span>
			{/if}
			<span class="pill glass text-ink-300 capitalize">{mode} mode</span>
		</div>
	</div>

	{#if !finished}
		<div class="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
			<div
				class="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
				style="width: {progressPct}%"
			></div>
		</div>
	{/if}

	{#if deck.length === 0 && !finished}
		<div class="glass-card py-16 text-center text-ink-300">No cards match this mode yet.</div>
	{:else if finished}
		<div class="glass-card relative overflow-hidden p-8 text-center">
			<Confetti />
			<div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-glow">
				<PartyPopper size={26} />
			</div>
			<h2 class="font-display text-2xl font-bold text-white">Session complete!</h2>
			<p class="mt-1 text-ink-300">You reviewed {sessionTotal} card{sessionTotal === 1 ? '' : 's'}.</p>

			<div class="my-6 flex justify-center">
				<ProgressRing value={accuracyPct} size={120} label="{accuracyPct}%" sublabel="accuracy" />
			</div>

			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				<button on:click={restart} class="btn-primary">Study again</button>
				<a href={slug === 'all' ? '/topics' : `/topics/${slug}`} class="btn-ghost">Back to topic</a>
			</div>
		</div>
	{:else if currentCard}
		<p class="mb-3 text-center text-xs font-medium uppercase tracking-wide text-ink-500">
			Card {index + 1} of {deck.length}
		</p>
		{#key cardKey}
			<div in:fly={{ x: 40, duration: 300 }}>
				<Flashcard
					card={mode === 'interview' && currentCard.interview_question
						? { ...currentCard, question: currentCard.interview_question }
						: currentCard}
					showNoteInput={true}
					on:answer={handleAnswer}
				/>
			</div>
		{/key}
	{/if}
</div>
