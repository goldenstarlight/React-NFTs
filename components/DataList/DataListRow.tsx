import { Box, BoxProps, Card, Grid, GridSizeType } from 'grommet';
import { Theme, useTheme } from 'lib/hooks/theme/context';
import React from 'react';
import { useHistory } from 'react-router-dom';
import './DataListRow.css';

export interface DataListRowProps {
  columnSizes: GridSizeType[];
  children?: any;
  linkUrl?: string;
  rowColor?: string;
  tokenAddress?: string;
  setTokenAddress?(tokenAddress: string): void;
}

/**
 * @todo ADK: Abstract out the "marketDetails" to something more broad fitting.
 * @param param0
 * @returns
 */
const DataListRow = ({ children, columnSizes, rowColor, linkUrl, setTokenAddress, tokenAddress }: DataListRowProps) => {
  const history = useHistory();
  const handleClick = (e: any) => {
    e.preventDefault();
    if (!!linkUrl) {
      history.push(linkUrl);
    } else if (!!setTokenAddress && tokenAddress) {
      setTokenAddress(tokenAddress);
    }
  };

  const props: BoxProps = {
    direction: 'row',
    pad: { vertical: 'small' },
    align: 'center',
    justify: 'start',
    fill: 'horizontal',
    round: '0px',
  };

  if (!!linkUrl || !!setTokenAddress) {
    props.onClick = handleClick;
  }

  const { themeMode } = useTheme();

  return (
    <div className={`row-container ${themeMode === Theme.dark ? 'row-container-dark' : null}`}>
      <Box border={{ side: 'bottom', color: 'clrDataListBorderBottom', size: '1px' }} {...props}>
        {rowColor && <Box border={{ color: rowColor, side: 'left', size: '3px' }} height="2rem" />}
        <Grid className="row-content" columns={columnSizes} gap="small" fill="horizontal" align="center">
          {children}
        </Grid>
      </Box>
    </div>
  );
};

export default DataListRow;
