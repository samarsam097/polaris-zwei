<slot />

<style>

	/* The 'global' attribute tells Svelte that these styles should apply
	   to the whole document, not just this component. */

	:global(body){
			font-family: sans-serif;
		/* Remove the browser's default margin */
		margin: 0;

		/* It's also good practice to reset padding at the same time. */
		padding: 0;

		/* This helps ensure elements size themselves more predictably. */
		box-sizing: border-box;
	}
</style>