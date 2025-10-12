<script lang="ts">
	import { goto } from '$app/navigation';

	function login() {
		goto('/resume');
	}
</script>

<div class="homepage">
	<div class="background-image"></div>

	<div class="content">
		<h1>Your Resume Builder</h1>
		<h2>Build Your ATS-Friendly Resume in Minutes</h2>
		<p>Create, customize, and download a professional resume designed to pass the robot screeners.</p>
		<button on:click={login}>Get Started for Free</button>
	</div>
</div>

<style>
		*{
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
		}
	.homepage {
		position: relative; /* Wichtig für die Positionierung der inneren Elemente */
		height: 100vh;
		width: 100%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* EBENE 1: Das Hintergrundbild */
	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1; /* Unterste Ebene */
		background-image: url('/goodname.svg');
		background-size: cover;
		background-position: center;
	}

	/* EBENE 2 & 3: Der Inhalt */
	.content {
		position: relative;
		z-index: 2; /* Liegt über dem Hintergrundbild */
		padding: 2rem;
		max-width: 600px;
		text-align: center;
		color: white;

		/* Der Filter wird hier angewendet */
		background: rgba(30, 30, 30, 0.25); /* Halbtransparenter Hintergrund, damit der Filter etwas zum Verwischen hat */
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(818x); /* Für Safari */

		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);

	}

	h1 {

		font-size: 3.5rem;
		font-weight: bold;
			margin-bottom: 20px;
	}

	h2 {
		font-size: 1rem;
		font-weight: 300;
			margin-bottom: 15px
	}
  p{
			font-size: 1 rem;
	}
	button {
		margin-top: 2rem;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		background-color: #ffffff;
		color: #333;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
	}
</style>