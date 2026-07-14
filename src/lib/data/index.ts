import type { Flashcard } from '$lib/types';

// Import every flashcard JSON file in this directory.
// To add more content later: drop a new topic-name.json file in this folder
// (matching the Flashcard schema) — it will be picked up automatically.
const modules = import.meta.glob('./cards/*.json', { eager: true }) as Record<
	string,
	{ default: Flashcard[] }
>;

export const ALL_CARDS: Flashcard[] = Object.values(modules).flatMap((m) => m.default);

export function cardsByTopic(topicSlug: string): Flashcard[] {
	return ALL_CARDS.filter((c) => c.topic === topicSlug);
}

export function getCard(id: string): Flashcard | undefined {
	return ALL_CARDS.find((c) => c.id === id);
}
