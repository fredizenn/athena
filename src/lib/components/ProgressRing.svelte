<script lang="ts">
	export let value: number = 0; // 0-100
	export let size: number = 96;
	export let stroke: number = 8;
	export let colorFrom: string = '#7c6fff';
	export let colorTo: string = '#4cd3c2';
	export let label: string = '';
	export let sublabel: string = '';

	$: radius = (size - stroke) / 2;
	$: circumference = 2 * Math.PI * radius;
	$: offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
	const gradientId = `pr-grad-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="relative inline-grid place-items-center" style="width:{size}px;height:{size}px">
	<svg width={size} height={size} class="-rotate-90">
		<defs>
			<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color={colorFrom} />
				<stop offset="100%" stop-color={colorTo} />
			</linearGradient>
		</defs>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="rgba(255,255,255,0.06)"
			stroke-width={stroke}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="url(#{gradientId})"
			stroke-width={stroke}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			style="transition: stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1);"
		/>
	</svg>
	<div class="absolute inset-0 grid place-items-center text-center leading-none">
		<div>
			<div class="font-display text-xl font-bold text-white">{label || `${Math.round(value)}%`}</div>
			{#if sublabel}
				<div class="mt-0.5 text-[10px] uppercase tracking-wide text-ink-400">{sublabel}</div>
			{/if}
		</div>
	</div>
</div>
