
import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
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
export default function Shop() {
	const { shopInfo } = useLoaderData<LoaderData>();
	return (
		<div>
			<h1>{shopInfo.shopName}</h1>
			<p>Shop Id: {shopInfo.shopId}</p>
		</div>
	);
}