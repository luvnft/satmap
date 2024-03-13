<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { syncStatus } from '$lib/store';
	import { areasSync } from '$lib/sync/areas';
	import { elementsSync } from '$lib/sync/elements';
	import { eventsSync } from '$lib/sync/events';
	import { reportsSync } from '$lib/sync/reports';
	import { usersSync } from '$lib/sync/users';
	import axios from 'axios';
	import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import 'leaflet/dist/leaflet.css';
	import localforage from 'localforage';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import 'tippy.js/dist/tippy.css';
  
	// Set default axios timeout
	axios.defaults.timeout = 10000;
  
	// Configuration for SvelteToast
	const options = {
	  reversed: true,
	  intro: { y: 192 },
	  pausable: true
	};
  
	// Interval for data synchronization
	let dataSyncInterval: ReturnType<typeof setInterval>;
  
	onMount(async () => {
	  // Configure localforage
	  localforage.config({
		name: 'BTC Map',
		description: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'
	  });
  
	  // Function for data synchronization
	  const dataSync = async () => {
		// Set sync status to true
		syncStatus.set(true);
  
		// Execute sync functions concurrently and log results
		await Promise.allSettled([
		  elementsSync(),
		  eventsSync(),
		  usersSync(),
		  areasSync(),
		  reportsSync()
		]).then(results => results.forEach(result => console.log(result.status)));
  
		// Set sync status to false
		syncStatus.set(false);
	  };
  
	  // Perform initial data synchronization
	  dataSync();
  
	  // Set interval for periodic data synchronization
	  dataSyncInterval = setInterval(dataSync, 600000);
	});
  
	onDestroy(() => {
	  // Clear interval on component destruction
	  clearInterval(dataSyncInterval);
	});
  </script>
  
  <svelte:head>
	{#if !$page.url.pathname.startsWith('/tagger') && !$page.url.pathname.startsWith('/community') && !$page.url.pathname.startsWith('/merchant')}
	  <meta name="lightning" content="lnurlp:lnurl1dp68gurn8ghjlc565rhm3reqwfjkw6t0dcsxumm5ypeh2ursdae8getyyr3f4g80hz8j7tnhv4kxctttdehhwm30d3h82unvwqhscn5dpp" />
	  <meta property="alby:image" content="/images/logo.svg" />
	  <meta property="alby:name" content="BTC Map" />
	{/if}
  </svelte:head>
  
  <slot />
  
  <!-- SvelteToast component with options -->
  <SvelteToast {options} />
  
  <style>
	/* Custom styling for SvelteToast */
	:root {
	  --toastContainerTop: auto;
	  --toastContainerRight: auto;
	  --toastContainerBottom: 8rem;
	  --toastContainerLeft: calc(50vw - 8rem);
	}
  </style>