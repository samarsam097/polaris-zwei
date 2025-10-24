import { writable } from 'svelte/store';

// --- DEFINE INTERFACES ---
export interface BasicInfo {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    photo: string;
    photoShape: 'circle' | 'square';
}

export interface Skill { // <-- 1. DEFINE THE SKILL OBJECT TYPE
    id: string;
    name: string;
}

// 2. PROACTIVELY ADD IDs TO OTHER LISTS
export interface WorkExperience {
    id: string;
    role: string;
    company: string;
    summary: string;
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
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

// 3. UPDATE RESUME DATA INTERFACE
export interface ResumeData {
    basicInfo: BasicInfo;
    summary: string;
    workExperience: WorkExperience[];
    skills: Skill[]; // <-- Use the Skill object type
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    languages: string[];
    customFields: CustomField[];
}

// 4. UPDATE INITIAL DATA
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
    skills: [], // <-- This is now an empty array of Skill objects
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    customFields: []
};

// Minimal normalization helper exported for components that may import it.
export function normalizeSkillsArray(arr: any): Skill[] {
    if (!Array.isArray(arr)) return [];

    return arr.map((item) => {
        if (typeof item === 'string') {
            return { id: Math.random().toString(36).slice(2, 10), name: item } as Skill;
        }

        if (item && typeof item === 'object') {
            return { id: item.id ?? Math.random().toString(36).slice(2, 10), name: (item.name ?? item.value ?? '').toString() } as Skill;
        }

        return { id: Math.random().toString(36).slice(2, 10), name: '' } as Skill;
    });
}

export const resumeData = writable<ResumeData>(initialData);