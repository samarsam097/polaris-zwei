<script lang="ts">
	// 1. Import the built-in $page store, which now holds all session data
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let isMenuOpen = false;

	async function signOut() {
		// 2. Get the supabase client from the server-side page data
		const { supabase } = $page.data;
		await supabase.auth.signOut();
		isMenuOpen = false;
		goto('/');
	}
</script>

<nav class="navbar">
	<div class="nav-content">
		<a href="/" class="logo">
			<strong>Resume</strong>Builder
		</a>
		<div class="nav-links">
			<!-- 3. Check for the user's session in $page.data instead of the old store -->
			{#if $page.data.session}
				<div class="profile-menu">
					<button class="avatar-button" on:click={() => (isMenuOpen = !isMenuOpen)}>
						<div class="avatar default-avatar">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="user-icon"
							>
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
						</div>
					</button>

					{#if isMenuOpen}
						<div class="dropdown-menu">
							<a href="/dashboard" class="dropdown-item">Dashboard</a>
							<button on:click={signOut} class="dropdown-item">Sign Out</button>
						</div>
					{/if}
				</div>
			{:else}
				<!-- This part for logged-out users remains the same -->
				<a href="/#features">Features</a>
				<a href="/#pricing">Pricing</a>
				<a href="/" class="nav-button">Sign In</a>
			{/if}
		</div>
	</div>
</nav>

<!-- All of your styles are preserved exactly as you provided them -->
<style>
	.navbar {
		background-color: #111827;
		border-bottom: 1px solid black;
		padding: 1rem 2rem;
		font-family: 'Inter', sans-serif;
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.nav-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		font-size: 1.5rem;
		text-decoration: none;
		color: white;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-links a {
		text-decoration: none;
		color: #555;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: #007bff;
	}

	.nav-button {
		background-color: #007bff;
		color: white !important; /* Ensure text color is white */
		padding: 0.5rem 1rem;
		border-radius: 6px;
	}

	.nav-button:hover {
		background-color: #0056b3;
		color: white;
	}

	.profile-menu {
		position: relative;
	}

	.avatar-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		border-radius: 50%;
	}

	.default-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid #eee;
		background-color: #e0e0e0;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		color: #555;
	}

	.user-icon {
		width: 24px;
		height: 24px;
	}

	.dropdown-menu {
		position: absolute;
		top: 120%;
		right: 0;
		background-color: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		min-width: 150px;
		z-index: 60;
			overflow: hidden;
	}


	.dropdown-item {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		font-size: 1rem;
		font-family: 'Inter', sans-serif;
		color: #333; /* Set a consistent text color */
		text-decoration: none; /* Remove underline from the link */
		transition: background-color 0.2s;
	}

	.dropdown-item:hover {
		background-color: #f5f5f5;
			color: #333;
	}
</style>