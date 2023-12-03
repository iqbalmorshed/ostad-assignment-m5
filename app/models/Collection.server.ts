import db from '../db.server';

type CreateCollection = {
	shop: string;
	name: string;
	description: string;
};
type UpdateCollectionData = {
	id: string;
	name: string;
	description: string;
};

export const getCollection = async (id: string) => {
	const collection = await db.collection.findUnique({
		where: {
			id: id,
		},
	});
	return collection;
}

export const getShopCollections = async (shopName: string) => {
	const collections = await db.collection.findMany({
		where: {
			shop: shopName
		}
	});
	return collections;
}

export const createCollection = async ({ shop, name, description }: CreateCollection) => {
	await db.collection.create({
		data: {
			shop,
			name,
			description,
		}
	});
}

export const updateCollection = async ({ id, name, description }: UpdateCollectionData) => {
	await db.collection.update({
		where: {
			id,
		},
		data: {
			name,
			description,
		}
	});
}
