import { writable } from 'svelte/store';

// This is the blueprint for our UI state. For now, it just holds the theme name.
export interface UiState {
	selectedTheme: string;
}

// The app will start with the 'classic' theme selected.
const initialState: UiState = {
	selectedTheme: 'classic'
};

// Create and export the writable store.
export const uiStore = writable<UiState>(initialState);