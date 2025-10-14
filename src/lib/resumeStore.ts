// In src/lib/resumeStore.ts
import { writable } from 'svelte/store';
// ... your interfaces ...

export const initialData: ResumeData = {
	basicInfo: {
		name: 'Your Name',
		email: 'your.email@example.com',
		phone: '',
		website: '',
		address: '',
		photo: '',
		photoShape: 'circle'
	},
	summary: '',
	workExperience: [],
	skills: [],
	education: [],
	projects: [],
	certifications: [],
	languages: [],
	customFields: []
};

// The store starts empty. The builder page will fill it with data.
export const resumeData = writable<ResumeData>(initialData);