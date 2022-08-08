import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AutoColumn } from 'components/Column';
import { TYPE } from 'theme';
import { ResponsiveRow, RowBetween, RowFixed } from 'components/Row';
import LineChart from 'components/LineChart/alt';
import useTheme from 'hooks/useTheme';
import { DarkGreyCard } from 'components/Card';
import { formatAmount, formatDollarAmount } from 'utils/numbers';
import Percent from 'components/Percent';
import { HideMedium, HideSmall, StyledInternalLink } from '../../theme';
import TokenTable from 'components/tokens/TokenTable';
import { PageWrapper, ThemedBackgroundGlobal } from 'pages/styled';
import BarChart from 'components/BarChart/alt';
import { SmallOptionButton } from 'components/Button';
import { MonoSpace } from 'components/shared';
import { useActiveNetworkVersion } from 'state/application/hooks';
import { VolumeWindow } from 'types';
import { useBalancerTokens } from '../../data/balancer/useTokens';
import { useBalancerProtocolData } from '../../data/balancer/useProtocolData';
import PoolTable from '../../components/pools/PoolTable';
import { useBalancerPools } from '../../data/balancer/usePools';
import SwapsTable from '../../components/TransactionsTable/SwapsTable';
import Loader, { LocalLoader } from '../../components/Loader';
import { useTransformedVolumeData } from 'hooks/chart';

const ChartWrapper = styled.div`
    width: 49%;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`;

export default function Home() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const theme = useTheme();

    const [activeNetwork] = useActiveNetworkVersion();

    const formattedTokens = useBalancerTokens();
    const protocolData = useBalancerProtocolData();
    const poolData = useBalancerPools();

    const [volumeHover, setVolumeHover] = useState<number | undefined>();
    const [liquidityHover, setLiquidityHover] = useState<number | undefined>();
    const [feesHover, setFeesHover] = useState<number | undefined>();
    const [swapsHover, setSwapsHover] = useState<number | undefined>();
    const [leftLabel, setLeftLabel] = useState<string | undefined>();
    const [rightLabel, setRightLabel] = useState<string | undefined>();
    const [swapsLabel, setSwapsLabel] = useState<string | undefined>();
    const [feesLabel, setFeesLabel] = useState<string | undefined>();
    
    useEffect(() => {
        if (protocolData) {
            setLiquidityHover(protocolData.tvl);
            setVolumeHover(protocolData.volume24);
            setFeesHover(protocolData.fees24);
            setSwapsHover(protocolData.swaps24);
        }
    }, [activeNetwork, protocolData.tvl, protocolData.fees24, protocolData.swaps24, protocolData.volume24]);

    const [volumeWindow, setVolumeWindow] = useState(VolumeWindow.daily);
    const [feeWindow, setFeeWindow] = useState(VolumeWindow.daily);
    const [swapWindow, setSwapWindow] = useState(VolumeWindow.daily);


    // if hover value undefined, reset to current day value
    useEffect(() => {
        if (volumeHover === undefined && protocolData) {
            setVolumeHover(protocolData.volume24);
        }
    }, [protocolData, volumeHover]);

    useEffect(() => {
        if (liquidityHover === undefined && protocolData) {
          setLiquidityHover(protocolData.tvl)
        }
      }, [liquidityHover, protocolData.tvl])

    useEffect(() => {
        if (feesHover === undefined && protocolData) {
            setFeesHover(protocolData.fees24);
        }
    }, [feesHover, protocolData.fees24]);

    useEffect(() => {
        if (swapsHover === undefined && protocolData?.swaps24) {
            setSwapsHover(protocolData.swaps24);
        }
    }, [swapsHover, protocolData.swaps24]);


    //Sorted by time-window
    const weeklyVolumeData = useTransformedVolumeData(protocolData?.volumeData, 'week');
    const monthlyVolumeData = useTransformedVolumeData(protocolData?.volumeData, 'month');

    const weeklyFeeData = useTransformedVolumeData(protocolData?.feeData, 'week');
    const monthlyFeeData = useTransformedVolumeData(protocolData?.feeData, 'month');

    const weeklySwapData = useTransformedVolumeData(protocolData?.swapData, 'week');
    const monthlySwapData = useTransformedVolumeData(protocolData?.swapData, 'month');

    return (
        <PageWrapper>
            <ThemedBackgroundGlobal backgroundColor={activeNetwork.bgColor} />
            <AutoColumn gap="16px">
                <TYPE.largeHeader>{activeNetwork.name} Overview</TYPE.largeHeader>
                {protocolData?.volumeData.length > 0 ?
                <ResponsiveRow>
                    <ChartWrapper>
                        <LineChart
                            data={protocolData?.tvlData}
                            height={220}
                            minHeight={332}
                            color={activeNetwork.primaryColor}
                            value={liquidityHover}
                            label={leftLabel}
                            setValue={setLiquidityHover}
                            setLabel={setLeftLabel}
                            topLeft={
                                <AutoColumn gap="4px">
                                    <TYPE.mediumHeader fontSize="16px">TVL</TYPE.mediumHeader>
                                    <TYPE.largeHeader fontSize="32px">
                                        <MonoSpace>{formatDollarAmount(liquidityHover, 2, true)} </MonoSpace>
                                    </TYPE.largeHeader>
                                    <TYPE.main fontSize="12px" height="14px">
                                        {leftLabel ? <MonoSpace>{leftLabel} (UTC)</MonoSpace> : null}
                                    </TYPE.main>
                                </AutoColumn>
                            }
                        />
                    </ChartWrapper>
                    <ChartWrapper>
                    <BarChart
                            height={220}
                            minHeight={332}
                            data={
                                volumeWindow === VolumeWindow.monthly
                                  ? monthlyVolumeData
                                  : volumeWindow === VolumeWindow.weekly
                                  ? weeklyVolumeData
                                  : protocolData.volumeData
                              }
                            color={activeNetwork.primaryColor}
                            setValue={setVolumeHover}
                            setLabel={setRightLabel}
                            value={volumeHover}
                            label={rightLabel}
                            activeWindow={volumeWindow}
                            topRight={
                                <RowFixed style={{ marginLeft: '-40px', marginTop: '8px' }}>
                                    <SmallOptionButton
                                        active={volumeWindow === VolumeWindow.daily}
                                        onClick={() => setVolumeWindow(VolumeWindow.daily)}
                                    >
                                        D
                                    </SmallOptionButton>
                                    <SmallOptionButton
                                        active={volumeWindow === VolumeWindow.weekly}
                                        style={{ marginLeft: '8px' }}
                                        onClick={() => setVolumeWindow(VolumeWindow.weekly)}
                                    >
                                        W
                                    </SmallOptionButton>
                                    <SmallOptionButton
                                        active={volumeWindow === VolumeWindow.monthly}
                                        style={{ marginLeft: '8px' }}
                                        onClick={() => setVolumeWindow(VolumeWindow.monthly)}
                                    >
                                        M
                                    </SmallOptionButton>
                                </RowFixed>
                            }
                            topLeft={
                                <AutoColumn gap="4px">
                                    <TYPE.mediumHeader fontSize="16px">Trading Volume</TYPE.mediumHeader>
                                    <TYPE.largeHeader fontSize="32px">
                                        <MonoSpace> {formatDollarAmount(volumeHover, 2)}</MonoSpace>
                                    </TYPE.largeHeader>
                                    <TYPE.main fontSize="12px" height="14px">
                                        {rightLabel ? <MonoSpace>{rightLabel} (UTC)</MonoSpace> : null}
                                    </TYPE.main>
                                </AutoColumn>
                            }
                        />
                    </ChartWrapper>
                </ResponsiveRow> : null }
                {protocolData?.swapData?.length?
                <ResponsiveRow>
                <ChartWrapper>
                <BarChart
                            height={220}
                            minHeight={332}
                            data={
                                swapWindow === VolumeWindow.monthly
                                  ? monthlySwapData
                                  : swapWindow === VolumeWindow.weekly
                                  ? weeklySwapData
                                  : protocolData.swapData
                              }
                            color={activeNetwork.primaryColor}
                            setValue={setSwapsHover}
                            setLabel={setSwapsLabel}
                            value={swapsHover}
                            label={swapsLabel}
                            activeWindow={swapWindow}
                            topRight={
                                <RowFixed style={{ marginLeft: '-40px', marginTop: '8px' }}>
                                    <SmallOptionButton
                                        active={swapWindow === VolumeWindow.daily}
                                        onClick={() => setSwapWindow(VolumeWindow.daily)}
                                    >
                                        D
                                    </SmallOptionButton>
                                    <SmallOptionButton
                                        active={swapWindow === VolumeWindow.weekly}
                                        style={{ marginLeft: '8px' }}
                                        onClick={() => setSwapWindow(VolumeWindow.weekly)}
                                    >
                                        W
                                    </SmallOptionButton>
                                    <SmallOptionButton
                                        active={swapWindow === VolumeWindow.monthly}
                                        style={{ marginLeft: '8px' }}
                                        onClick={() => setSwapWindow(VolumeWindow.monthly)}
                                    >
                                        M
                                    </SmallOptionButton>
                                </RowFixed>
                            }
                            topLeft={
                                <AutoColumn gap="4px">
                                    <TYPE.mediumHeader fontSize="16px">Swaps</TYPE.mediumHeader>
                                    <TYPE.largeHeader fontSize="32px">
                                        <MonoSpace> {formatAmount(swapsHover, 2)}</MonoSpace>
                                    </TYPE.largeHeader>
                                    <TYPE.main fontSize="12px" height="14px">
                                        {swapsLabel ? <MonoSpace>{swapsLabel} (UTC)</MonoSpace> : null}
                                    </TYPE.main>
                                </AutoColumn>
                            }
                        />
                </ChartWrapper>
                <ChartWrapper>
                        <BarChart
                            height={220}
                            minHeight={332}
                            data={
                                feeWindow === VolumeWindow.monthly
                                  ? monthlyFeeData
                                  : feeWindow === VolumeWindow.weekly
                                  ? weeklyFeeData
                                  : protocolData.feeData
                            
                            }
                            color={activeNetwork.primaryColor}
                            setValue={setFeesHover}
                            setLabel={setFeesLabel}
                            value={feesHover}
                            label={feesLabel}
                            activeWindow={feeWindow}
                            topRight={
                                <RowFixed style={{ marginLeft: '-40px', marginTop: '8px' }}>
                                    <SmallOptionButton
                                        active={feeWindow === VolumeWindow.daily}
                                        onClick={() => setFeeWindow(VolumeWindow.daily)}
                                    >
                                        D
                                    </SmallOptionButton>
                                    <SmallOptionButton
                                        active={feeWindow === VolumeWindow.weekly}
                                        style={{ marginLeft: '8px' }}
                                        onClick={() => setFeeWindow(VolumeWindow.weekly)}
                                    >
                                        W
                                    </SmallOptionButton>
                                    <SmallOptionButton
                                        active={feeWindow === VolumeWindow.monthly}
                                        style={{ marginLeft: '8px' }}
                                        onClick={() => setFeeWindow(VolumeWindow.monthly)}
                                    >
                                        M
                                    </SmallOptionButton>
                                </RowFixed>
                            }
                            topLeft={
                                <AutoColumn gap="4px">
                                    <TYPE.mediumHeader fontSize="16px">Collected fees</TYPE.mediumHeader>
                                    <TYPE.largeHeader fontSize="32px">
                                        <MonoSpace> {formatDollarAmount(feesHover, 2)}</MonoSpace>
                                    </TYPE.largeHeader>
                                    <TYPE.main fontSize="12px" height="14px">
                                        {feesLabel ? <MonoSpace>{feesLabel} (UTC)</MonoSpace> : null}
                                    </TYPE.main>
                                </AutoColumn>
                            }
                        />
                    </ChartWrapper>
            </ResponsiveRow> : <Loader/> }
                {protocolData?.volumeChange?
                <HideSmall>
                    <DarkGreyCard>
                        <RowBetween>
                            <RowFixed>
                                <RowFixed mr="20px">
                                    <TYPE.main mr="4px">Volume 24H: </TYPE.main>
                                    <TYPE.label mr="4px">{formatDollarAmount(protocolData.volume24)}</TYPE.label>
                                    <Percent value={protocolData.volumeChange} wrap={true} />
                                </RowFixed>
                                <RowFixed mr="20px">
                                    <TYPE.main mr="4px">Fees 24H: </TYPE.main>
                                    <TYPE.label mr="4px">{formatDollarAmount(protocolData.fees24)}</TYPE.label>
                                    <Percent value={protocolData.feesChange} wrap={true} />
                                </RowFixed>
                                <HideMedium>
                                    <RowFixed mr="20px">
                                        <TYPE.main mr="4px">TVL: </TYPE.main>
                                        <TYPE.label mr="4px">{formatDollarAmount(protocolData.tvl)}</TYPE.label>
                                        <TYPE.main></TYPE.main>
                                        <Percent value={protocolData.tvlChange} wrap={true} />
                                    </RowFixed>
                                </HideMedium>
                            </RowFixed>
                        </RowBetween>
                    </DarkGreyCard>
                </HideSmall> : null }
                <RowBetween>
                    <TYPE.largeHeader>Top Tokens</TYPE.largeHeader>
                    <StyledInternalLink to="tokens">Explore</StyledInternalLink>
                </RowBetween>
                <TokenTable tokenDatas={formattedTokens} />
                <RowBetween>
                    <TYPE.largeHeader>Top Pools</TYPE.largeHeader>
                    <StyledInternalLink to="pools">Explore</StyledInternalLink>
                </RowBetween>
                <PoolTable poolDatas={poolData} />
                <RowBetween>
                    <TYPE.largeHeader>Large Swaps</TYPE.largeHeader>
                </RowBetween>
                <DarkGreyCard>
                    {protocolData?.whaleSwaps.length > 0 ? (
                        <SwapsTable swaps={protocolData.whaleSwaps} />
                    ) : (
                        <LocalLoader fill={false} />
                    )}
                </DarkGreyCard>
                {/*<RowBetween>
                    <TYPE.main>Transactions</TYPE.main>
                </RowBetween>
                {transactions ? (
                    <TransactionsTable transactions={transactions} color={activeNetwork.primaryColor} />
                ) : null}*/}
            </AutoColumn>
        </PageWrapper>
    );
}
