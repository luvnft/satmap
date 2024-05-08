import type { Area, Boost, Element, Event, Issue, OSMTags, Report, Theme, User } from '$lib/types';
import { readable, writable, type Writable } from 'svelte/store';

export const socials = readable({
	twitter: 'https://x.com/luvnft',
	nostr: 'npub1s0k9j8vn4nnjwqcze568ayx83k32jardqfh7hrk7c3mlpqkwgj0qucp3c9',
	discord: 'https://nftv.luvnft.com',
});

export const apps = readable([
	{
		link: '/map',
		type: 'MAP',
		icon: 'web',
		desc: 'BTC Map'
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
