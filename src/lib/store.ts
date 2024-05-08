import type { Area, Boost, Element, Event, Issue, OSMTags, Report, Theme, User } from '$lib/types';
import { readable, writable, type Writable } from 'svelte/store';

export const socials = readable({
	twitter: 'https://twitter.com/btcmap',
	nostr: 'https://nostr.com/npub1864jglrrhv6alguwql9pqtmd5296nww5dpcewapmmcazk8vq4mks0tt2tq',
	discord: 'https://discord.gg/wPqva83uzq',
	github: 'https://github.com/teambtcmap',
	amboss: 'https://amboss.space/community/edf8d227-9bc7-4cb2-af2a-66c1b455109a'
});

export const apps = readable([
	{
		link: '/map',
		type: 'MAP',
		icon: 'web',
		desc: 'BTC Map'
	},
	{
		link: 'https://nftv.luvnft.com',
		type: 'NFTV DISCORD',
		icon: 'discord',
		desc: 'NFTV Discord'
	},
	{
		link: 'https://tiktok.com/@what3bars',
		type: '@WHAT3BARS',
		icon: 'tiktok',
		desc: 'What 3 Bars Tiktok'
	},
	{
		link: 'https://tiktok.com/@luvnft',
		type: '@LUVNFT',
		icon: 'tiktok',
		desc: 'LUV NFT Tiktok'
	}
]);

export const elements: Writable<Element[]> = writable([]);
export const elementError = writable('');
export const elementsSyncCount = writable(0);

export const users: Writable<User[]> = writable([]);
export const userError = writable('');

export const events: Writable<Event[]> = writable([]);
export const eventError = writable('');

export const areas: Writable<Area[]> = writable([]);
export const areaError = writable('');

export const reports: Writable<Report[]> = writable([]);
export const reportError = writable('');

export const syncStatus: Writable<boolean> = writable();

export const mapUpdates = writable(false);

export const excludeLeader = readable([
	17085479, 2104834, 9451067, 616463, 1722488, 81735, 18545877, 232801, 19880430, 1778799
]);

export const boost: Writable<Boost> = writable();
export const exchangeRate: Writable<number | undefined> = writable();
export const resetBoost = writable(0);
export const boostHash: Writable<string> = writable();

export const showTags: Writable<OSMTags | undefined> = writable();
export const taggingIssues: Writable<Issue[] | undefined> = writable();
export const showMore = writable(false);

export const theme: Writable<Theme> = writable();
