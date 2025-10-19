import { writable } from 'svelte/store';

// This is the blueprint for our UI state.
export interface UiState {
	selectedTheme: string;
	isThemeSidebarOpen: boolean; // <-- ADDED
}

// The app will start with the 'classic' theme selected.
const initialState: UiState = {
	selectedTheme: 'classic',
	isThemeSidebarOpen: false // <-- ADDED
};

// Create and export the writable store.
export const uiStore = writable<UiState>(initialState);

// --- ADDED HELPER FUNCTION ---
// This makes it easy to toggle the sidebar from any component.
export function toggleThemeSidebar() {
	uiStore.update((current) => ({
		...current,
		isThemeSidebarOpen: !current.isThemeSidebarOpen
	}));
}