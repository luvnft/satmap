import { LNBITS_API_KEY, LNBITS_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { RequestHandler } from './$types';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// generate and return invoice
export const GET: RequestHandler = async ({ url }) => {
	const amount = url.searchParams.get('amount');
	const name = url.searchParams.get('name');
	const time = url.searchParams.get('time');

	const headers = {
		'X-API-Key': `${LNBITS_API_KEY}`,
		'Content-type': 'application/json'
	};

	const invoice = await axios
		.post(
			`https://${LNBITS_URL}/api/v1/payments`,
			{
				out: false,
				amount: `${amount}`,
				memo: `W3B Map boost ${name} for ${time} month${Number(time) > 1 ? 's' : ''}`,
				unit: 'sat'
			},
			{ headers }
		)
		.then(function (response) {
			return response.data;
		})
		.catch(function (err) {
			console.log(err);
			error(400, 'Could not generate invoice, please try again or contact W3B Map.');
		});

	return new Response(JSON.stringify(invoice));
};
