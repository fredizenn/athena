<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType;
	export let label: string;
	export let value: string | number;
	export let accent: 'violet' | 'cyan' | 'amber' | 'coral' = 'violet';
	export let hint: string = '';

	const accentMap: Record<string, string> = {
		violet: 'from-violet-500/20 to-violet-500/0 text-violet-400',
		cyan: 'from-cyan-500/20 to-cyan-500/0 text-cyan-400',
		amber: 'from-amber-500/20 to-amber-500/0 text-amber-400',
		coral: 'from-coral-500/20 to-coral-500/0 text-coral-400'
	};
</script>

<div class="glass-card relative overflow-hidden p-4 sm:p-5">
	<div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br {accentMap[accent]} blur-xl"></div>
	<div class="relative flex items-start justify-between">
		<div>
			<p class="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
			<p class="mt-1.5 font-display text-2xl font-bold text-white sm:text-3xl">{value}</p>
			{#if hint}
				<p class="mt-1 text-xs text-ink-400">{hint}</p>
			{/if}
		</div>
		<div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] {accentMap[accent].split(' ').pop()}">
			<svelte:component this={icon} size={18} strokeWidth={2.2} />
		</div>
	</div>
</div>
