import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { CardProgress, ProgressState } from '$lib/types';
import { ALL_CARDS } from '$lib/data';

const STORAGE_KEY = 'gradient-flashcards:progress:v1';

function todayKey(d: Date = new Date()): string {
	return d.toISOString().slice(0, 10);
}

function emptyCardProgress(id: string): CardProgress {
	return {
		id,
		seen: 0,
		correct: 0,
		incorrect: 0,
		lastSeen: null,
		nextReview: null,
		ease: 2.3,
		bookmarked: false,
		note: '',
		mastered: false
	};
}

function loadInitial(): ProgressState {
	const base: ProgressState = {
		cards: {},
		logs: {},
		streak: 0,
		longestStreak: 0,
		lastStudyDate: null,
		totalTimeMinutes: 0
	};
	if (!browser) return base;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return base;
		const parsed = JSON.parse(raw);
		return { ...base, ...parsed };
	} catch {
		return base;
	}
}

function createProgressStore() {
	const { subscribe, update, set } = writable<ProgressState>(loadInitial());

	function persist(state: ProgressState) {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}

	function getCardProgress(state: ProgressState, id: string): CardProgress {
		return state.cards[id] ?? emptyCardProgress(id);
	}

	function bumpStreak(state: ProgressState) {
		const today = todayKey();
		if (state.lastStudyDate === today) return; // already counted today
		const yesterday = todayKey(new Date(Date.now() - 86400000));
		if (state.lastStudyDate === yesterday) {
			state.streak += 1;
		} else {
			state.streak = 1;
		}
		state.longestStreak = Math.max(state.longestStreak, state.streak);
		state.lastStudyDate = today;
	}

	return {
		subscribe,

		/** Record an answer (correct/incorrect) for a card, updating SRS + logs + streak. */
		recordAnswer(id: string, correct: boolean) {
			update((state) => {
				const cp = { ...getCardProgress(state, id) };
				cp.seen += 1;
				cp.lastSeen = Date.now();
				if (correct) {
					cp.correct += 1;
					cp.ease = Math.min(3.0, cp.ease + 0.1);
					const intervalDays = Math.max(1, Math.round(cp.ease ** cp.correct));
					cp.nextReview = Date.now() + intervalDays * 86400000;
					if (cp.correct >= 3 && cp.correct > cp.incorrect * 2) cp.mastered = true;
				} else {
					cp.incorrect += 1;
					cp.ease = Math.max(1.3, cp.ease - 0.2);
					cp.mastered = false;
					cp.nextReview = Date.now() + 43200000; // review again in 12h
				}
				const today = todayKey();
				const log = state.logs[today] ?? { date: today, studied: 0, correct: 0, incorrect: 0, minutes: 0 };
				log.studied += 1;
				if (correct) log.correct += 1;
				else log.incorrect += 1;

				const newState: ProgressState = {
					...state,
					cards: { ...state.cards, [id]: cp },
					logs: { ...state.logs, [today]: log }
				};
				bumpStreak(newState);
				persist(newState);
				return newState;
			});
		},

		toggleBookmark(id: string) {
			update((state) => {
				const cp = { ...getCardProgress(state, id) };
				cp.bookmarked = !cp.bookmarked;
				const newState = { ...state, cards: { ...state.cards, [id]: cp } };
				persist(newState);
				return newState;
			});
		},

		setNote(id: string, note: string) {
			update((state) => {
				const cp = { ...getCardProgress(state, id) };
				cp.note = note;
				const newState = { ...state, cards: { ...state.cards, [id]: cp } };
				persist(newState);
				return newState;
			});
		},

		addMinutes(minutes: number) {
			update((state) => {
				const newState = { ...state, totalTimeMinutes: state.totalTimeMinutes + minutes };
				persist(newState);
				return newState;
			});
		},

		reset() {
			const fresh = loadInitial();
			if (browser) localStorage.removeItem(STORAGE_KEY);
			set({
				cards: {},
				logs: {},
				streak: 0,
				longestStreak: 0,
				lastStudyDate: null,
				totalTimeMinutes: 0
			});
		},

		getCardProgress(id: string): CardProgress {
			return getCardProgress(get({ subscribe }), id);
		}
	};
}

export const progress = createProgressStore();

// ---- Derived convenience helpers (not stores, plain functions reading current value) ----

export function computeStats(state: ProgressState = get(progress)) {
	const totalCards = ALL_CARDS.length;
	const seenIds = Object.values(state.cards).filter((c) => c.seen > 0);
	const masteredCount = Object.values(state.cards).filter((c) => c.mastered).length;
	const totalCorrect = Object.values(state.cards).reduce((a, c) => a + c.correct, 0);
	const totalAttempts = Object.values(state.cards).reduce((a, c) => a + c.correct + c.incorrect, 0);
	const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

	const today = todayKey();
	const todayLog = state.logs[today];
	const cardsToday = todayLog?.studied ?? 0;

	return {
		totalCards,
		cardsSeen: seenIds.length,
		mastered: masteredCount,
		accuracy,
		streak: state.streak,
		longestStreak: state.longestStreak,
		cardsToday,
		totalTimeMinutes: state.totalTimeMinutes
	};
}

export function topicProgress(
	topicCardIds: string[],
	state: ProgressState = get(progress)
) {
	const seen = topicCardIds.filter((id) => (state.cards[id]?.seen ?? 0) > 0).length;
	const mastered = topicCardIds.filter((id) => state.cards[id]?.mastered).length;
	return {
		total: topicCardIds.length,
		seen,
		mastered,
		pct: topicCardIds.length ? Math.round((mastered / topicCardIds.length) * 100) : 0
	};
}
