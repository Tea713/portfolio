<script lang="ts">
	import coolChair from '$lib/assets/images/cool-chair.png';
	import gitHubLogo from '$lib/assets/images/github-mark-white-1x.png';
	import linkedInLogo from '$lib/assets/images/InBug-White.png';
</script>

<section class="page-section hero">
	<div class="title">
		<img src={coolChair} class="page-icon" alt="Cool Chair Icon" />
		<h1 class="name">Thanh Nguyen</h1>
		<h3 class="job-title">Software Developer (Wannabe)</h3>
		<div class="social-links">
			<a href="https://github.com/Tea713" class="link-btn">
				<img src={gitHubLogo} class="logo" alt="GitHub Logo" />
			</a>
			<a href="https://www.linkedin.com/in/thanh-nguyen-85b619223" class="link-btn">
				<img src={linkedInLogo} class="logo" alt="LinkedIn Logo" />
			</a>
		</div>
	</div>
	<div class="about">
		<p>
			Hello there, I am a recent graduate from DePauw University, now located in NYC (willing to
			relocate!). Currently, I am not employed so I am open to most opportunities.
		</p>
		<p>
			I dabble in a bunch of things such as web development, game development, and machine learning.
			I am currently working on my skills in web dev and recenly picked up Rust to create tools and
			applications.
		</p>
		<p>
			For now, my portfolio will likely be constantly updated as I am using this project (and the
			next iteration of my portfolio) to learn web animation and also update any new projects this
			summer.
		</p>
		<p>
			This page is built with just vanilla html, css, and js. Since the portfolio's scope has
			changed abit (I wanted to add a projects section with much more animations), I have decided to
			create a new version with Svelte.
		</p>
	</div>
</section>

<style>
	/* CSS reset by Josh W. Comeau */

	/* 1. Use a more-intuitive box-sizing model */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	/* 2. Remove default margin */
	* {
		margin: 0;
	}

	/* 3. Enable keyword animations */
	@media (prefers-reduced-motion: no-preference) {
		html {
			interpolate-size: allow-keywords;
		}
	}

	body {
		/* 4. Add accessible line-height */
		line-height: 1.5;
		/* 5. Improve text rendering */
		-webkit-font-smoothing: antialiased;
	}

	/* 6. Improve media defaults */
	img,
	picture,
	video,
	canvas,
	svg {
		display: block;
		max-width: 100%;
	}

	/* 7. Inherit fonts for form controls */
	input,
	button,
	textarea,
	select {
		font: inherit;
	}

	/* 8. Avoid text overflows */
	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		overflow-wrap: break-word;
	}

	/* 9. Improve line wrapping */
	p {
		text-wrap: pretty;
	}
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		text-wrap: balance;
	}

	/*
  10. Create a root stacking context
*/
	#root,
	#__next {
		isolation: isolate;
	}

	/* Things I actually added */
	@font-face {
		font-family: 'Space Mono';
		src:
			url('fonts/spacemono/spacemono-regular-webfont.woff2') format('woff2'),
			url('fonts/spacemono/spacemono-regular-webfont.woff') format('woff');
		font-weight: normal;
		font-style: normal;
	}

	@font-face {
		font-family: 'Space Mono';
		src:
			url('fonts/spacemono/spacemono-bold-webfont.woff2') format('woff2'),
			url('fonts/spacemono/spacemono-bold-webfont.woff') format('woff');
		font-weight: bold;
		font-style: normal;
	}

	* {
		color: #ffffff;
		font-family: 'Space Mono', monospace;
	}

	:root {
		-ms-overflow-style: none;
		scrollbar-width: none;
		background-color: #000000;
	}

	:root::-webkit-scrollbar {
		display: none;
	}

	section {
		height: 100vh;
		padding: 4rem 8rem;
	}

	.hero {
		align-items: center;
		justify-content: center;
		display: grid;
		grid-template-columns: 2fr 3fr;
		grid-template-areas: 'me about';
	}

	.about,
	.title {
		padding: 8px 16px;
		display: flex;
		flex-direction: column;
	}

	.about {
		gap: 1.5rem;
		grid-area: 'about';
	}

	.title {
		gap: 0.5rem;
		grid-area: 'me';
	}

	.social-links {
		display: flex;
		gap: 10px;
	}

	.link-btn {
		border: none;
		background-color: black;
	}

	.logo {
		height: 30px;
		width: auto;
		background-color: black;
		border: 0px;
		transition:
			filter 0.3s ease-out,
			transform 0.3s ease-out;
	}

	.link-btn:hover .logo {
		filter: brightness(3);
		transform: scale(1.1);
	}

	.page-icon {
		max-height: 500px;
		max-width: auto;
		height: auto;
		width: auto;
	}

	h1 {
		font-weight: bolder;
		font-size: 3rem;
	}

	@media (max-width: 768px) {
		section {
			height: auto;
		}

		.hero {
			grid-template-columns: 1fr;
			grid-template-areas:
				'me'
				'about';
		}
	}
</style>
