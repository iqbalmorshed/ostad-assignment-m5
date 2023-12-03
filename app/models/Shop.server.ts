import db from '../db.server'
export const getShopInfo = async (shopName: String) => {
	const shop = await db.session.findFirstOrThrow({
		where: {
			shop: shopName
		}
	});
	return shop;
};