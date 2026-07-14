/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				display: ['"Space Grotesk"', 'sans-serif'],
				body: ['"Inter"', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'monospace']
			},
			colors: {
				ink: {
					950: '#080a10',
					900: '#0b0e16',
					850: '#0f1320',
					800: '#131829',
					700: '#1b2137',
					600: '#262d47',
					500: '#39415f',
					400: '#5b6488',
					300: '#8790b3',
					200: '#b9c0da',
					100: '#dfe3f2'
				},
				violet: {
					400: '#9d8cff',
					500: '#7c6fff',
					600: '#6152e8'
				},
				cyan: {
					400: '#5fe8d6',
					500: '#4cd3c2',
					600: '#33ada0'
				},
				amber: {
					400: '#ffcf7a',
					500: '#f5b754'
				},
				coral: {
					400: '#ff8a8a',
					500: '#ff6b6b'
				}
			},
			backgroundImage: {
				'grid-graph':
					'linear-gradient(rgba(124,111,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.06) 1px, transparent 1px)',
				'aurora': 'radial-gradient(60% 60% at 20% 10%, rgba(124,111,255,0.20) 0%, rgba(124,111,255,0) 60%), radial-gradient(50% 50% at 85% 20%, rgba(76,211,194,0.15) 0%, rgba(76,211,194,0) 60%)'
			},
			boxShadow: {
				glow: '0 0 0 1px rgba(124,111,255,0.15), 0 8px 30px -8px rgba(124,111,255,0.35)',
				card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)'
			},
			backgroundSize: {
				'grid-sm': '28px 28px'
			},
			keyframes: {
				'flip-in': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' }
				},
				'pop': {
					'0%': { transform: 'scale(0.96)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%,100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-6px)' }
				}
			},
			animation: {
				pop: 'pop 0.25s ease-out',
				float: 'float 6s ease-in-out infinite'
			}
		}
	},
	plugins: []
};
