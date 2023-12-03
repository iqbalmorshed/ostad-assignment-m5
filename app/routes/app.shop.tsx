
import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { BlockStack, Card, Layout, Page, Text } from "@shopify/polaris";
import { getShopInfo } from "~/models/Shop.server";
import { authenticate } from "~/shopify.server";

type LoaderData = {
	shopInfo: {
		shopId: string;
		shopName: string;
	};
};
export async function loader({ request }: LoaderFunctionArgs) {
	const { session } = await authenticate.admin(request);
	const { shop } = session;
	const shopInfo = await getShopInfo(shop);

	return json({
		shopInfo: {
			shopId: shopInfo.id,
			shopName: shopInfo.shop,
		}
	});
}
// show shop name and id using Polaris components

export default function Shop() {
	const { shopInfo } = useLoaderData<LoaderData>();
	return (
		<Page>
			<ui-title-bar title="Shop Info" />
			<Layout>
				<Layout.Section>
					<BlockStack gap="500">
						<Card>
							<Text as={"h2"} variant="headingLg" alignment="center">
								Shop Name
							</Text>
							<Text as={"h3"} alignment="center" >
								{shopInfo.shopName}
							</Text>
						</Card>
						<Card>
							<Text as={"h2"} variant="headingLg" alignment="center">
								Shop ID
							</Text>
							<Text as={"h3"} alignment="center" >
								{shopInfo.shopId}
							</Text>
						</Card>
					</BlockStack>
				</Layout.Section>
			</Layout>
		</Page>
	)
}