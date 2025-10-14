<script lang="ts">
	import { goto } from '$app/navigation';

	export let data; // This data now includes the supabase client
	const { supabase } = data; // This will no longer be undefined

	async function loginWithGoogle() {
		// This will now work correctly
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${location.origin}/auth/callback`,
				queryParams: {
					prompt: 'select_account'
				}
			}
		});
	}
</script>

<svelte:head>
	<style>
		body {
			overflow: hidden;
		}
	</style>
</svelte:head>

<div class="homepage">
	<div class="background-image"></div>

	<div class="content">
		<h1>Your Resume Builder</h1>
		<h2>Build Your ATS-Friendly Resume in Minutes</h2>
		<p>Create, customize, and download a professional resume designed to pass the robot screeners.</p>
		<button on:click={loginWithGoogle} class="google-btn">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 12.03c0-.79-.07-1.55-.19-2.29H12v4.34h5.24c-.23 1.41-.93 2.62-1.95 3.42v2.84h3.65c2.13-1.96 3.38-4.88 3.38-8.31z"/><path fill="currentColor" d="M12 22c3.23 0 5.92-1.07 7.9-2.9l-3.65-2.84c-1.07.72-2.43 1.15-4.25 1.15-3.23 0-5.96-2.18-6.94-5.12H1.35v2.92C3.33 19.86 7.37 22 12 22z"/><path fill="currentColor" d="M5.06 14.29c-.19-.57-.3-.17-.3-1.79s.11-1.22.3-1.79V7.79H1.35C.52 9.35 0 11.25 0 13.5s.52 4.15 1.35 5.71l3.71-2.92z"/><path fill="currentColor" d="M12 5.38c1.74 0 3.3.6 4.54 1.78l3.23-3.23C17.92 2.09 15.23 1 12 1 7.37 1 3.33 3.14 1.35 6.08l3.71 2.92C6.04 6.56 8.77 5.38 12 5.38z"/></svg>
			Sign in with Google
		</button>
	</div>
</div>


<style>
	* {


		margin: 0;
		box-sizing: border-box;
	}

	.homepage {
		position: relative;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		background-color: #000;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		background-image: url('/goodname.svg');
		background-size: cover;
		background-position: center;
		opacity: 0.4;
	}

	.content {
		position: relative;
		z-index: 1;
		width: 90%;
		max-width: 600px;
		padding: 2rem;
		text-align: center;
		color: white;
		background: rgba(10, 10, 10, 0.25);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	h1 {
		font-size: 3.5rem;
		font-weight: bold;
		margin-bottom: 20px;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 300;
		margin-bottom: 15px;
	}

	p {
		font-size: 1rem;
	}

	/* The old button style is replaced with the new Google button style */
	.google-btn {
		margin-top: 2rem;
		padding: 0.75rem 1.5rem;
		font-size: 1.1rem;
		background-color: #ffffff;
		color: #333;
		border: 1px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		transition: background-color 0.2s;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
	}

	.google-btn:hover {
		background-color: #f5f5f5;
	}

</style>