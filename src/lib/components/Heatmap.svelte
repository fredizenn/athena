<script lang="ts">
	import type { DailyLog } from '$lib/types';

	export let logs: Record<string, DailyLog>;
	export let weeks = 18;

	function dayKey(d: Date) {
		return d.toISOString().slice(0, 10);
	}

	const today = new Date();
	// Align to the most recent Saturday so columns are full weeks ending today.
	const days: { date: string; count: number }[] = [];
	for (let i = weeks * 7 - 1; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		const key = dayKey(d);
		days.push({ date: key, count: logs[key]?.studied ?? 0 });
	}

	// group into columns of 7 (weeks)
	$: columns = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) => days.slice(i * 7, i * 7 + 7));

	function levelClass(count: number) {
		if (count === 0) return 'bg-white/[0.05]';
		if (count < 5) return 'bg-violet-900';
		if (count < 10) return 'bg-violet-600';
		if (count < 20) return 'bg-violet-400';
		return 'bg-cyan-400';
	}
</script>

<div class="flex gap-[3px] overflow-x-auto no-scrollbar py-1">
	{#each columns as col}
		<div class="flex flex-col gap-[3px]">
			{#each col as day}
				<div
					class="h-3 w-3 rounded-[3px] {levelClass(day.count)} transition-colors"
					title="{day.date}: {day.count} card{day.count === 1 ? '' : 's'}"
				></div>
			{/each}
		</div>
	{/each}
</div>
<div class="mt-2 flex items-center gap-1.5 text-[10px] text-ink-500">
	<span>Less</span>
	<div class="h-3 w-3 rounded-[3px] bg-white/[0.05]"></div>
	<div class="h-3 w-3 rounded-[3px] bg-violet-900"></div>
	<div class="h-3 w-3 rounded-[3px] bg-violet-600"></div>
	<div class="h-3 w-3 rounded-[3px] bg-violet-400"></div>
	<div class="h-3 w-3 rounded-[3px] bg-cyan-400"></div>
	<span>More</span>
</div>
