<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Bookmark, Check, X, Lightbulb, Code2, Briefcase, MessageCircleQuestion, AlertTriangle, Tags } from 'lucide-svelte';
	import type { Flashcard } from '$lib/types';
	import { progress } from '$lib/stores/progress';

	export let card: Flashcard;
	export let flipped = false;
	export let showNoteInput = false;

	const dispatch = createEventDispatcher<{ answer: { correct: boolean }; next: void }>();

	let flashState: 'idle' | 'correct' | 'incorrect' = 'idle';
	let noteDraft = '';

	$: cardProgress = $progress.cards[card.id];
	$: bookmarked = cardProgress?.bookmarked ?? false;
	$: noteDraft = cardProgress?.note ?? '';

	function reveal() {
		flipped = true;
	}

	function answer(correct: boolean) {
		flashState = correct ? 'correct' : 'incorrect';
		progress.recordAnswer(card.id, correct);
		dispatch('answer', { correct });
		setTimeout(() => {
			flashState = 'idle';
		}, 500);
	}

	function toggleBookmark(e: MouseEvent) {
		e.stopPropagation();
		progress.toggleBookmark(card.id);
	}

	function saveNote() {
		progress.setNote(card.id, noteDraft);
	}

	const difficultyClass: Record<string, string> = {
		Beginner: 'badge-beginner',
		Intermediate: 'badge-intermediate',
		Advanced: 'badge-advanced'
	};
</script>

<div class="perspective mx-auto w-full max-w-2xl">
	<div
		class="relative min-h-[420px] preserve-3d transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
		class:rotate-y-180={flipped}
	>
		<!-- FRONT -->
		<div
			class="glass-card grid-surface backface-hidden absolute inset-0 flex flex-col p-6 sm:p-8
				{flashState === 'correct' ? 'ring-2 ring-cyan-400' : ''} {flashState === 'incorrect' ? 'ring-2 ring-coral-400' : ''}"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class={difficultyClass[card.difficulty]}>{card.difficulty}</span>
					<span class="pill glass text-ink-300">{card.subtopic}</span>
				</div>
				<button
					class="rounded-lg p-2 text-ink-400 transition-colors hover:text-amber-400"
					on:click={toggleBookmark}
					aria-label="Bookmark this card"
				>
					<Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} class={bookmarked ? 'text-amber-400' : ''} />
				</button>
			</div>

			<div class="flex flex-1 flex-col items-center justify-center gap-6 py-6 text-center">
				<p class="font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
					{card.question}
				</p>
			</div>

			<button on:click={reveal} class="btn-primary w-full">Reveal answer</button>
		</div>

		<!-- BACK -->
		<div
			class="glass-card backface-hidden rotate-y-180 absolute inset-0 flex flex-col overflow-y-auto p-6 sm:p-8"
		>
			<div class="flex items-center justify-between">
				<span class={difficultyClass[card.difficulty]}>{card.difficulty}</span>
				<button
					class="rounded-lg p-2 text-ink-400 transition-colors hover:text-amber-400"
					on:click={toggleBookmark}
					aria-label="Bookmark this card"
				>
					<Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} class={bookmarked ? 'text-amber-400' : ''} />
				</button>
			</div>

			<div class="mt-3 space-y-4 text-sm leading-relaxed">
				<div>
					<p class="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-400">Answer</p>
					<p class="text-ink-100">{card.answer}</p>
				</div>

				<div>
					<p class="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-400">Explanation</p>
					<p class="text-ink-200">{card.explanation}</p>
				</div>

				{#if card.example}
					<div>
						<p class="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Example</p>
						<p class="text-ink-200">{card.example}</p>
					</div>
				{/if}

				{#if card.code}
					<div>
						<p class="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
							<Code2 size={13} /> Code
						</p>
						<pre class="overflow-x-auto rounded-xl bg-ink-950/80 border border-white/[0.06] p-3 font-mono text-xs text-cyan-200"><code>{card.code}</code></pre>
					</div>
				{/if}

				{#if card.diagram}
					<div>
						<p class="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Visual intuition</p>
						<p class="italic text-ink-300">{card.diagram}</p>
					</div>
				{/if}

				{#if card.memory_tip}
					<div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
						<p class="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-400">
							<Lightbulb size={13} /> Memory tip
						</p>
						<p class="text-ink-200">{card.memory_tip}</p>
					</div>
				{/if}

				{#if card.common_mistake}
					<div class="rounded-xl border border-coral-500/20 bg-coral-500/5 p-3">
						<p class="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-coral-400">
							<AlertTriangle size={13} /> Common mistake
						</p>
						<p class="text-ink-200">{card.common_mistake}</p>
					</div>
				{/if}

				{#if card.real_world}
					<div>
						<p class="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
							<Briefcase size={13} /> Real-world application
						</p>
						<p class="text-ink-200">{card.real_world}</p>
					</div>
				{/if}

				{#if card.interview_question}
					<div>
						<p class="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
							<MessageCircleQuestion size={13} /> Interview question
						</p>
						<p class="text-ink-200">{card.interview_question}</p>
					</div>
				{/if}

				{#if card.tags?.length}
					<div class="flex flex-wrap items-center gap-1.5 pt-1">
						<Tags size={13} class="text-ink-500" />
						{#each card.tags as tag}
							<span class="pill bg-white/[0.04] text-ink-400">{tag}</span>
						{/each}
					</div>
				{/if}

				{#if card.references?.length}
					<p class="text-xs text-ink-500">References: {card.references.join('; ')}</p>
				{/if}

				{#if showNoteInput}
					<div class="pt-2">
						<label for="note-{card.id}" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-400">
							Your note
						</label>
						<textarea
							id="note-{card.id}"
							bind:value={noteDraft}
							on:blur={saveNote}
							placeholder="Add a personal note or mnemonic..."
							class="w-full rounded-xl border border-white/[0.08] bg-ink-950/60 p-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-violet-400/50"
							rows="2"
						></textarea>
					</div>
				{/if}
			</div>

			<div class="mt-5 grid grid-cols-2 gap-3">
				<button
					on:click={() => answer(false)}
					class="btn bg-coral-500/10 text-coral-400 border border-coral-500/30 hover:bg-coral-500/20"
				>
					<X size={16} /> Didn't know it
				</button>
				<button
					on:click={() => answer(true)}
					class="btn bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
				>
					<Check size={16} /> Got it
				</button>
			</div>
		</div>
	</div>
</div>
