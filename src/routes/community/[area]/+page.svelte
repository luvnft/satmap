<script lang="ts">
	export let data: AreaPageProps;

	import { AreaPage, Footer, Header } from '$lib/comp';
	import type { AreaPageProps } from '$lib/types';

<<<<<<< HEAD
	// alert for user errors
	$: $userError && errToast($userError);
	// alert for event errors
	$: $eventError && errToast($eventError);
	// alert for element errors
	$: $elementError && errToast($elementError);
	// alert for area errors
	$: $areaError && errToast($areaError);
	// alert for report errors
	$: $reportError && errToast($reportError);

	let initialRenderComplete = false;
	let dataInitialized = false;

	const initializeData = () => {
		if (dataInitialized) return;

		const communityFound = $areas.find(
			(area) =>
				area.id == data.id &&
				area.tags.type === 'community' &&
				area.tags.geo_json &&
				area.tags.name &&
				area.tags['icon:square'] &&
				area.tags.continent &&
				Object.keys(area.tags).find((key) => key.includes('contact'))
		);

		if (!communityFound) {
			console.log('Could not find community, please try again or contact BTC Map.');
			goto('/404');
			return;
		}

		const communityReports = $reports
			.filter((report) => report.area_id === data.id)
			.sort((a, b) => Date.parse(b['created_at']) - Date.parse(a['created_at']));

		if (!communityReports.length) {
			console.log(
				'Could not find any community reports, please try again tomorrow or contact BTC Map.'
			);
			goto('/404');
			return;
		}

		const community = communityFound.tags;

		avatar = `https://btcmap.luvnft.com/.netlify/images?url=${community['icon:square']}&fit=cover&w=256&h=256`;
		org = community.organization;
		sponsor = community.sponsor;
		continent = community.continent;
		website = community['contact:website'];
		email = community['contact:email'];
		nostr = community['contact:nostr'];
		twitter = community['contact:twitter'];
		secondTwitter = community['contact:second_twitter'];
		meetup = community['contact:meetup'];
		eventbrite = community['contact:eventbrite'];
		telegram = community['contact:telegram'];
		discord = community['contact:discord'];
		youtube = community['contact:youtube'];
		github = community['contact:github'];
		reddit = community['contact:reddit'];
		instagram = community['contact:instagram'];
		whatsapp = community['contact:whatsapp'];
		facebook = community['contact:facebook'];
		linkedin = community['contact:linkedin'];
		rss = community['contact:rss'];
		signal = community['contact:signal'];

		if (community['tips:lightning_address']) {
			lightning = {
				destination: community['tips:lightning_address'],
				type: TipType.Address
			};
		} else if (community['tips:url']) {
			lightning = { destination: community['tips:url'], type: TipType.Url };
		}

		const rewoundPoly = rewind(community.geo_json, true);

		// filter elements within community
		const filteredElements = $elements.filter((element) => {
			let lat = latCalc(element['osm_json']);
			let long = longCalc(element['osm_json']);

			if (geoContains(rewoundPoly, [long, lat])) {
				return true;
			} else {
				return false;
			}
		});

		const communityEvents = $events.filter((event) =>
			filteredElements.find((element) => element.id === event.element_id)
		);

		communityEvents.sort((a, b) => Date.parse(b['created_at']) - Date.parse(a['created_at']));

		const findUser = (tagger: Event) => {
			let foundUser = $users.find((user) => user.id == tagger['user_id']);

			if (foundUser) {
				if (!taggers.find((tagger) => tagger.id === foundUser?.id)) {
					taggers.push(foundUser);
				}

				return foundUser;
			} else {
				return undefined;
			}
		};

		communityEvents.forEach((event) => {
			let elementMatch = filteredElements.find((element) => element.id === event['element_id']);

			let location = elementMatch?.['osm_json'].tags?.name || undefined;

			let tagger = findUser(event);

			eventElements.push({
				...event,
				location: location || formatElementID(event['element_id']),
				merchantId: event['element_id'],
				tagger
			});
		});

		eventElements = eventElements;
		taggers = taggers;

		const populateMap = () => {
			// add map
			map = leaflet.map(mapElement, { attributionControl: false });

			// add tiles and basemaps
			baseMaps = layers(leaflet, map);

			// change broken marker image path in prod
			leaflet.Icon.Default.prototype.options.imagePath = '/icons/';

			// add OSM attribution
			attribution(leaflet, map);

			// create marker cluster groups
			/* eslint-disable no-undef */
			// @ts-expect-error
			let markers = L.markerClusterGroup();
			/* eslint-enable no-undef */
			let upToDateLayer = leaflet.featureGroup.subGroup(markers);
			let outdatedLayer = leaflet.featureGroup.subGroup(markers);
			let legacyLayer = leaflet.featureGroup.subGroup(markers);

			let overlayMaps = {
				'Up-To-Date': upToDateLayer,
				Outdated: outdatedLayer,
				Legacy: legacyLayer
			};

			leaflet.control.layers(baseMaps, overlayMaps).addTo(map);

			// add locate button to map
			geolocate(leaflet, map);

			// change default icons
			changeDefaultIcons(true, leaflet, mapElement, DomEvent);

			// get date from 1 year ago to add verified check if survey is current
			let verifiedDate = calcVerifiedDate();

			// add community area poly to map
			if (community.geo_json) {
				leaflet.geoJSON(community.geo_json, { style: { fill: false } }).addTo(map);
			}

			// add elements to map
			filteredElements.forEach((element) => {
				let icon = element.tags['icon:android'];
				let payment = element.tags['payment:uri']
					? { type: 'uri', url: element.tags['payment:uri'] }
					: element.tags['payment:pouch']
						? { type: 'pouch', username: element.tags['payment:pouch'] }
						: element.tags['payment:coinos']
							? { type: 'coinos', username: element.tags['payment:coinos'] }
							: undefined;
				let boosted =
					element.tags['boost:expires'] && Date.parse(element.tags['boost:expires']) > Date.now()
						? element.tags['boost:expires']
						: undefined;

				const elementOSM = element['osm_json'];

				const lat = latCalc(elementOSM);
				const long = longCalc(elementOSM);

				let divIcon = generateIcon(leaflet, icon, boosted ? true : false);

				let marker = generateMarker(
					lat,
					long,
					divIcon,
					elementOSM,
					payment,
					leaflet,
					verifiedDate,
					true,
					boosted
				);

				let verified = verifiedArr(elementOSM);

				if (verified.length && Date.parse(verified[0]) > verifiedDate) {
					upToDateLayer.addLayer(marker);

					if (upToDate === undefined) {
						upToDate = 1;
					} else {
						upToDate++;
					}
				} else {
					outdatedLayer.addLayer(marker);

					if (outdated === undefined) {
						outdated = 1;
					} else {
						outdated++;
					}
				}

				if (elementOSM.tags && elementOSM.tags['payment:bitcoin']) {
					legacyLayer.addLayer(marker);

					if (legacy === undefined) {
						legacy = 1;
					} else {
						legacy++;
					}
				}

				if (total === undefined) {
					total = 1;
				} else {
					total++;
				}
			});

			map.addLayer(markers);
			map.addLayer(upToDateLayer);
			map.addLayer(outdatedLayer);
			map.addLayer(legacyLayer);

			map.fitBounds(leaflet.geoJSON(community.geo_json).getBounds());

			mapLoaded = true;
		};

		populateMap();

		if (!upToDate) {
			upToDate = 0;
		}

		if (!outdated) {
			outdated = 0;
		}

		if (!legacy) {
			legacy = 0;
		}

		if (!total) {
			total = 0;
		}

		upToDatePercent = upToDate ? (upToDate / (total / 100)).toFixed(0) : '0';

		outdatedPercent = outdated ? (outdated / (total / 100)).toFixed(0) : '0';

		legacyPercent = legacy ? (legacy / (total / 100)).toFixed(0) : '0';

		const setGrade = () => {
			switch (true) {
				case Number(upToDatePercent) >= 95:
					grade = 5;
					break;
				case Number(upToDatePercent) >= 75:
					grade = 4;
					break;
				case Number(upToDatePercent) >= 50:
					grade = 3;
					break;
				case Number(upToDatePercent) >= 25:
					grade = 2;
					break;
				case Number(upToDatePercent) >= 0:
					grade = 1;
					break;
			}
		};

		setGrade();

		const populateCharts = () => {
			const chartsReports = [...communityReports].sort(
				(a, b) => Date.parse(a['created_at']) - Date.parse(b['created_at'])
			);

			const today = new Date();
			const latestReport = chartsReports[chartsReports.length - 1];
			const latestReportDate = new Date(latestReport.created_at);
			const reportIsCurrent =
				today.getDate() === latestReportDate.getDate() &&
				today.getMonth() === latestReportDate.getMonth() &&
				today.getFullYear() === latestReportDate.getFullYear();

			if (!reportIsCurrent) {
				chartsReports.push({
					...latestReport,
					id: latestReport.id + 1,
					date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
					created_at: today.toISOString(),
					updated_at: today.toISOString()
				});
			}

			const theme = detectTheme();

			updatedChart = new Chart(updatedChartCanvas, {
				type: 'pie',
				data: {
					labels: ['Up-To-Date', 'Outdated'],
					datasets: [
						{
							label: 'Locations',
							data: [upToDate, outdated],
							backgroundColor: ['rgb(16, 183, 145)', 'rgb(235, 87, 87)'],
							hoverOffset: 4
						}
					]
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								font: {
									weight: 600
								}
							}
						}
					}
				}
			});

			let percents = chartsReports.filter((report) => report.tags.up_to_date_percent);

			upToDateChart = new Chart(upToDateChartCanvas, {
				type: 'line',
				data: {
					labels: percents.map(({ date }) => date),
					datasets: [
						{
							label: 'Up-To-Date Percent',
							data: percents.map(({ tags: { up_to_date_percent } }) => up_to_date_percent),
							fill: {
								target: 'origin',
								above: 'rgba(11, 144, 114, 0.2)'
							},
							borderColor: 'rgb(11, 144, 114)',
							tension: 0.1,
							pointStyle: false
						}
					]
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								font: {
									weight: 600
								}
							}
						}
					},
					scales: {
						x: {
							ticks: {
								maxTicksLimit: 5,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						},
						y: {
							min: 0,
							max: 100,
							ticks: {
								precision: 0,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						}
					},
					interaction: {
						intersect: false
					}
				}
			});

			totalChart = new Chart(totalChartCanvas, {
				type: 'line',
				data: {
					labels: chartsReports.map(({ date }) => date),
					datasets: [
						{
							label: 'Total Locations',
							data: chartsReports.map(({ tags: { total_elements } }) => total_elements),
							fill: {
								target: 'origin',
								above: 'rgba(0, 153, 175, 0.2)'
							},
							borderColor: 'rgb(0, 153, 175)',
							tension: 0.1,
							pointStyle: false
						}
					]
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								font: {
									weight: 600
								}
							}
						}
					},
					scales: {
						x: {
							ticks: {
								maxTicksLimit: 5,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						},
						y: {
							min: 0,
							grace: '5%',
							ticks: {
								precision: 0,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						}
					},
					interaction: {
						intersect: false
					}
				}
			});

			legacyChart = new Chart(legacyChartCanvas, {
				type: 'line',
				data: {
					labels: chartsReports.map(({ date }) => date),
					datasets: [
						{
							label: 'Legacy Locations',
							data: chartsReports.map(({ tags: { legacy_elements } }) => legacy_elements),
							fill: {
								target: 'origin',
								above: 'rgba(235, 87, 87, 0.2)'
							},
							borderColor: 'rgb(235, 87, 87)',
							tension: 0.1,
							pointStyle: false
						}
					]
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								font: {
									weight: 600
								}
							}
						}
					},
					scales: {
						x: {
							ticks: {
								maxTicksLimit: 5,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						},
						y: {
							min: 0,
							grace: '5%',
							ticks: {
								precision: 0,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						}
					},
					interaction: {
						intersect: false
					}
				}
			});

			paymentMethodChart = new Chart(paymentMethodChartCanvas, {
				type: 'line',
				data: {
					labels: chartsReports.map(({ date }) => date),
					datasets: [
						{
							label: 'On-chain',
							data: chartsReports.map(
								({ tags: { total_elements_onchain } }) => total_elements_onchain
							),
							fill: false,
							borderColor: 'rgb(247, 147, 26)',
							tension: 0.1,
							pointStyle: false
						},
						{
							label: 'Lightning',
							data: chartsReports.map(
								({ tags: { total_elements_lightning } }) => total_elements_lightning
							),
							fill: false,
							borderColor: 'rgb(249, 193, 50)',
							tension: 0.1,
							pointStyle: false
						},
						{
							label: 'Contactless',
							data: chartsReports.map(
								({ tags: { total_elements_lightning_contactless } }) =>
									total_elements_lightning_contactless
							),
							fill: false,
							borderColor: 'rgb(102, 16, 242)',
							tension: 0.1,
							pointStyle: false
						}
					]
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								font: {
									weight: 600
								}
							}
						}
					},
					scales: {
						x: {
							ticks: {
								maxTicksLimit: 5,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						},
						y: {
							min: 0,
							grace: '5%',
							ticks: {
								precision: 0,
								font: {
									weight: 600
								}
							},
							grid: {
								color: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
							}
						}
					},
					interaction: {
						intersect: false
					}
				}
			});

			chartsLoading = false;
		};

		populateCharts();

		dataInitialized = true;
	};

	$: $users &&
		$users.length &&
		$events &&
		$events.length &&
		$elements &&
		$elements.length &&
		$areas &&
		$areas.length &&
		$reports &&
		$reports.length &&
		initialRenderComplete &&
		!dataInitialized &&
		initializeData();

	const ticketTypes = ['Add', 'Verify'];
	let showType = 'Add';

	const tickets = data.tickets;
	const ticketError = tickets === 'error' ? true : false;

	$: ticketError && errToast('Could not load open tickets, please try again or contact BTC Map.');

	const add =
		tickets && tickets.length && !ticketError
			? tickets.filter((issue: any) =>
					issue.labels.find((label: any) => label.name === 'location-submission')
				)
			: [];
	const verify =
		tickets && tickets.length && !ticketError
			? tickets.filter((issue: any) =>
					issue.labels.find((label: any) => label.name === 'verify-submission')
				)
			: [];

	const totalTickets = add.length + verify.length;

	let avatar: string;
	const name = data.name;
	let org: string | undefined;
	let sponsor: boolean | undefined;
	let continent: Continents;
	let website: string | undefined;
	let email: string | undefined;
	let nostr: string | undefined;
	let twitter: string | undefined;
	let secondTwitter: string | undefined;
	let meetup: string | undefined;
	let eventbrite: string | undefined;
	let telegram: string | undefined;
	let discord: string | undefined;
	let youtube: string | undefined;
	let github: string | undefined;
	let reddit: string | undefined;
	let instagram: string | undefined;
	let whatsapp: string | undefined;
	let facebook: string | undefined;
	let linkedin: string | undefined;
	let rss: string | undefined;
	let signal: string | undefined;
	let lightning: { destination: string; type: TipType } | undefined;

	let total: number | undefined;
	let upToDate: number | undefined;
	let outdated: number | undefined;
	let legacy: number | undefined;
	let grade: Grade;

	let gradeTooltip: HTMLButtonElement;

	$: gradeTooltip &&
		tippy([gradeTooltip], {
			content: `<table>
	<thead>
		<tr>
			<th class='mr-1 inline-block'>Up-To-Date</th>
			<th>Grade</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>95-100%</td>
			<td>5 Star</td>
		</tr>
		<tr>
			<td>75-95%</td>
			<td>4 Star</td>
		</tr>
		<tr>
			<td>50-75%</td>
			<td>3 Star</td>
		</tr>
		<tr>
			<td>25-50%</td>
			<td>2 Star</td>
		</tr>
		<tr>
			<td>0-25%</td>
			<td>1 Star</td>
		</tr>
	</tbody>
</table>`,
			allowHTML: true
		});

	let upToDatePercent: string | undefined;
	let outdatedPercent: string | undefined;
	let legacyPercent: string | undefined;

	let updatedChartCanvas: HTMLCanvasElement;
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	let updatedChart;

	let hideArrow = false;
	let activityDiv: HTMLDivElement;
	let eventElements: ActivityEvent[] = [];

	let eventCount = 50;
	$: eventElementsPaginated = eventElements.slice(0, eventCount);

	let taggers: User[] = [];
	let taggerCount = 50;
	$: taggersPaginated = taggers.slice(0, taggerCount);
	let taggerDiv: HTMLDivElement;

	let mapElement: HTMLDivElement;
	let map: Map;
	let mapLoaded = false;

	let baseMaps: BaseMaps;

	let chartsLoading = true;
	let upToDateChartCanvas: HTMLCanvasElement;
	let upToDateChart: Chart<'line', number[], string>;
	let totalChartCanvas: HTMLCanvasElement;
	let totalChart: Chart<'line', number[], string>;
	let legacyChartCanvas: HTMLCanvasElement;
	let legacyChart: Chart<'line', number[], string>;
	let paymentMethodChartCanvas: HTMLCanvasElement;
	let paymentMethodChart: Chart<'line', number[], string>;

	$: $theme !== undefined &&
		!chartsLoading &&
		updateChartThemes([upToDateChart, totalChart, legacyChart, paymentMethodChart]);

	let leaflet: Leaflet;
	let DomEvent: DomEventType;

	onMount(async () => {
		if (browser) {
			// setup charts
			updatedChartCanvas.getContext('2d');
			upToDateChartCanvas.getContext('2d');
			totalChartCanvas.getContext('2d');
			legacyChartCanvas.getContext('2d');
			paymentMethodChartCanvas.getContext('2d');

			//import packages
			leaflet = await import('leaflet');
			// @ts-expect-error
			DomEvent = await import('leaflet/src/dom/DomEvent');
			/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
			const leafletMarkerCluster = await import('leaflet.markercluster');
			const leafletFeaturegroupSubgroup = await import('leaflet.featuregroup.subgroup');
			const leafletLocateControl = await import('leaflet.locatecontrol');
			/* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars */

			initialRenderComplete = true;
		}
	});

	$: $theme !== undefined && mapLoaded && toggleMapButtons();

	const closePopup = () => {
		map.closePopup();
	};

	$: $theme !== undefined && mapLoaded && closePopup();

	const toggleTheme = () => {
		if ($theme === 'dark') {
			baseMaps['OSM Bright'].remove();
			baseMaps['Alidade Smooth Dark'].addTo(map);
		} else {
			baseMaps['Alidade Smooth Dark'].remove();
			baseMaps['OSM Bright'].addTo(map);
		}
	};

	$: $theme !== undefined && mapLoaded && toggleTheme();

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
=======
	const { name } = data;
>>>>>>> 2a59d8f3ec2d874ce0b1ca1188e4636b5fb94ea6
</script>

<svelte:head>
	<title>{name ? name + ' - ' : ''}BTC Map Community</title>
	<meta property="og:image" content="https://btcmap.luvnft.com/images/og/communities.png" />
	<meta property="twitter:title" content="{name ? name + ' - ' : ''}BTC Map Community" />
<<<<<<< HEAD
	<meta property="twitter:image" content="https://btcmap.luvnft.com/images/og/communities.png" />

	{#if lightning && lightning.type === 'address'}
		<meta name="lightning" content="lnurlp:{lightning.destination}" />
		<meta property="alby:image" content={avatar} />
		<meta property="alby:name" content={name} />
	{:else}
		<meta
			name="lightning"
			content="lnurlp:lnurl1dp68gurn8ghjlc565rhm3reqwfjkw6t0dcsxumm5ypeh2ursdae8getyyr3f4g80hz8j7tnhv4kxctttdehhwm30d3h82unvwqhscn5dpp"
		/>
		<meta property="alby:image" content="/images/logo.svg" />
		<meta property="alby:name" content="BTC Map" />
	{/if}
=======
	<meta property="twitter:image" content="https://btcmap.org/images/og/communities.png" />
>>>>>>> 2a59d8f3ec2d874ce0b1ca1188e4636b5fb94ea6
</svelte:head>

<div class="bg-teal dark:bg-dark">
	<Header />
	<div class="mx-auto w-10/12 xl:w-[1200px]">
		<AreaPage type="community" {data} />

		<Footer />
	</div>
</div>
