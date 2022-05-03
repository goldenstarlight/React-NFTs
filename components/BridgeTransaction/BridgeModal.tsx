import React from 'react';
import { Box } from 'grommet';
import { BaseModal } from 'components/common/BaseModal';
import BridgeDialog from 'dialogs/Bridge';

interface BridgeModalProps {
  address: string
  tokenName: string
  onClose: () => void
}

const BridgeModal: React.FC<BridgeModalProps> = ({ address: tokenAddress, tokenName, onClose }) => (
  <BaseModal onClose={onClose}>
    <Box className="modal-width">
      <BridgeDialog address={tokenAddress} tokenName={tokenName} onClose={onClose} />
    </Box>
  </BaseModal>
);

export default BridgeModal;
