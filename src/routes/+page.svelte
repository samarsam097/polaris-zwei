<script lang="ts">
	// SvelteKit Imports
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Component Imports
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import SignUpModal from '$lib/components/ui/SignUpModal.svelte';

	// --- Server Data ---
	export let data;
	const { supabase } = data;

	// --- Local State ---
	let isLoginModalOpen = false;
	let isSignUpModalOpen = false;

	// --- Modal & Auth Functions ---
	function openSignUpModal() {
		isLoginModalOpen = false;
		isSignUpModalOpen = true;
	}

	async function loginWithGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${location.origin}/auth/callback` }
		});
	}

	async function handleEmailSignUp(event: CustomEvent) {
		const { name, email, password } = event.detail;
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: name
				}
			}
		});

		if (error) {
			alert(error.message);
		} else if (data.session) {
			isSignUpModalOpen = false;
			goto('/dashboard');
		} else {
			alert('Account created successfully!');
			isSignUpModalOpen = false;
		}
	}

	async function handleEmailSignIn(event: CustomEvent) {
		const { email, password } = event.detail;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			alert(error.message);
		} else {
			isLoginModalOpen = false;
			goto('/dashboard');
		}
	}
</script>

<LoginModal
	open={isLoginModalOpen}
	on:googleLogin={loginWithGoogle}
	on:signIn={handleEmailSignIn}
	on:openSignUp={openSignUpModal}
	on:close={() => (isLoginModalOpen = false)}
/>

<SignUpModal
	open={isSignUpModalOpen}
	on:signUp={handleEmailSignUp}
	on:close={() => (isSignUpModalOpen = false)}
/>

<svelte:head>
	<style>
		body {
			overflow: auto !important;
		}
	</style>
</svelte:head>

<div class="homepage-hero">
	<div class="background-image"></div>
	<div class="content">
		<h1>Craft Your Future</h1>
		<p>Build a professional, ATS-friendly resume in minutes. Create, customize, and download with ease.</p>

		{#if $page.data.session}
			<a href="/dashboard" class="hero-button"> Go to Dashboard </a>
		{:else}
			<button on:click={() => (isLoginModalOpen = true)} class="hero-button">
				Get Started
			</button>
		{/if}
	</div>
</div>

<section id="features" class="page-section">
	<div class="section-content">
		<h2>Why Choose Folio.ai?</h2>
		<p class="subtitle">Everything you need to create the perfect resume.</p>
		<div class="features-grid">
			<div class="feature-card">
				<h3>ATS-Friendly Templates</h3>
				<p>Get past the automated filters with templates designed to be read by resume scanners.</p>
			</div>
			<div class="feature-card">
				<h3>Easy Editing</h3>
				<p>A simple, clean interface that just works. No more fighting with word processors.</p>
			</div>
			<div class="feature-card">
				<h3>Secure & Private</h3>
				<p>Your data is yours. Securely log in and manage your resumes with confidence.</p>
			</div>
		</div>
	</div>
</section>

<section id="pricing" class="page-section alt-bg">
	<div class="section-content">
		<h2>Simple, Clear Pricing</h2>
		<p class="subtitle">Get started for free, upgrade when you're ready.</p>
		<div class="pricing-grid">
			<div class="pricing-card">
				<h3>Free</h3>
				<p class="price">$0</p>
				<ul>
					<li>1 Resume</li>
					<li>2 Standard Templates</li>
					<li>PDF Download</li>
				</ul>
				<button class="hero-button" on:click={() => (isSignUpModalOpen = true)}>
					Start for Free
				</button>
			</div>
			<div class="pricing-card pro">
				<h3>Pro</h3>
				<p class="price">$19</p>
				<ul>
					<li>Unlimited Resumes</li>
					<li>All Premium Templates</li>
					<li>AI Summary Generator (Coming Soon)</li>
				</ul>
				<button class="hero-button" on:click={() => (isSignUpModalOpen = true)}>
					Go Pro
				</button>
			</div>
		</div>
	</div>
</section>

<section id="contact" class="page-section">
	<div class="section-content contact-container">
		<h2>Get in Touch</h2>
		<p class="subtitle">
			Have a question, feedback, or need support? Fill out the form below.
		</p>

		<form class="contact-form" on:submit|preventDefault>
			<div class="form-group">
				<label for="name">Full Name</label>
				<input type="text" id="name" placeholder="Your Name" />
			</div>

			<div class="form-group">
				<label for="email">Email Address</label>
				<input type="email" id="email" placeholder="you@example.com" />
			</div>

			<div class="form-group">
				<label for="message">Message</label>
				<textarea id="message" rows="6" placeholder="Your message..."></textarea>
			</div>

			<button type="submit" class="submit-btn">Send Message</button>
		</form>
	</div>
</section>

<style>
	/* --- 1. HERO STYLES (MODIFIED FOR LIGHT THEME) --- */
	.homepage-hero {
		position: relative;
		height: 90vh;
		min-height: 600px;
		width: 100%;
		overflow: hidden;
		/* CHANGED: Use light background */
		background-color: var(--background-sidebar);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* REMOVED: .background-image and @keyframes fadeIn */
	/* The dark SVG grid won't look good on a light background. */

	.content {
		position: relative;
		z-index: 1;
		width: 90%;
		max-width: 600px;
		padding: 3rem;
		text-align: center;
		/* CHANGED: Use dark text */
		color: var(--text-primary);

		/* REMOVED: Dark-mode background/border styles */
		background: transparent;

		/* Ensure stacked layout and consistent spacing so buttons don't overlap text */
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	h1 {
		font-size: 3.5rem;
		font-weight: 500;
		margin-bottom: 1rem;
		letter-spacing: -1.5px;
		/* ADDED: Explicitly set dark heading color */
		color: var(--text-headings);
	}

	.content p {
		font-size: 1.125rem;
		/* CHANGED: Use light-theme secondary text color */
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 450px;
		margin: 0 auto;
	}

	.hero-button {
		margin-top: 1.5rem; /* reduced to work with flex gap */
		padding: 1rem 2.5rem;
		font-size: 1.1rem;
		/* CHANGED: Use primary accent colors */
		background-color: var(--accent-primary);
		color: var(--text-inverted);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		text-decoration: none;
	}
	.hero-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
		filter: brightness(95%); /* Darken button on hover */
	}

	/* --- 2. SECTION STYLES (Unchanged) --- */
	.page-section {
		scroll-margin-top: 65px;
		padding: 5rem 2rem;
	}

	.page-section.alt-bg {
		background-color: var(--background-sidebar);
	}

	.section-content {
		max-width: 1000px;
		margin: 0 auto;
		text-align: center;
	}

	h2 {
		font-size: 2.5rem;
		color: var(--text-headings);
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin-bottom: 3rem;
	}

	/* --- 3. FEATURES GRID (Unchanged) --- */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		text-align: left;
	}

	.feature-card {
		background-color: var(--background-sidebar);
		padding: 2rem;
		border-radius: 12px;
		border: 1px solid var(--border-color);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
	}

	.feature-card h3 {
		font-size: 1.25rem;
		color: var(--text-headings);
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.feature-card p {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 0;
	}

	/* --- 4. PRICING GRID (Unchanged) --- */
	.pricing-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		max-width: 700px;
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.pricing-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.pricing-card {
		background-color: var(--background-main);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 2.5rem;
	}

	.pricing-card.pro {
		background-color: var(--background-sidebar);
		border-color: var(--accent-primary);
		box-shadow: 0 6px 20px rgba(37, 99, 235, 0.1);
	}

	.pricing-card h3 {
		font-size: 1.5rem;
		color: var(--text-headings);
	}

	.pricing-card .price {
		font-size: 3rem;
		font-weight: bold;
		color: var(--text-headings);
		margin: 1rem 0;
	}

	.pricing-card ul {
		list-style: none;
		padding: 0;
		margin: 2rem 0;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.pricing-card li {
		color: var(--text-secondary);
	}

	.pricing-card .hero-button {
		width: 100%;
	}

	.pricing-card.pro .hero-button {
		background-color: var(--accent-primary);
		color: var(--text-inverted);
	}

	/* --- 5. CONTACT FORM STYLES (Unchanged) --- */
	.contact-container {
		max-width: 700px;
	}

	.form-group {
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
		display: block;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		box-sizing: border-box; /* Add this for better padding control */
		background-color: var(--background-input);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 0.75rem;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--border-focus);
	}

	.submit-btn {
		width: 100%;
		max-width: 300px; /* Limit button width */
		padding: 0.75rem;
		background-color: var(--accent-primary);
		color: var(--text-inverted);
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-btn:hover {
		filter: brightness(90%);
	}
</style>