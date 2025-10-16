// src/routes/api/delete-account/+server.ts
import { error, json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const POST = async ({ locals: { getSession } }) => {
	// 1. Check if the user is actually logged in.
	const session = await getSession();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	// 2. Create a special "admin" client on the server using the secret key.
	const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	// 3. Use the admin client to securely delete the user.
	const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(session.user.id);

	if (deleteError) {
		console.error('Supabase admin error:', deleteError);
		throw error(500, 'Failed to delete user account.');
	}

	// 4. If successful, return a success message.
	return json({ success: true });
};