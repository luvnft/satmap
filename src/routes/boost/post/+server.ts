import { BTCMAP_KEY } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { RequestHandler } from './$types';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const used: string[] = [];

export const POST: RequestHandler = async ({ request }) => {
	const headers = {
		Authorization: `Bearer ${BTCMAP_KEY}`
	};

	const { element, time, hash } = await request.json();

	// check that time is valid
	const validTimes = [1, 3, 12];
	if (!validTimes.includes(time)) {
		error(418);
	}

	// verify that the invoice has been paid
	if (used.includes(hash)) {
		error(418);
	}

	const boost = await axios
		.get(`https://btcmap.luvnft.com/boost/invoice/status?hash=${hash}`)
		.then(function (response) {
			if (response.data.paid === true) {
				used.push(hash);

				return axios
					.get(`https://api.btcmap.org/v2/elements/${element}`)
					.then(function (response) {
						let expires;
						const currentBoost =
							response.data.tags && response.data.tags['boost:expires']
								? new Date(response.data.tags['boost:expires'])
								: null;
						const dateNow = new Date();

						if (currentBoost && currentBoost > dateNow) {
							expires = new Date(currentBoost.setMonth(currentBoost.getMonth() + time));
						} else {
							expires = new Date(dateNow.setMonth(dateNow.getMonth() + time));
						}

						return axios
							.patch(
								`https://api.btcmap.org/v2/elements/${element}`,
								{ tags: { 'boost:expires': `${expires.toISOString()}` } },
								{ headers }
							)
							.then(function (response) {
								return response.status;
							})
							.catch(function (err) {
								console.log(err);
								error(400, 'Could not finalize boost, please contact BTC Map.');
							});
					})
					.catch(function (err) {
						console.log(err);
						error(400, 'Could not finalize boost, please contact BTC Map.');
					});
			} else {
				return;
			}
		})
		.catch(function (err) {
			console.log(err);
			error(400, 'Could not finalize boost, please contact BTC Map.');
		});

	return json({ status: boost });
};
