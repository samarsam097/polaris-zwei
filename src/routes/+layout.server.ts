import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession, supabase } }) => {
    // We still need supabase here on the server to fetch the profile
    console.log('--- LAYOUT LOAD FUNCTION START ---');
    const session = await getSession();
    let profileData = null;

    if (session?.user?.id) {
        const userIdToFetch = session.user.id;
        console.log(`Fetching profile for user ID: ${userIdToFetch}`);
        const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userIdToFetch)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile credits:', error);
        } else {
            profileData = data;
            console.log('Fetched profile data:', profileData);
        }
    } else {
        console.log('No active session found.');
    }

    // --- IMPORTANT: ONLY return serializable data ---
    return {
        session, // Session object is serializable
        profile: profileData // Your profile data ({credits: N}) is serializable
        // DO NOT return the full 'supabase' client instance from here
    };
};