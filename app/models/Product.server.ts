import db from '~/db.server';

type CreateProduct = {
	collectionId: string;
	name: string;
	description: string;
};

type UpdateProductData = {
	id: string;
	name: string;
	description: string;
};

export const getProducts = async (collectionId: string) => {
	const products = await db.product.findMany({
		where: {
			collectionId: collectionId,
		},
	});
	return products;
}

export const createProduct = async ({ collectionId, name, description }: CreateProduct) => {
	await db.product.create({
		data: {
			collectionId: collectionId,
			name,
			description,
		}
	});
}

export const updateProduct = async ({ id, name, description }: UpdateProductData) => {
	await db.product.update({
		where: {
			id,
		},
		data: {
			name,
			description,
		}
	});
}