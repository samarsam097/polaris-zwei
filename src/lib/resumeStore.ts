import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Your interfaces remain the same
export interface WorkExperience {
	id: string;
	company: string;
	role: string;
	startDate: string;
	endDate: string;
	summary: string;
}
export interface Education {
	id: string;
	institution: string;
	degree: string;
	location: string;
	startDate: string;
	endDate: string;
}
export interface Project {
	id: string;
	name: string;
	link: string;
	summary: string;
}
export interface Certification {
	id: string;
	name: string;
	issuer: string;
	date: string;
}
export interface CustomField {
	id: string;
	label: string;
	value: string;
}


// The main data structure with the 'skills' correction
export interface ResumeData {
	basicInfo: {
		name: string;
		email: string;
		phone: string;
		website: string;
		address: string;
		photo: string;
		photoShape: string;
	};
	summary: string;
	workExperience: WorkExperience[];
	skills: string[]; // <-- CORRECTED: Was 'string', now 'string[]'
	education: Education[];
	projects: Project[];
	certifications: Certification[];
	languages: string[];
	customFields: CustomField[];
}


// --- START: NEW SAVE/LOAD LOGIC ---

// 1. Define a key for localStorage.
const storageKey = 'svelteResumeData';

// 2. Your initial data structure. This is used if no saved data is found.
const initialData: ResumeData = {
	basicInfo: {
		name: 'Your Name',
		email: 'your.email@example.com',
		phone: '',
		website: '',
		address: '',
		photo: '',
		photoShape: 'circle'
	},
	summary: 'A short and engaging professional summary about you.',
	workExperience: [],
	skills: [], // This now correctly matches the 'string[]' type
	education: [],
	projects: [],
	certifications: [],
	languages: [],
	customFields: []
};


// 3. A function to load data from localStorage or return the initial state.
function loadData(): ResumeData {
	// This check ensures localStorage is only accessed in the browser.
	if (typeof window !== 'undefined') {
		const savedData = localStorage.getItem(storageKey);
		// If data exists, parse it from a string back into an object.
		if (savedData) {
			return JSON.parse(savedData);
		}
	}
	// If in the server or no data is saved, return the blank resume.
	return initialData;
}

// 4. Create the store, starting with the data loaded from the function above.
export const resumeData: Writable<ResumeData> = writable(loadData());

// 5. This is the auto-save feature. It subscribes to any change in the store.
resumeData.subscribe((value) => {
	// Check if we're in the browser.
	if (typeof window !== 'undefined') {
		// Convert the data object to a string and save it.
		localStorage.setItem(storageKey, JSON.stringify(value));
	}
});

// --- END: NEW SAVE/LOAD LOGIC ---