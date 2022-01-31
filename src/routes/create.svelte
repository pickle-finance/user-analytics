<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { getClient } from '$lib/ApolloClient';
	import { loadLinks, readLinks } from '$lib/Link/model';

	export const load: Load = async ({ session }) => {
		let { error } = await loadLinks(getClient(session.apollo));

		if (error) {
			return {
				status: 400,
				error: error.message
			};
		}

		return {
			status: 200,
			props: {}
		};
	};
</script>

<script lang="ts">
	import axios from 'axios';
	import { session } from '$app/stores';
	import { config } from '$lib/config';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableRow,
		Form,
		Input,
		validator,
		Button,
		Heading
	} from 'svelboost/src';
	import type { types } from 'svelboost/src';

	$: request = readLinks($session.apollo);

	let initialValues = {
		url: '',
		campaign: '',
		source: '',
		medium: ''
	};

	let validate = (values: any) => {
		let errors: any = {};

		errors = validator.required(errors, 'url', values.url);
		errors = validator.checkWebsite(errors, 'url', values.url);

		return errors;
	};

	let handleSubmit = async ({ url, ...rest }: any, actions: types.BagState) => {
		let { data } = await axios
			.post(
				'/create',
				{ url: url, shortLinkProps: rest }, // TODO: use shortLinkProps to add (medium/source/campaign)
				{
					withCredentials: true
				}
			)
			.then((res) => res.data);

		actions.resetForm();
		request.refetch();
	};
</script>

<template lang="pug">
	main
		.form-block(style="margin-bottom: 40px")
			Heading(class="mb8" level="{2}") Create a new link
			Form(initialValues="{initialValues}" validate="{validate}" onSubmit="{handleSubmit}" let:props)
				form(on:submit|preventDefault="{props.handleSubmit}")
					Input(
						id="url_input"
						name="url"
						label="Landing Url"
					)
					Input(
						id="campaign_input"
						name="campaign"
						label="Campaign (Optional)"
					)
					Input(
						id="source_input"
						name="source"
						label="Source (Optional)"
					)
					Input(
						id="medium_input"
						name="medium"
						label="Medium (Optional)"
					)
					Button(
						label="Create"
						isSubmitBtn
						disabled="{props.isSubmitting}"
					)
		.links-list
			+if('$request.data && $request.data.links')
				Table(minWidth="1118" cells="{['40%', '58%']}")
					TableHead
						TableRow
							TableCell(type="th" index="0") Landing URL
							TableCell(type="th" index="1") Short link
					TableBody
						+if('$request.loading')
							TableRow
								TableCell(index="2" colspan="2") Loading...
							+else()
								+if('$request.data.links.length > 0')
									+each('$request.data.links as link')
										TableRow(class="custom-row")
											TableCell(index="0")
												a(href="{link.url}" target="_blank" rel="noopener") {link.url}
											TableCell(index="1")
												+each('link.shortLinks as shortLink')
													table(style="border: 1px solid black;")
														TableRow
															TableCell
																TableRow
																	TableCell(index="0") Url:
																	TableCell(index="1"): a(target="_blank" rel="noopener" href="{config.appHost}/l/{shortLink._id}") {config.appHost}/l/{shortLink._id}
																TableRow
																	TableCell(index="0") Campaign:
																	TableCell(index="1"): b {shortLink.campaign || "--"}
																TableRow
																	TableCell(index="0") Source:
																	TableCell(index="1"): b {shortLink.source || "--"}
																TableRow
																	TableCell(index="0") Medium:
																	TableCell(index="1"): b {shortLink.medium || "--"}
									+else()
										TableRow
											TableCell(colSpan="2" index="2" align="center") No links created yet.
</template>

<style lang="sass" global>
	@import "svelboost/src/components/common-styles/common"


	main 
		padding-top: 60px
		margin: 0 20px

	.form-block
		max-width: 400px


	.custom-row td:first-child
		vertical-align: top
</style>
