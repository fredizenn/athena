<script lang="ts">
	import { onMount } from 'svelte';

	export let pieces = 60;

	const colors = ['#7c6fff', '#4cd3c2', '#ffcf7a', '#ff8a8a', '#9d8cff'];

	interface Piece {
		left: number;
		delay: number;
		duration: number;
		color: string;
		rotate: number;
		size: number;
	}

	let items: Piece[] = [];

	onMount(() => {
		items = Array.from({ length: pieces }, () => ({
			left: Math.random() * 100,
			delay: Math.random() * 0.4,
			duration: 2.2 + Math.random() * 1.4,
			color: colors[Math.floor(Math.random() * colors.length)],
			rotate: Math.random() * 360,
			size: 6 + Math.random() * 6
		}));
	});
</script>

<div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
	{#each items as p}
		<span
			class="absolute top-[-5%] block rounded-sm confetti-piece"
			style="left:{p.left}%; width:{p.size}px; height:{p.size * 0.4}px; background:{p.color};
				animation-delay:{p.delay}s; animation-duration:{p.duration}s; transform: rotate({p.rotate}deg);"
		></span>
	{/each}
</div>

<style>
	.confetti-piece {
		animation-name: confetti-fall;
		animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		animation-fill-mode: forwards;
	}
	@keyframes confetti-fall {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: translateY(110vh) rotate(360deg);
			opacity: 0;
		}
	}
</style>
