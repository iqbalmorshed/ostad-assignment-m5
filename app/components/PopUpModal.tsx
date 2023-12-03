
import React, { useState } from 'react';
import { Modal, Button } from '@shopify/polaris';

interface PopUpModalProps {
	children: React.ReactNode;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	onPrimaryAction: () => void;
}

const PopUpModal: React.FC<PopUpModalProps> = ({ children, onPrimaryAction, setShowModal }) => {

	const handlePrimaryAction = () => {
		onPrimaryAction();
		setShowModal(false);
	}

	return (
		<div>
			<Modal
				open={true}
				onClose={() => setShowModal(false)}
				title="My PopUp Modal"
				primaryAction={{
					content: 'Save',
					onAction: handlePrimaryAction,
				}}
				secondaryActions={[
					{
						content: 'Cancel',
						onAction: () => setShowModal(false),
					},
				]}
			>
				<Modal.Section>
					{children}
				</Modal.Section>
			</Modal>
		</div>
	);
};

export default PopUpModal;
