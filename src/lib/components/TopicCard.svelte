<script lang="ts">
	import * as icons from 'lucide-svelte';
	import type { TopicMeta } from '$lib/types';

	export let topic: TopicMeta;
	export let cardCount: number;
	export let masteredCount: number = 0;
	export let estimatedMinutes: number;

	$: pct = cardCount ? Math.round((masteredCount / cardCount) * 100) : 0;
	$: Icon = (icons as any)[toPascal(topic.icon)] ?? icons.Sparkles;

	function toPascal(kebab: string) {
		return kebab
			.split('-')
			.map((s) => s[0].toUpperCase() + s.slice(1))
			.join('');
	}

	const colorMap: Record<string, string> = {
		violet: 'from-violet-500/25 to-violet-500/0 text-violet-400 border-violet-500/20',
		cyan: 'from-cyan-500/25 to-cyan-500/0 text-cyan-400 border-cyan-500/20',
		amber: 'from-amber-500/25 to-amber-500/0 text-amber-400 border-amber-500/20',
		coral: 'from-coral-500/25 to-coral-500/0 text-coral-400 border-coral-500/20'
	};
</script>

<a
	href="/topics/{topic.slug}"
	class="glass-card group relative flex flex-col gap-3 overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-glow"
>
	<div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br {colorMap[topic.color]} opacity-60 blur-2xl transition-opacity group-hover:opacity-100"></div>

	<div class="relative flex items-center justify-between">
		<div class="grid h-10 w-10 place-items-center rounded-xl border bg-ink-800/80 {colorMap[topic.color]}">
			<svelte:component this={Icon} size={20} strokeWidth={2} />
		</div>
		<span class="pill glass text-ink-300">{cardCount} cards</span>
	</div>

	<div class="relative">
		<h3 class="font-display text-base font-semibold text-white">{topic.name}</h3>
		<p class="mt-1 text-sm leading-snug text-ink-300">{topic.description}</p>
	</div>

	<div class="relative mt-auto">
		<div class="mb-1.5 flex items-center justify-between text-xs text-ink-400">
			<span>{masteredCount}/{cardCount} mastered</span>
			<span>~{estimatedMinutes} min</span>
		</div>
		<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
			<div
				class="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
				style="width: {pct}%"
			></div>
		</div>
	</div>
</a>
