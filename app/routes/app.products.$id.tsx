/* show list of products in a collection */
import { type LoaderFunctionArgs, json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Page, Layout, Text, Card, BlockStack, FormLayout, TextField } from "@shopify/polaris";
import { useState } from "react";
import PopUpModal from "~/components/PopUpModal";
import { getCollection } from "~/models/Collection.server";
import { createProduct, getProducts, updateProduct } from "~/models/Product.server";
import { authenticate } from "~/shopify.server";
import invariant from "tiny-invariant";

type Product = {
	id: string;
	name: string;
	description: string;
	collectionId: string;
}

type LoaderData = {
	products: Product[];
	collection: {
		id: string;
		name: string;
		description: string;
		shop: string;
	}
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	invariant(params.id, "Could not find collection");
	const { session } = await authenticate.admin(request);
	const { shop } = session;
	//get collection id from url
	const collectionId = params.id;

	const collection = await getCollection(collectionId);
	invariant(collection, "Could not find collection");
	invariant(collection.shop == shop, "Unauthorized request");

	const products = await getProducts(collectionId);

	return json({
		products,
		collection,
	});

}

export const action = async ({ request }: ActionFunctionArgs) => {
	const { session } = await authenticate.admin(request);
	const { shop } = session;

	const formData = await request.formData();
	let id: string | null = String(formData.get("id"));
	const name = String(formData.get("name"));
	const description = String(formData.get("description"));
	const collectionId = String(formData.get("collectionId"));

	id = id == "null" ? null : id;

	console.log({ id, name, description, shop });

	if (id) {
		await updateProduct({ id, name, description });
	} else {
		await createProduct({ collectionId: collectionId, name, description });
	}

	return json({ success: true });
}

export default function Products() {
	const { products, collection } = useLoaderData<LoaderData>();
	const [showModal, setShowModal] = useState(false);

	return (
		<Page>
			<Layout>
				<Layout.Section>
					<Card>
						<BlockStack gap="500">
							<BlockStack gap="200">
								<Text as="h2" variant="headingMd">
									List of products in collection {collection.name}
								</Text>
							</BlockStack>
							<ProductsTable products={products} />
						</BlockStack>
					</Card>
					<button
						onClick={() => {
							setShowModal(true);
						}}
					>Create new product</button>
					{showModal && <ProductPopUpModal product={null} collectionId={collection.id} setShowModal={setShowModal} />}
				</Layout.Section>
			</Layout>
		</Page>
	);
}

const ProductsTable = ({ products }: { products: Product[] }) => {

	const [showModal, setShowModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{products.map((product) => {
					return (
						<tr key={product.id}>
							<td>{product.name}</td>
							<td>{product.description}</td>
							<td>
								<button
									onClick={() => {
										setSelectedProduct(product);
										setShowModal(true);
									}}
								>Edit</button>
								{showModal &&
									<ProductPopUpModal
										product={selectedProduct}
										collectionId={product.collectionId}
										setShowModal={setShowModal} />}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
type ProductPopUpModalProps = {
	product: Product | null;
	collectionId: string;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductPopUpModal = ({ product, collectionId, setShowModal }: ProductPopUpModalProps) => {
	const submit = useSubmit();
	const [id] = useState(product?.id ?? "");
	const [name, setName] = useState(product?.name ?? "");
	const [description, setDescription] = useState(product?.description ?? "");

	return (
		<PopUpModal setShowModal={setShowModal} onPrimaryAction={() => {
			submit({
				id,
				name,
				description,
				collectionId,
			}, { replace: true, method: "POST" });

		}}>
			<FormLayout>
				<TextField
					label="Name"
					type="text"
					value={name}
					autoComplete="off"
					onChange={setName}
				/>
				<TextField
					label="Description"
					type="text"
					value={description}
					autoComplete="off"
					onChange={setDescription}
				/>
			</FormLayout>
		</PopUpModal>
	);
};

