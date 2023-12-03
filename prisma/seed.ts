// seed sample data into the Collection and Product tables:

import db from '~/db.server';

async function seed() {
	const collections = getSampleCollections();
	for (const collection of collections) {
		await db.collection.create({
			data: {
				shop: "ostadstore99.myshopify.com",
				...collection,
			}
		});
	}
}

seed();

function getSampleCollections() {
	return [
		{
			name: "Collection 1",
			description: "Description 1",
		},
		{
			name: "Collection 2",
			description: "Description 2",
		},
		{
			name: "Collection 3",
			description: "Description 3",
		},
	]
}