<script lang="ts">
	export let id: string;
	export let name: string;
</script>

<div
	class="rounded-3xl border border-statBorder shadow transition-shadow hover:shadow-2xl dark:bg-white/10"
>
	<div class="my-4 space-y-2 p-4">
		<a href="/country/{id}" class="space-y-2 text-link transition-colors hover:text-hover">
			<img
				src={`https://static.btcmap.luvnft.com/images/countries/${id}.svg`}
				alt={name}
				class="mx-auto h-20 w-20 rounded-full object-cover"
				on:error={function () {
					this.src = '/images/bitcoin.svg';
				}}
			/>

			<span class="block text-center text-lg font-semibold">{name}</span>
		</a>
	</div>
</div>
