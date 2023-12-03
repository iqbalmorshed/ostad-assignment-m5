import {
	Page,
	Layout,
	Text,
	BlockStack,
	Card,

} from "@shopify/polaris";
export default function Index() {
	return (
		<Page>
			<BlockStack gap="500">
				<Layout>
					<Layout.Section>
						<Card>
							<BlockStack gap="200">
								<Text as="h1" variant="headingLg" alignment="center"> Welcome to the Collection Organizer App</Text>
								<Text as="h4" variant="headingMd" alignment="center"> Please explore our awesome app by checking the menu items on the left</Text>
							</BlockStack>
						</Card>
					</Layout.Section>
				</Layout>
			</BlockStack>
		</Page>
	);
}
