import React, { useContext } from 'react';
import { Box, ResponsiveContext, Text } from 'grommet';

interface DashboardInfoPanelProps {
  title: string;
  borderColor?: string;
  value: string;
}

const DashboardInfoPanel: React.FC<DashboardInfoPanelProps> = ({ title, borderColor, value }) => {
  const size = useContext(ResponsiveContext);

  return (
    <Box
      border={[
        { side: 'bottom', size: '1px', color: 'clrTextAndDataListHeader' },
        { side: 'top', size: '2px', color: borderColor || 'clrPrimary' },
      ]}
      pad={{ vertical: 'xsmall' }}
      flex
    >
      <Text color="clrTextAndDataListHeader" size="xsmall">
        {title}
      </Text>
      <Text color="clrTextAndDataListHeader" margin={{ top: 'medium' }} size={size === 'small' ? '32px' : 'large'}>
        ${value}
      </Text>
    </Box>
  );
};

export default DashboardInfoPanel;
