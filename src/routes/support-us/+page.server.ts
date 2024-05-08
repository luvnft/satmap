import { LNBITS_API_KEY, LNBITS_URL, LNBITS_WALLET_ID } from '$env/static/private';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { PageServerLoad } from './$types';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export const load: PageServerLoad = async () => {
	const headers = {
		'X-API-Key': `${LNBITS_API_KEY}`,
		'Content-type': 'application/json'
	};

	try {
		const address = await axios.get(
			`https://${LNBITS_URL}/watchonly/api/v1/address/${LNBITS_WALLET_ID}`,
			{ headers }
		);

		return { address: address.data.address };
	} catch (error) {
		console.log(error);
		return { address: 'bc1phskpnkg7s2lgc5lhwu7zklz9dyfn2ncqa566udqq7wq288z2fq2qea7p2p' };
	}
};
