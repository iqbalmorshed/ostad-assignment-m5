import { type LoaderFunctionArgs, json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Page, Layout, Text, Card, BlockStack, FormLayout, TextField } from "@shopify/polaris";
import { useState } from "react";
import PopUpModal from "~/components/PopUpModal";
import { createCollection, getShopCollections, updateCollection } from "~/models/Collection.server";
import { authenticate } from "~/shopify.server";

type Collection = {
	id: string;
	name: string;
	description: string;
};

type LoaderData = {
	collections: Collection[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { session } = await authenticate.admin(request);
	const { shop } = session;

	const collections = await getShopCollections(shop);

	return json({
		collections,
	});
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const { session } = await authenticate.admin(request);
	const { shop } = session;

	const formData = await request.formData();
	let id: string | null = String(formData.get("id"));
	const name = String(formData.get("name"));
	const description = String(formData.get("description"));

	id = id == "null" ? null : id;

	console.log({ id, name, description, shop });

	if (id) {
		await updateCollection({ id, name, description });
	} else {
		await createCollection({ shop, name, description });
	}

	return json({ success: true });
}

export default function Collections() {
	const { collections } = useLoaderData<LoaderData>();
	const [showModal, setShowModal] = useState(false);

	return (
		<Page>
			<Layout>
				<Layout.Section>
					<Card>
						<BlockStack gap="500">
							<BlockStack gap="200">
								<Text as="h2" variant="headingMd">
									Collections
								</Text>
								<Text variant="bodyMd" as="p">
									List of collections
								</Text>
							</BlockStack>
							<CollectionsTable collections={collections} />
						</BlockStack>
					</Card>
					<button
						onClick={() => {
							setShowModal(true);
						}}
					>Create new collection</button>
					{showModal && <CollectionPopUpModal collection={null} setShowModal={setShowModal} />}
				</Layout.Section>
			</Layout>
		</Page>
	);
}

const CollectionsTable = ({ collections }: { collections: Collection[] }) => {

	const [showModal, setShowModal] = useState(false);
	const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
	const navigate = useNavigate();

	if (!collections.length)
		return <div>No collections found</div>;

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{collections.map((collection) => (
						<tr key={collection.id}>
							<td>{collection.name}</td>
							<td>{collection.description}</td>
							<td>
								<button
									onClick={() => {
										setSelectedCollection(collection);
										setShowModal(true);
									}}
								>Edit</button>
							</td>
							<td>
								<button
									onClick={() => {
										navigate(`/app/products/${collection.id}`);
									}}
								>Show Products</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{showModal && <CollectionPopUpModal collection={selectedCollection} setShowModal={setShowModal} />}
		</>
	);
}

// take name and description as input in a form and create/edit a new collection on submit 
type CollectionPopUpModalProps = {
	collection: Collection | null;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const CollectionPopUpModal = ({ collection, setShowModal }: CollectionPopUpModalProps) => {
	const submit = useSubmit();
	const [id] = useState(collection?.id || null);
	const [name, setName] = useState(collection?.name || "");
	const [description, setDescription] = useState(collection?.description || "");

	return (
		<PopUpModal
			setShowModal={setShowModal}
			onPrimaryAction={() => {
				submit({
					id,
					name,
					description,
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
	)

}