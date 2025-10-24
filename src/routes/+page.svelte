<script lang="ts">
	// SvelteKit Imports
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Component Imports
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import SignUpModal from '$lib/components/ui/SignUpModal.svelte';
	import ForgotPasswordModal from '$lib/components/ui/ForgotPasswordModal.svelte';

	// --- Server Data ---
	export let data;
	const { supabase } = data;

	// --- Local State ---
	let isLoginModalOpen = false;
	let isSignUpModalOpen = false;
	let isForgotPasswordModalOpen = false;

	// --- Modal & Auth Functions ---
	function openSignUpModal() {
		isLoginModalOpen = false;
		isForgotPasswordModalOpen = false;
		isSignUpModalOpen = true;
	}

	function openForgotPasswordModal() {
		isLoginModalOpen = false;
		isSignUpModalOpen = false;
		isForgotPasswordModalOpen = true;
	}

	async function handlePasswordReset(event: CustomEvent) {
		const { email } = event.detail;
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${location.origin}/`
		});
		if (error) throw error;
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
			options: { data: { full_name: name } }
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
	on:forgotPassword={openForgotPasswordModal}
	on:close={() => (isLoginModalOpen = false)}
/>
<SignUpModal
	open={isSignUpModalOpen}
	on:signUp={handleEmailSignUp}
	on:close={() => (isSignUpModalOpen = false)}
/>
<ForgotPasswordModal
	open={isForgotPasswordModalOpen}
	on:sendResetLink={handlePasswordReset}
	on:close={() => (isForgotPasswordModalOpen = false)}
/>

<svelte:head>
	<style>
		body { overflow: auto !important; }
	</style>
</svelte:head>

<div class="homepage-hero">
	<div class="hero-layout">
		<div class="hero-content">
			<h1>Build Your Professional Resume, Easily</h1>
			<p>Resu.ninja simplifies creating, updating, and downloading ATS-friendly resumes that stand out.</p>

			<div class="hero-actions">
				{#if $page.data.session}
					<a href="/dashboard" class="hero-button primary"> Go to Dashboard </a>
				{:else}
					<button on:click={() => (isLoginModalOpen = true)} class="hero-button primary">
						Get Started Free
					</button>
					<button on:click={() => (isSignUpModalOpen = true)} class="hero-button secondary">
						Sign Up
					</button>
				{/if}
			</div>
		</div>

		<div class="hero-visual">
			<div class="templates-stack-wrapper">
				<div class="template-layer layer-back">
					<img src="/elegant.png" alt="Elegant Resume Template" class="template-img" />
				</div>
				<div class="template-layer layer-middle">
					<img src="/modern.png" alt="Modern Resume Template" class="template-img" />
				</div>
				<div class="template-layer layer-front">
					<img src="/classic.png" alt="Classic Resume Template" class="template-img" />
				</div>
			</div>
		</div>
	</div>
</div>

<section id="templates" class="page-section alt-bg">
	<div class="section-content">
		<h2>Professionally Designed Templates</h2>
		<p class="subtitle">Choose a template that matches your style and industry.</p>
		<div class="templates-grid">
			<div class="template-card"><img src="/classic.png" alt="Classic theme" /><span>Classic</span></div>
			<div class="template-card"><img src="/modern.png" alt="Modern theme" /><span>Modern</span></div>
			<div class="template-card"><img src="/elegant.png" alt="Elegant theme" /><span>Elegant</span></div>
		</div>
	</div>
</section>

<section id="features" class="page-section">
	<div class="section-content">
		<h2>Why Choose Resu.ninja?</h2>
		<p class="subtitle">Everything you need to create the perfect resume.</p>
		<div class="features-grid">
			<div class="feature-card"><h3>ATS-Friendly Templates</h3><p>Get past the automated filters...</p></div>
			<div class="feature-card"><h3>Easy Editing</h3><p>A simple, clean interface that just works...</p></div>
			<div class="feature-card"><h3>Secure & Private</h3><p>Your data is yours...</p></div>
		</div>
	</div>
</section>

<section id="pricing" class="page-section alt-bg">
	<div class="section-content">
		<h2>Simple, Clear Pricing</h2>
		<p class="subtitle">Get started for free, upgrade when you're ready.</p>
		<div class="pricing-grid">
			<div class="pricing-card"><h3>Free</h3><p class="price">$0</p><ul><li>1 Resume</li><li>2 Templates</li><li>PDF Download</li></ul><button class="hero-button-section" on:click={()=>(isSignUpModalOpen=true)}>Start Free</button></div>
			<div class="pricing-card pro"><h3>Pro</h3><p class="price">$19</p><ul><li>Unlimited Resumes</li><li>All Templates</li><li>AI Help (Soon)</li></ul><button class="hero-button-section" on:click={()=>(isSignUpModalOpen=true)}>Go Pro</button></div>
		</div>
	</div>
</section>

<section id="contact" class="page-section">
	<div class="section-content contact-container">
		<h2>Get in Touch</h2>
		<p class="subtitle">Have a question or feedback? Fill out the form below.</p>
		<form class="contact-form" on:submit|preventDefault>
			<div class="form-group-contact"><label for="name">Full Name</label><input type="text" id="name" placeholder="Your Name" /></div>
			<div class="form-group-contact"><label for="email">Email</label><input type="email" id="email" placeholder="you@example.com" /></div>
			<div class="form-group-contact"><label for="message">Message</label><textarea id="message" rows="6" placeholder="Your message..."></textarea></div>
			<button type="submit" class="submit-btn">Send Message</button>
		</form>
	</div>
</section>


<style>
	/* --- DARK THEME VARIABLES (Scoped to hero) --- */
	.homepage-hero {
		--hero-bg: #18181b; /* zinc-900 */
		--hero-text-primary: #f4f4f5; /* zinc-100 */
		--hero-text-secondary: #a1a1aa; /* zinc-400 */
		--hero-border: #3f3f46; /* zinc-700 */
		--hero-card-bg: #27272a; /* zinc-800 */
		--hero-button-primary-bg: #fafafa; /* zinc-50 */
		--hero-button-primary-text: #18181b; /* zinc-900 */
		--hero-button-secondary-bg: transparent;
		--hero-button-secondary-text: #fafafa; /* zinc-50 */
	}

	/* --- GLOBAL --- */
	:global(body) {
		background-color: var(--background-main);
	}

	/* --- 1. HERO STYLES (Mobile First - RESPONSIVE FIXES) --- */
	.homepage-hero {
		position: relative;
		min-height: calc(100vh - 65px);
		width: 100%;
		/* IMPORTANT: Added overflow: hidden to contain elements */
		overflow: hidden;
		background-color: var(--hero-bg);
		color: var(--hero-text-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		box-sizing: border-box; /* Ensure padding is included */
	}

	.hero-layout {
		display: grid;
		grid-template-columns: 1fr; /* Single column */
		gap: 3rem;
		width: 100%;
		max-width: 1200px;
	}

	.hero-content {
		text-align: center;
		animation: slideInLeft 1s ease-out forwards;
		opacity: 0;
		z-index: 1; /* Ensure text is above visual if overlap occurs */
	}

	@keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }

	.hero-content h1 {
		font-size: clamp(2rem, 6vw, 2.5rem); /* Responsive font size */
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -1px;
		margin: 0 0 1rem;
		color: var(--hero-text-primary);
	}

	.hero-content p {
		font-size: clamp(0.9rem, 4vw, 1rem); /* Responsive font size */
		color: var(--hero-text-secondary);
		line-height: 1.6;
		margin: 0 0 2rem;
	}

	.hero-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.hero-button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s ease;
		text-decoration: none;
		white-space: nowrap;
	}
	.hero-button.primary { background-color: var(--hero-button-primary-bg); color: var(--hero-button-primary-text); }
	.hero-button.primary:hover { filter: brightness(95%); }
	.hero-button.secondary { background-color: var(--hero-button-secondary-bg); color: var(--hero-button-secondary-text); border: 1px solid var(--hero-border); }
	.hero-button.secondary:hover { background-color: var(--hero-card-bg); }

	/* --- Hero Visual (Image Stack - RESPONSIVE FIXES) --- */
	.hero-visual {
		display: flex;
		justify-content: center;
		align-items: center;
		perspective: 800px; /* Reduced perspective */
		position: relative;
		min-height: 250px; /* Ensure space for stack */
		/* Remove fixed height, let content define it */
	}

	.templates-stack-wrapper {
		position: relative;
		/* Adjusted clamp: min 180px, preferred 60vw, max 280px */
		width: clamp(180px, 60vw, 280px);
		aspect-ratio: 210 / 297;
		transform-style: preserve-3d;
		/* Simpler initial state for mobile */
		transform: rotateY(-3deg) scale(0.95);
		opacity: 0;
		animation: fadeInStackMobile 1.5s ease-out forwards;
		transition: transform 0.4s ease, box-shadow 0.4s ease;
	}

	@keyframes fadeInStackMobile {
		from { opacity: 0; transform: rotateY(-5deg) scale(0.85); }
		to { opacity: 1; transform: rotateY(-3deg) scale(1); }
	}

	.templates-stack-wrapper:hover {
		/* Reduced hover effect for mobile */
		transform: rotateY(-1deg) scale(1.03);
		box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
	}
	/* Reduced offsets for hover on mobile */
	.templates-stack-wrapper:hover .layer-back {
		transform: translate3d(12px, -6px, -25px) rotateY(-5deg);
	}
	.templates-stack-wrapper:hover .layer-middle {
		transform: translate3d(6px, -3px, -12px) rotateY(-2deg);
	}
	.templates-stack-wrapper:hover .layer-front {
		transform: translate3d(0px, 0px, 0px) rotateY(0deg);
	}

	.template-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 6px; /* Slightly smaller radius */
		overflow: hidden;
		background-color: white;
		box-shadow: 0 8px 15px rgba(0,0,0,0.25); /* Adjusted shadow */
		border: 1px solid var(--hero-border);
		transition: transform 0.4s ease;
	}

	/* Reduced initial offsets for mobile */
	.layer-back {
		transform: translate3d(20px, -10px, -40px) rotateY(-8deg);
	}
	.layer-middle {
		transform: translate3d(10px, -5px, -20px) rotateY(-4deg);
	}
	.layer-front {
		transform: translate3d(0, 0, 0) rotateY(0deg);
		z-index: 3;
	}
	/* Ensure z-index is set */
	.layer-middle { z-index: 2; }
	.layer-back { z-index: 1; }


	.template-img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		object-position: top;
	}

	/* --- Tablet & Desktop Overrides --- */
	@media (min-width: 768px) {
		.homepage-hero { padding: 4rem 2rem; }
		.hero-content h1 { font-size: clamp(2.5rem, 7vw, 3rem); } /* Adjust responsive H1 */
		.hero-content p { font-size: clamp(1rem, 4vw, 1.125rem); } /* Adjust responsive P */

		.hero-visual {
			min-height: 400px; /* Restore minimum height */
			perspective: 1000px; /* Restore perspective */
		}

		.templates-stack-wrapper {
			/* Restore clamp values for larger screens */
			width: clamp(250px, 50vw, 400px);
			/* Restore more pronounced tilt */
			transform: rotateY(-15deg) scale(0.9);
			animation-name: fadeInStackTablet;
			box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
		}
		@keyframes fadeInStackTablet {
			from { opacity: 0; transform: rotateY(-20deg) scale(0.8); }
			to { opacity: 1; transform: rotateY(-15deg) scale(1); }
		}

		.templates-stack-wrapper:hover {
			/* Restore tablet/desktop hover */
			transform: rotateY(-10deg) scale(1.04);
			box-shadow: 0 35px 70px -15px rgba(0,0,0,0.7);
		}

		/* Restore tablet/desktop layer transforms */
		.layer-back {
			transform: translate3d(40px, -20px, -80px) rotateY(-15deg);
		}
		.layer-middle {
			transform: translate3d(20px, -10px, -40px) rotateY(-8deg);
		}
		.layer-front {
			transform: translate3d(0, 0, 0) rotateY(0deg);
		}

		/* Restore hover offsets for tablet/desktop */
		.templates-stack-wrapper:hover .layer-back {
			transform: translate3d(20px, -10px, -40px) rotateY(-8deg);
		}
		.templates-stack-wrapper:hover .layer-middle {
			transform: translate3d(10px, -5px, -20px) rotateY(-4deg);
		}
	}

	@media (min-width: 992px) {
		.hero-layout {
			grid-template-columns: minmax(400px, 1fr) 1fr; /* Adjusted columns */
			align-items: center;
			gap: 4rem;
		}
		.hero-content { text-align: left; }
		.hero-actions { justify-content: flex-start; }
		.hero-visual { min-height: 500px; } /* Further increase min-height */
	}


	/* --- 2. SECTION STYLES (Light Theme - Unchanged) --- */
	.page-section { scroll-margin-top: 65px; padding: 5rem 2rem; background-color: var(--background-main); color: var(--text-primary); }
	.page-section.alt-bg { background-color: var(--background-sidebar); }
	.section-content { max-width: 1000px; margin: 0 auto; text-align: center; }
	h2 { font-size: 2.5rem; color: var(--text-headings); margin-bottom: 0.5rem; }
	.subtitle { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 3rem; }

	/* --- 3. TEMPLATES GRID (Unchanged) --- */
	.templates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 900px; margin: 0 auto; }
	.template-card { cursor: pointer; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; transition: all 0.2s ease-in-out; background-color: var(--background-sidebar); }
	.template-card:hover { transform: scale(1.03); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); }
	.template-card img { width: 100%; display: block; aspect-ratio: 210 / 297; object-fit: cover; object-position: top; background-color: #ffffff; }
	.template-card span { display: block; text-align: center; padding: 0.75rem; color: var(--text-secondary); font-size: 0.875rem; font-weight: 500; }

	/* --- 4. FEATURES GRID (Unchanged) --- */
	.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; text-align: left; }
	.feature-card { background-color: var(--background-sidebar); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
	.feature-card h3 { font-size: 1.25rem; color: var(--text-headings); margin: 0 0 0.5rem; }
	.feature-card p { color: var(--text-secondary); line-height: 1.6; margin: 0; }

	/* --- 5. PRICING GRID (Unchanged) --- */
	.pricing-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 700px; margin: 0 auto; }
	@media (min-width: 768px) { .pricing-grid { grid-template-columns: 1fr 1fr; } }
	.pricing-card { background-color: var(--background-main); border: 1px solid var(--border-color); border-radius: 12px; padding: 2.5rem; }
	.pricing-card.pro { background-color: var(--background-sidebar); border-color: var(--accent-primary); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.1); }
	.pricing-card h3 { font-size: 1.5rem; color: var(--text-headings); }
	.pricing-card .price { font-size: 3rem; font-weight: bold; color: var(--text-headings); margin: 1rem 0; }
	.pricing-card ul { list-style: none; padding: 0; margin: 2rem 0; text-align: left; display: flex; flex-direction: column; gap: 0.75rem; }
	.pricing-card li { color: var(--text-secondary); }
	.hero-button-section { width: 100%; padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s ease; background-color: #fff; color: #111; border: 1px solid var(--border-color); }
	.hero-button-section:hover { background-color: #e5e5e5; }
	.pricing-card.pro .hero-button-section { background-color: var(--accent-primary); color: var(--text-inverted); border: none; }
	.pricing-card.pro .hero-button-section:hover { filter: brightness(90%); }

	/* --- 6. CONTACT FORM STYLES (Unchanged) --- */
	.contact-container { max-width: 700px; }
	.form-group-contact { margin-bottom: 1.5rem; text-align: left; }
	.form-group-contact label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.25rem; display: block; }
	.form-group-contact input, .form-group-contact textarea { width: 100%; box-sizing: border-box; background-color: var(--background-input); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; font-size: 1rem; transition: border-color 0.2s; }
	.form-group-contact input:focus, .form-group-contact textarea:focus { outline: none; border-color: var(--border-focus); }
	.submit-btn { width: 100%; max-width: 300px; padding: 0.75rem; background-color: var(--accent-primary); color: var(--text-inverted); border: none; border-radius: 6px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background-color 0.2s; margin: 0 auto; display: block; }
	.submit-btn:hover { filter: brightness(90%); }

</style>