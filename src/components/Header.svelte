<script lang="ts">
	import { Icon, NavDropdownDesktop, NavDropdownMobile, ThemeToggle } from '$lib/comp';

	const navLinks = [
		{ title: 'Map', url: '/map', icon: 'map' },
		{ title: 'Contribute', url: '', icon: 'contribute' },
		{ title: 'Stats', url: '', icon: 'stats' },
		{ title: 'Areas', url: '', icon: 'areas' },
		{ title: 'Support Us', url: '/support-us', icon: 'support' }
	];

	const contributeDropdownLinks = [
		{ title: 'Add Location', url: '/add-location', icon: 'add' },
		{ title: 'Verify Location', url: '/verify-location', icon: 'verify' },
		{ title: 'Open Tickets', url: '/tickets', icon: 'ticket' },
		{ title: 'Tagging Issues', url: '/tagging-issues', icon: 'issue' }
	];

	const statsDropdownLinks = [
		{ title: 'Dashboard', url: '/dashboard', icon: 'dash' },
		{ title: 'Activity', url: '/activity', icon: 'activity' },
		{ title: 'Leaderboard', url: '/leaderboard', icon: 'leader' }
	];

	const areasDropdownLinks = [
		{ title: 'Communities', url: '/communities', icon: 'communities' },
		{ title: 'Countries', url: '/countries', icon: 'countries' }
	];

	const wikiDropdownLinks = [
		{
			title: 'TikTok',
			url: 'https://tiktok.com/@creclub',
			icon: 'general',
			external: true
		},
		{
			title: 'Discord',
			url: 'https://discord.com/servers/cre-1163344441436819497',
			icon: 'api',
			external: true
		}
	];

	let showMobileMenu = false;
</script>

<!-- desktop header -->
<header class="relative z-30 mx-auto hidden w-[1200px] items-center justify-between py-5 xl:flex">
	<a href="/">
		<img src="/images/logo.svg" alt="logo" class="w-16" />
	</a>

	<nav class="flex flex-wrap space-x-16">
		{#each navLinks as link}
			<!-- dropdown menu -->
			{#if link.title === 'Contribute'}
				<NavDropdownDesktop
					title={link.title}
					links={contributeDropdownLinks}
					top="add"
					bottom="issue"
				/>

				<!-- dropdown menu -->
			{:else if link.title === 'Stats'}
				<NavDropdownDesktop
					title={link.title}
					links={statsDropdownLinks}
					top="dash"
					bottom="leader"
				/>

				<!-- dropdown menu -->
			{:else if link.title === 'Areas'}
				<NavDropdownDesktop
					title={link.title}
					links={areasDropdownLinks}
					top="communities"
					bottom="countries"
				/>

				<!-- dropdown menu -->
			{:else if link.title === 'Wiki'}
				<NavDropdownDesktop
					title={link.title}
					links={wikiDropdownLinks}
					top="general"
					bottom="api"
				/>
			{:else}
				<!-- regular links -->
				<a
					href={link.url}
					class="text-xl font-semibold text-link transition-colors hover:text-hover dark:text-white dark:hover:text-link"
					>{link.title}
				</a>
			{/if}
		{/each}
	</nav>

	<ThemeToggle />
</header>

<!-- mobile header -->
<header
	class="sticky top-0 z-30 flex w-full items-center justify-between px-4 py-5 xl:hidden {showMobileMenu
		? 'bg-teal dark:bg-dark'
		: 'bg-teal/90 dark:bg-dark/90'}"
>
	<a href="/">
		<img src="/images/logo.svg" alt="logo" class="w-16" />
	</a>

	<div class="space-x-4">
		<ThemeToggle />

		<!-- menu toggle -->
		<button on:click={() => (showMobileMenu = !showMobileMenu)}>
			<Icon
				w={showMobileMenu ? '28' : '34'}
				h={showMobileMenu ? '27' : '12'}
				style="mx-auto mb-3 text-mobileMenu dark:text-white"
				icon={showMobileMenu ? 'close' : 'bars'}
				type="mobile-nav"
			/>
			<span class="font-semibold uppercase text-mobileMenu dark:text-white">Menu</span>
		</button>
	</div>

	<!-- menu -->
	<nav
		class="hide-scroll absolute top-[122.45px] z-30 {showMobileMenu
			? 'left-0'
			: 'left-[-100%]'} h-[calc(100dvh-122.45px)] w-full space-y-2 overflow-y-auto border-t border-[#BDD2D4] bg-teal p-8 transition-all ease-in-out dark:bg-dark"
	>
		{#each navLinks as link}
			<!-- dropdown menu -->
			{#if link.title === 'Contribute'}
				<NavDropdownMobile title={link.title} icon={link.icon} links={contributeDropdownLinks} />

				<!-- dropdown menu -->
			{:else if link.title === 'Stats'}
				<NavDropdownMobile title={link.title} icon={link.icon} links={statsDropdownLinks} />

				<!-- dropdown menu -->
			{:else if link.title === 'Areas'}
				<NavDropdownMobile title={link.title} icon={link.icon} links={areasDropdownLinks} />

				<!-- dropdown menu -->
			{:else if link.title === 'Wiki'}
				<NavDropdownMobile title={link.title} icon={link.icon} links={wikiDropdownLinks} />

				<!-- regular links -->
			{:else}
				<a href={link.url} class="flex w-full items-center text-xl text-link dark:text-white">
					<span
						class="mr-4 rounded-full bg-mobileButtons p-3 transition-colors active:bg-mobileButtonsActive"
					>
						<Icon w="24" h="24" icon={link.icon} type="mobile-nav" />
					</span>
					<span>{link.title}</span>
				</a>
			{/if}
		{/each}
	</nav>
</header>
