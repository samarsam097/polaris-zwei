<footer class="footer">
	<div class="footer-content">
		<div class="footer-left">
			<a href="/" class="footer-logo"><strong>Resu</strong>.ninja</a>
			<p>&copy; {new Date().getFullYear()} Resu.ninja. All rights reserved.</p>
		</div>
		<div class="footer-right">
			<div class="footer-links">
				<a href="/#features">Features</a>
				<a href="/#pricing">Pricing</a>
				<a href="/#contact">Contact</a> </div>
			<div class="footer-links">
				<a href="/privacy">Privacy Policy</a>
				<a href="/terms">Terms of Service</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--background-sidebar);
		border-top: 1px solid var(--border-color);
		padding: 2.5rem 2rem;
		color: var(--text-secondary);
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap; /* Allows stacking on mobile */
		gap: 2rem;
	}

	.footer-left {
		flex-shrink: 0;
	}

	.footer-logo {
		font-size: 1.5rem;
		text-decoration: none;
		color: var(--text-headings);
		font-weight: 500;
		display: block;
		margin-bottom: 0.5rem;
	}

	.footer-left p {
		font-size: 0.9rem;
	}

	.footer-right {
		display: flex;
		gap: 3rem;
		flex-wrap: wrap; /* Allows stacking on mobile */
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer-links a {
		text-decoration: none;
		color: var(--text-secondary);
		font-size: 0.9rem;
		transition: color 0.2s;
	}

	.footer-links a:hover {
		color: var(--text-primary);
	}

	/* Responsive styles for mobile */
	@media (max-width: 768px) {
		.footer-content {
			flex-direction: column;
			gap: 2.5rem;
		}
	}
</style>