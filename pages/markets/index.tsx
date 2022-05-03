import React, { useContext } from 'react';
import { BigNumber } from 'ethers';
import { MarketsDataList } from 'components';
import { IDataListColumn } from 'components/DataList/DataList';
import { IMarketsData } from 'components/MarketsDataList';
import { useData } from 'api/data';
import { useState, useEffect } from 'react';
import PageLoading from 'components/common/Loading/PageLoading';
import { bigNumberToUSDString, bigNumberToString } from 'lib/number-utils';
import Layout from 'pages/Layout';
import { ResponsiveContext } from 'grommet';

function Markets() {
  const size = useContext(ResponsiveContext);
  const [marketData, setMarketData] = useState<IMarketsData[]>([]);
  const [totalMarketSizeUsd, setTotalMarketSizeUsd] = useState(0);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [usdDecimals, setUsdDecimals] = useState<BigNumber>(BigNumber.from(18));

  const marketColumns: IDataListColumn[] = [
    { title: 'ASSETS', size: 'flex' },
    { title: 'MARKET SIZE', size: 'flex' },
    { title: 'SUPPLY APY', size: 'flex' },
    { title: 'BORROW APY', size: 'flex' },
    { title: '', size: 'flex' },
  ];

  const marketMobileColumns: IDataListColumn[] = [
    { title: 'ASSETS', size: 'flex' },
    { title: 'MARKET SIZE', size: 'xsmall' },
    { title: '', size: 'flex' },
  ];

  const { ReserveData, ReserveConfigurationData, UserReserveData } = useData();

  useEffect(() => {
    if (ReserveData && ReserveConfigurationData && marketData.length > 0) {
      setPageLoading(false);
    }
  }, [ReserveConfigurationData, ReserveData, marketData.length]);

  useEffect(() => {
    let localTotalMarketSizeUsd = 0;
    let marketsData = ReserveData.reduce((acc, reserveData, index) => {
      let tokenConfig = ReserveConfigurationData.find((rc) => rc.address === reserveData.address);
      let decimals = tokenConfig?.decimals || BigNumber.from(18);
      setUsdDecimals(decimals);
      let totalBorrowed = reserveData.totalStableDebt.add(reserveData.totalVariableDebt);

      const marketSize = bigNumberToString(reserveData.availableLiquidity.add(totalBorrowed), decimals);
      const totalBorrowedUsd = bigNumberToUSDString(totalBorrowed, decimals, reserveData.usdPrice);
      const marketSizeUsd = bigNumberToUSDString(
        reserveData.availableLiquidity.add(totalBorrowed),
        decimals,
        reserveData.usdPrice
      );

      const depositAPY = reserveData.liquidityRate;
      const variableBorrowAPR = reserveData.variableBorrowRate;
      const stableBorrowAPR = reserveData.stableBorrowRate;
      localTotalMarketSizeUsd += parseFloat(marketSizeUsd);

        acc.push({
          name: reserveData.symbol,
          address: reserveData.address,
          color: 'clrReserveIndicatorSecondary',
          marketSize,
          marketSizeUsd,
          totalBorrowed,
          totalBorrowedUsd,
          depositAPY,
          variableBorrowAPR,
          stableBorrowAPR,
        });

      return acc;
    }, Array<IMarketsData>());
    let umee = {
      name: 'UMEE',
      address: '0xc0a4df35568f116c370e6a6a6022ceb908eeddac',
      color: 'clrReserveIndicatorSecondary',
      marketSize: '0',
      totalBorrowed: BigNumber.from(0),
      marketSizeUsd: '0.00',
      totalBorrowedUsd: '0',
      depositAPY: BigNumber.from(0),
      variableBorrowAPR: BigNumber.from(0),
      stableBorrowAPR: BigNumber.from(0),
    } as IMarketsData;
    marketsData.splice(1, 0, umee);
    setMarketData(marketsData);
    setTotalMarketSizeUsd(localTotalMarketSizeUsd);
  }, [ReserveConfigurationData, ReserveData, totalMarketSizeUsd, UserReserveData]);

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <Layout title="Umee Markets" subtitle="Markets available for cross-chain leverage">
      <MarketsDataList
        columns={size === 'small' || size === 'medium' ? marketMobileColumns : marketColumns}
        data={marketData}
        decimals={usdDecimals}
      />
    </Layout>
  );
}

export default Markets;
