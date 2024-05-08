<script lang="ts">
	import {
		AboutCommunity,
		AboutContributor,
		AboutCore,
		AboutIntegration,
		AboutMerchant,
		AboutPlus,
		AboutTagger,
		Footer,
		Header
	} from '$lib/comp';
	import {
		areaError,
		areas,
		elementError,
		elements,
		eventError,
		events,
		excludeLeader,
		userError,
		users
	} from '$lib/store';
	import type { Area, Element } from '$lib/types';
	import { errToast } from '$lib/utils';

	// alert for element errors
	$: $elementError && errToast($elementError);
	// alert for user errors
	$: $userError && errToast($userError);
	// alert for event errors
	$: $eventError && errToast($eventError);
	// alert for area errors
	$: $areaError && errToast($areaError);

	let dataInitalized = false;

	let merchants: Element[] = [];
	let communities: Area[] = [];

	const initializeData = () => {
		if (dataInitalized) return;

		merchants = $elements
			.filter((element) => element.tags['boost:expires'])
			.sort(
				(a, b) =>
					// @ts-expect-error
					Date.parse(b.tags['boost:expires']) - Date.parse(a.tags['boost:expires'])
			)
			.slice(0, 6);

		populateLeaderboard();

		communities = $areas.filter((area) => featuredCommunities.includes(area.id));

		dataInitalized = true;
	};

	$: $elements &&
		$elements.length &&
		$users &&
		$users.length &&
		$events &&
		$events.length &&
		$areas &&
		$areas.length &&
		!dataInitalized &&
		initializeData();

	let supertaggers: { id: number; username: string; avatar: string; total: number }[] = [];

	const populateLeaderboard = () => {
		$users.forEach((user) => {
			if ($excludeLeader.includes(user.id)) {
				return;
			}

			let userEvents = $events.filter((event) => event['user_id'] == user.id);

			if (userEvents.length) {
				let id = user.id;
				let username = user['osm_json'].display_name;
				let avatar = user['osm_json'].img
					? user['osm_json'].img.href
					: '/images/satoshi-nakamoto.png';

				supertaggers.push({
					id,
					username,
					avatar,
					total: id === 17221642 ? userEvents.length + 120 : userEvents.length
				});
			}
		});

		supertaggers.sort((a, b) => b.total - a.total);
		supertaggers = supertaggers.slice(0, 6);
	};

	const featuredCommunities = [
		'bitcoin-island-philippines',
		'btc-curacao',
		'bitcoin-beach',
		'bitcoin-ekasi',
		'einundzwanzig-deutschland',
		'free-madeira'
	];

	const communityIntegrations = [
		{ name: 'Coinos', icon: 'coinos', url: 'https://coinos.io/' },
		{ name: 'Wallet of Satoshi', icon: 'wos', url: 'https://www.walletofsatoshi.com/' },
		{ name: 'Pouch', icon: 'pouch', url: 'https://pouch.ph/' },
		{ name: 'Bolt Card', icon: 'bolt', url: 'https://www.boltcard.org/' },
		{ name: 'Galoy', icon: 'galoy', url: 'https://galoy.io/' },
		{ name: 'Satimoto', icon: 'satimoto', url: 'https://satimoto.com/' },
		{
			name: 'Bitcoin Dashboard',
			icon: 'dashboard',
			url: 'https://bitcoin-primodata.streamlit.app/'
		},
		{ name: 'BitLocal', icon: 'bitlocal', url: 'https://www.bitlocal.app/' },
		{ name: 'Nostr Bot', icon: 'nostr-bot', url: 'https://github.com/BcnBitcoinOnly/btcmap-bot' },
		{ name: 'Fedi', icon: 'fedi', url: 'https://www.fedi.xyz/' },
		{ name: 'Osmo', icon: 'osmo', url: 'https://www.osmowallet.com/' },
		{ name: 'Bitcoin Rocks!', icon: 'bitcoin-rocks', url: 'https://bitcoin.rocks/' },
		{ name: 'lipa', icon: 'lipa', url: 'https://lipa.swiss/' },
		{ name: 'Spirit of Satoshi', icon: 'spirit', url: 'https://www.spiritofsatoshi.ai/' }
	];

	const projectIntegrations = [
		{ name: 'OpenStreetMap', icon: 'osm', url: 'https://www.openstreetmap.org/' },
		{ name: 'LNbits', icon: 'lnbits', url: 'https://lnbits.com/' },
		{ name: 'GitHub', icon: 'gh', url: 'https://github.com/' },
		{ name: 'Voltage', icon: 'voltage', url: 'https://voltage.cloud/' },
		{ name: 'Leaflet', icon: 'leaflet', url: 'https://leafletjs.com/' },
		{ name: 'Stadia Maps', icon: 'stadia', url: 'https://stadiamaps.com/' },
		{ name: 'Chart.js', icon: 'chartjs', url: 'https://www.chartjs.org/' }
	];

	const contributors = [
		{
			name: 'salvanakamoto',
			title: 'iOS Developer',
			url: 'https://github.com/salvatoto',
			file: 'jpg'
		},
		{
			name: 'saunter',
			title: 'Community Leader',
			url: 'https://twitter.com/StackingSaunter',
			file: 'jpg'
		},
		{
			name: 'Rogzy',
			title: 'Community Leader',
			url: 'https://twitter.com/DecouvreBitcoin',
			file: 'jpg'
		},
		{
			name: 'HolgerHatGarKeineNode',
			title: 'Community Coder',
			url: 'https://github.com/HolgerHatGarKeineNode',
			file: 'jpeg'
		},
		{
			name: '3j2009',
			title: 'Designer',
			url: 'https://github.com/3j2009',
			file: 'jpeg'
		},
		{
			name: 'Liam',
			title: 'Animator',
			url: 'https://twitter.com/LiamCyDennis',
			file: 'jpg'
		},
		{
			name: 'Andrej',
			title: 'Icon Designer',
			url: 'https://nostr.com/npub1cak3t8wa5zaxe99mfrzqzt8h2hp0lvalk8agj3qmthkmrs3zvlaqyt964v',
			file: 'png'
		}
	];

	const coreTeam = [
		{
			name: 'LUV NFT',
			title: 'Tokenize the world',
			avatar: 'luvnft-gold',
			socials: [
				{ url: 'https://luvnft.com', name: 'website' },
				{ url: 'https://market.luvnft.com', name: 'website' }
			]
		},
		{
			name: '$RNT',
			title: 'Bitcoin $RNT BRC-20',
			avatar: 'rnt-gold',
			socials: [
				{ url: 'https://x.com/rntsat', name: 'twitter' },
				{ url: 'https://rnt.luvnft.com', name: 'website' }
			]
		},
		{
			name: 'Quest L$VE',
			title: 'Complete tasks to earn Love Money',
			avatar: 'quest-love-gold',
			socials: [
				{ url: 'https://zealy.io/cw/luvnft/questboard/', name: 'website' },
				{ url: 'https://luvnft.com', name: 'website' }
			]
		},
		{
			name: 'AR',
			title: 'Create branded social media AR Effects',
			avatar: 'tiktok-ar-effects-analytics-luvnft',
			socials: [
				{ url: 'https://nftv.luvnft.com', name: 'website' },
				{ url: 'https://tiktok.com@luvnft', name: 'website' }
			]
		}
	];
</script>

<svelte:head>
	<title>BTC Map - About</title>
	<meta property="og:image" content="https://btcmap.luvnft.com/images/og/home.png" />
	<meta property="twitter:title" content="BTC Map - About" />
	<meta property="twitter:image" content="https://btcmap.luvnft.com/images/og/home.png" />
</svelte:head>

<div class="bg-teal dark:bg-dark">
	<Header />
	<div class="mx-auto w-10/12 xl:w-[1200px]">
		<main class="mb-20 mt-10 space-y-20 text-primary dark:text-white md:space-y-40">
			<div class="space-y-5 text-center text-xl">
				<h1 class="text-4xl font-semibold !leading-tight md:text-5xl">About Us</h1>
				<p class="mx-auto md:w-[600px]">
					BTC Map is powered by NFTpreneur bitcoiners and bitcoin-friendly merchants around the world.
				</p>
			</div>

			<section class="w-full justify-center space-y-10 lg:flex lg:space-x-10 lg:space-y-0">
				<div class="lg:w-[475px]">
					<h2 class="mb-5 text-3xl font-semibold">Merchants</h2>

					<div class="space-y-5">
						<p>
							Merchants are at the heart of BTC Map. These businesses are leading the way in the adoption of Bitcoin and
							are positioning themselves for continued success. Any merchant who accepts Bitcoin can be listed on BTC Map.
						</p>
						<p>
							<strong>Accept bitcoin?</strong>
							<a
								href="/add-location"
								class="font-semibold text-link transition-colors hover:text-hover"
								>Get listed on BTC Map</a
							>!
						</p>
					</div>
				</div>

				<div class="flex grid-cols-3 flex-wrap justify-center gap-5 lg:grid">
					{#if merchants.length}
						{#each merchants as merchant}
							<AboutMerchant
								id={merchant.id}
								icon={merchant.tags['icon:android']}
								tooltip={merchant['osm_json'].tags?.name}
							/>
						{/each}
					{:else}
						<!-- eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -->
						{#each Array(6) as skeleton}
							<span class="h-24 w-24 animate-pulse rounded-full bg-link/50" />
						{/each}
					{/if}
				</div>
			</section>

			<section class="w-full space-y-10 rounded-xl bg-[#164E63] p-5 text-center text-white md:p-10">
				<h2 class="text-3xl font-semibold"> NFTpreneurs</h2>

				<p class="mx-auto lg:w-[650px]">
					NFTpreneurs are a Web5 Tribe power this project. They are volunteers who selflessly
					take the time to update business locations with new information. Without them, BTC Map
					would not be sustainable!
				</p>

				<div class="space-y-5">
					<p class="font-semibold uppercase">Our NFTpreneurs</p>

					<div class="flex flex-wrap justify-center gap-5">
						{#if supertaggers.length}
							{#each supertaggers.map((t) => ({ ...t, total: undefined })) as tagger}
								<AboutTagger {tagger} />
							{/each}
						{:else}
							<!-- eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -->
							{#each Array(6) as skeleton}
								<span class="h-24 w-24 animate-pulse rounded-full bg-link/50" />
							{/each}
						{/if}
					</div>

					<a
						href="/leaderboard"
						class="inline-block font-semibold underline underline-offset-4 hover:no-underline"
						>View Leaderboard</a
					>
				</div>
			</section>

			<section class="w-full justify-center space-y-10 lg:flex lg:space-x-10 lg:space-y-0">
				<div class="lg:w-[475px]">
					<h2 class="mb-5 text-3xl font-semibold">Tribe</h2>

					<div class="space-y-5">
						<p>Bitcoin tribes help drive global adoption by onboarding new users locally!</p>
						<p>
							<strong>Don’t see your tribe?</strong>
							<a
								href="/communities/add"
								class="font-semibold text-link transition-colors hover:text-hover"
								>Add it to BTC Map</a
							>.
						</p>
					</div>
				</div>

				<div>
					<div class="flex grid-cols-3 flex-wrap justify-center gap-5 lg:grid">
						{#if communities.length}
							{#each communities as community}
								<AboutCommunity {community} />
							{/each}
						{:else}
							<!-- eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -->
							{#each Array(6) as skeleton}
								<span class="h-24 w-24 animate-pulse rounded-full bg-link/50" />
							{/each}
						{/if}
					</div>

					<div class="mt-5 flex justify-center">
						<a
							href="/communities"
							class="font-semibold text-link transition-colors hover:text-hover"
							>See all tribes</a
						>
					</div>
				</div>
			</section>

			<section
				class="w-full space-y-10 rounded-xl bg-[#F1F7FC] p-5 text-center dark:bg-white/[0.15] md:p-10"
			>
				<h2 class="text-3xl font-semibold">Integrations</h2>

				<p class="font-semibold uppercase">
					Community integrations <span class="block text-sm font-normal normal-case"
						>Projects using BTC Map</span
					>
				</p>

				<div class="flex flex-wrap justify-center gap-10">
					{#each communityIntegrations as integration}
						<AboutIntegration {integration} />
					{/each}
					<AboutPlus />
				</div>

				<p class="font-semibold uppercase">
					Project integrations <span class="block text-sm font-normal normal-case"
						>BTC Map uses these projects</span
					>
				</p>

				<div class="flex flex-wrap justify-center gap-10">
					{#each projectIntegrations as integration}
						<AboutIntegration {integration} />
					{/each}
					<AboutPlus />
				</div>

				<p>
					If you are interested in integrating with us please <a
						href="mailto:info@luvnft.com"
						class="font-semibold text-link transition-colors hover:text-hover">reach out</a
					>!
				</p>
			</section>

			<section class="w-full justify-center space-y-10 lg:flex lg:space-x-10 lg:space-y-0">
				<div class="lg:w-[475px]">
					<h2 class="mb-5 text-3xl font-semibold">Contributors</h2>

					<p>
						Anybody can contribute to BTC Map in many different ways. If you would like to get
						involved please don't hesitate and come join the fun!
					</p>
				</div>

				<div class="flex grid-cols-3 flex-wrap justify-center gap-5 lg:grid">
					{#each contributors as contributor}
						<AboutContributor {contributor} />
					{/each}
				</div>
			</section>

			<section
				class="w-full justify-center space-y-10 rounded-xl bg-[#EBEFF2] p-5 dark:bg-white/[0.15] md:p-10 lg:flex lg:space-x-10 lg:space-y-0"
			>
				<div class="lg:w-[475px]">
					<h2 class="mb-10 text-3xl font-semibold">Services</h2>

					<div class="space-y-10">
						<p>
							🫶 <strong>LUV NFT</strong> allows Web5 NFTprenuers to own 100% of the D-Commerce economy
							that includes every 3M x 3M block of the BTC Map in the form of What3Words Bitcoin NFT.
						</p>
						<p>
							🔑 <strong>$RNT</strong> allows landlords and hosts to onboard to blockchain and accept Bitcoin
							in the form of $RNT in the NFTV Discord with a BTC Map marker pair of keys that has a link to 
							branded NFTV Discord channel or LUV Metaverse channel.
						</p>
						<p>
							🏪 The Web5 Tribe NFTprenuer brokers complete a Quest L$VE a day to earn Love Money. This includes
							promoting local businesses on the BTC Map that need some foot traffic in their stores. Biz tiers
							can use some of their 100K $LUV Money budget to create a Quest L$VE to generate a CTA.
						</p>
						<p>
							😎 <strong>AR</strong> NFTV Discord subscribers can order branded AR services in the products tab
							of the servers shop to order a custom TikTok, Instagram or Facebook AR effect ad or discount coupon
							that customers, fans or supporters can post as a reel to promote a business near by.
						</p>
					</div>
				</div>

				<div class="flex grid-cols-2 flex-wrap items-center justify-center gap-10 lg:grid">
					{#each coreTeam as member}
						<AboutCore {member} />
					{/each}
				</div>
			</section>
		</main>
		<Footer />
	</div>
</div>
