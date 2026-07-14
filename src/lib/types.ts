export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Flashcard {
	id: string;
	topic: string; // topic slug, must match a key in topics.ts
	subtopic: string;
	difficulty: Difficulty;
	question: string;
	answer: string;
	explanation: string;
	example?: string;
	code?: string;
	diagram?: string; // text description of a diagram/visual
	interview_question?: string;
	real_world?: string;
	related?: string[]; // related flashcard ids or concept names
	tags: string[];
	references?: string[];
	memory_tip?: string;
	common_mistake?: string;
}

export interface TopicMeta {
	slug: string;
	name: string;
	group: string; // umbrella category, e.g. "Foundations", "Classical ML", "Deep Learning & AI"
	description: string;
	icon: string; // lucide icon name
	color: 'violet' | 'cyan' | 'amber' | 'coral';
}

export type StudyMode =
	| 'normal'
	| 'review'
	| 'random'
	| 'interview'
	| 'quiz'
	| 'timed'
	| 'hard'
	| 'favorites'
	| 'today';

export interface CardProgress {
	id: string;
	seen: number;
	correct: number;
	incorrect: number;
	lastSeen: number | null; // epoch ms
	nextReview: number | null; // epoch ms, simple SRS
	ease: number; // 1.3 - 3.0
	bookmarked: boolean;
	note: string;
	mastered: boolean;
}

export interface DailyLog {
	date: string; // YYYY-MM-DD
	studied: number;
	correct: number;
	incorrect: number;
	minutes: number;
}

export interface ProgressState {
	cards: Record<string, CardProgress>;
	logs: Record<string, DailyLog>;
	streak: number;
	longestStreak: number;
	lastStudyDate: string | null;
	totalTimeMinutes: number;
}
