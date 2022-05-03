import React from 'react';
import { useLocation } from 'react-router-dom';
import { AvailableBorrowsDataList } from 'components';
import { IDataListColumn } from 'components/DataList/DataList';
import { IAvailableBorrowsData } from 'components/AvailableBorrowsDataList';
import { useData } from 'api/data';
import { useParams } from 'react-router-dom';
import { BigNumber, utils } from 'ethers';
import PageLoading from 'components/common/Loading/PageLoading';
import { useWeb3 } from 'api/web3';
import { getMaxBorrows } from 'lib/health-utils';
import Layout from 'pages/Layout';

const { useEffect, useState } = React;

export interface IMyBorrowsData {
  name: string;
  color: string;
  value: number;
  type: string;
  variableAPR?: BigNumber;
  address: string;
}

type stateType = {
  tokenAddress: string;
};

const Borrow = () => {
  const { state } = useLocation<stateType>();
  const { ReserveData, ReserveConfigurationData, UserReserveData, priceData, UserAccountData } = useData();
  const web3 = useWeb3();
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const [tokens, setTokens] = useState<IAvailableBorrowsData[]>([]);
  const [myBorrowsData, setMyBorrowsData] = useState<IAvailableBorrowsData[]>();
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (web3.account) {
      setLoggedIn(true);
    } else setLoggedIn(false);
  }, [web3.account]);

  useEffect(() => {
    if (UserReserveData && ReserveConfigurationData && priceData && ReserveData) {
      setPageLoading(false);
    }
    if (!web3.account && ReserveData) {
      setPageLoading(false);
    }
  }, [ReserveConfigurationData, ReserveData, UserReserveData, priceData, web3.account, tokens.length]);

  useEffect(() => {
    if (ReserveData.length) {
      const tokens = ReserveData.reduce((acc, datum) => {
        const data = UserReserveData.find((value) => value.address === datum.address);
        let availableAmount;
        if (UserAccountData && datum.address && priceData && datum.symbol && ReserveData) {
          // Maximum a user can Borrow to keep health in good standing
          const MaxAvailable = getMaxBorrows(
            UserAccountData,
            priceData[datum.symbol].eth,
            datum.symbol,
            ReserveConfigurationData.find((r) => r.address === datum.address)?.decimals.toString() || '18'
          );

          // If the User's deposits is less than healthFactor max => Can withdraw all
          // If deposits are less => can withdraw up to healthFactor max
          if (datum.availableLiquidity.lt(MaxAvailable)) {
            availableAmount = datum.availableLiquidity;
          } else {
            availableAmount = MaxAvailable;
          }
        }
        if (!data || (data && data.currentVariableDebt?.isZero())) {
          acc.push({
            address: datum.address,
            symbol: datum.symbol,
            color: 'black',
            tokensAvailable: availableAmount,
            usdAvailable: datum.usdPrice,
            variableAPR: datum.variableBorrowRate,
            decimals: ReserveConfigurationData.find((r) => r.address === datum.address)?.decimals.toNumber(),
            borrowingEnabled:
              ReserveConfigurationData.find((r) => r.address === datum.address)?.borrowingEnabled || false,
          }); 
        }
        return acc;
      }, Array<IAvailableBorrowsData>());
      setTokens(tokens);
    }
    if (UserReserveData && priceData) {
      setMyBorrowsData(
        ReserveData.reduce((acc, reserve) => {
          const data = UserReserveData.find((value) => value.address === reserve.address);
          const reserveConfig = ReserveConfigurationData.find((r) => r.address === reserve.address);
          if (data && !data.currentStableDebt?.isZero()) {
            acc.push({
              symbol: reserve.symbol,
              color: 'black',
              balance: parseFloat(utils.formatUnits(data.currentStableDebt, reserveConfig?.decimals)),
              variableAPR: reserve.variableBorrowRate,
              stableAPR: reserve.stableBorrowRate,
              address: reserve.address,
              borrowingEnabled:
                ReserveConfigurationData.find((r) => r.address === reserve.address)?.borrowingEnabled || false,
              decimals: reserveConfig?.decimals.toNumber() || 18,
            });
          }
          if (data && !data.currentVariableDebt?.isZero()) {
            acc.push({
              symbol: reserve.symbol,
              color: 'black',
              balance: parseFloat(utils.formatUnits(data.currentVariableDebt, reserveConfig?.decimals)),
              variableAPR: reserve.variableBorrowRate,
              address: reserve.address,
              borrowingEnabled:
                ReserveConfigurationData.find((r) => r.address === reserve.address)?.borrowingEnabled || false,
              decimals: reserveConfig?.decimals.toNumber() || 18,
            });
          }
          return acc;
        }, Array<IAvailableBorrowsData>())
      );
    }
  }, [ReserveData, tokenAddress, ReserveConfigurationData, UserReserveData, priceData, UserAccountData]);

  const availableTokensColumns: IDataListColumn[] = [
    { title: 'AVAILABLE ASSETS', size: 'flex' },
    { title: 'AVAILABLE', size: 'flex' },
    { title: 'BORROW APY', size: 'flex' },
  ];

  const userAssetsColumns: IDataListColumn[] = [
    { title: 'YOUR POSITIONS', size: 'flex' },
    { title: 'BORROWED', size: 'flex' },
    { title: 'BORROW APY', size: 'flex' },
  ];

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <Layout title="Borrow" subtitle="Borrow assets for cross-chain leverage">
      {loggedIn && (
        <AvailableBorrowsDataList
          columns={availableTokensColumns}
          userAssetsColumns={userAssetsColumns}
          data={tokens}
          myBorrowsData={myBorrowsData}
          loggedIn={loggedIn}
          selectedTokenAddress={state && state.tokenAddress}
        />
      )}
    </Layout>
  );
};

export default Borrow;
