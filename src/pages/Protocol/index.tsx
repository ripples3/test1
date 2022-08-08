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
import { useBalancerChainProtocolData } from 'data/balancer/useAggregatedProtocolData';
import { ArbitrumNetworkInfo, EthereumNetworkInfo, PolygonNetworkInfo} from 'constants/networks';
import { CHAIN_COLORS } from 'constants/tokenColorList';
import { client, arbitrumClient, arbitrumBlockClient, polygonClient, polygonBlockClient } from 'apollo/client';
import StackedAreaChart from 'components/StackedAreaChart';
import BarChartStacked from 'components/BarChartStacked';
import getAggregatedProtocolChartData from 'utils/getAggregatedProtocolChartData';

const ChartWrapper = styled.div`
    width: 49%;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`;

export default function Protocol() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const theme = useTheme();

    const [activeNetwork] = useActiveNetworkVersion();
    const protocolData = useBalancerChainProtocolData(EthereumNetworkInfo.clientUri, EthereumNetworkInfo.startTimeStamp);
    const protocolArbitrumData = useBalancerChainProtocolData(ArbitrumNetworkInfo.clientUri, ArbitrumNetworkInfo.startTimeStamp, arbitrumBlockClient, arbitrumClient);
    const protocolPolygonData = useBalancerChainProtocolData(PolygonNetworkInfo.clientUri, PolygonNetworkInfo.startTimeStamp, polygonBlockClient, polygonClient);


    //---Aggregated TVL Data---
    let aggregatedTVL:any[] = [];
    let  protocolTVL = 0;
    let protocolTVLChange = 0;
    //Create aggregate / stitched together TVL test:
    if (protocolData.tvlData && protocolArbitrumData.tvlData && protocolPolygonData.tvlData) {
        aggregatedTVL = getAggregatedProtocolChartData(protocolData.tvlData, protocolArbitrumData.tvlData, protocolPolygonData.tvlData, NaN)
        if (protocolData.tvl && protocolArbitrumData.tvl && protocolPolygonData.tvl) {
            protocolTVL = protocolData.tvl + protocolArbitrumData.tvl + protocolPolygonData.tvl;
        }
        if (protocolData.tvlChange && protocolArbitrumData.tvlChange && protocolPolygonData.tvlChange) {
            protocolTVLChange = protocolData.tvlChange + protocolArbitrumData.tvlChange + protocolPolygonData.tvlChange;
        }
    }

    //---Aggregated Trading volume data---
    let aggregatedVolume:any[] = [];
    let  protocolVolume = 0;
    let protocolVolumeChange = 0
    if (protocolData.volumeData && protocolArbitrumData.volumeData && protocolPolygonData.volumeData) {
        aggregatedVolume = getAggregatedProtocolChartData(protocolData.volumeData, protocolArbitrumData.volumeData, protocolPolygonData.volumeData, 0)
        if (protocolData.volume24 && protocolArbitrumData.volume24 && protocolPolygonData.volume24) {
            protocolVolume = protocolData.volume24 + protocolArbitrumData.volume24 + protocolPolygonData.volume24;
        }
        if (protocolData.volumeChange && protocolArbitrumData.volumeChange && protocolPolygonData.volumeChange) {
            protocolVolumeChange = protocolData.volumeChange + protocolArbitrumData.volumeChange + protocolPolygonData.volumeChange;
        }
    }
    let aggregatedWeeklyVolume:any[] = [];
    const weeklyVolumeData = useTransformedVolumeData(protocolData?.volumeData, 'week');
    const weeklyArbitrumVolumeData = useTransformedVolumeData(protocolArbitrumData?.volumeData, 'week');
    const weeklyPolygonVolumeData = useTransformedVolumeData(protocolPolygonData?.volumeData, 'week');

    if (weeklyVolumeData && weeklyArbitrumVolumeData && weeklyPolygonVolumeData) {
        //time, value, chainId
        aggregatedWeeklyVolume = getAggregatedProtocolChartData(weeklyVolumeData, weeklyArbitrumVolumeData, weeklyPolygonVolumeData, 0)
    }

    //---Aggregated Swaps data---
    let aggregatedSwaps:any[] = [];
    let  protocolSwaps = 0;
    if (protocolData.swapData && protocolArbitrumData.swapData && protocolPolygonData.swapData) {
        aggregatedSwaps = getAggregatedProtocolChartData(protocolData.swapData, protocolArbitrumData.swapData, protocolPolygonData.swapData, 0)
        if (protocolData.swaps24 && protocolArbitrumData.swaps24 && protocolPolygonData.swaps24) {
            protocolSwaps = protocolData.swaps24 + protocolArbitrumData.swaps24 + protocolPolygonData.swaps24;
        }
        if (protocolData.swaps24 && protocolArbitrumData.swaps24 && protocolPolygonData.swaps24) {
            protocolSwaps = protocolData.swaps24 + protocolArbitrumData.swaps24 + protocolPolygonData.swaps24;
        }
    }
    let aggregatedWeeklySwaps:any[] = [];
    const weeklySwapData = useTransformedVolumeData(protocolData?.swapData, 'week');
    const weeklyArbitrumSwapData = useTransformedVolumeData(protocolArbitrumData?.swapData, 'week');
    const weeklyPolygonSwapData = useTransformedVolumeData(protocolPolygonData?.swapData, 'week');

    if (weeklySwapData && weeklyArbitrumSwapData && weeklyPolygonSwapData) {
        //time, value, chainId
        aggregatedWeeklySwaps = getAggregatedProtocolChartData(weeklySwapData, weeklyArbitrumSwapData, weeklyPolygonSwapData, 0)
    }

    //---Aggregated fee data
        //---Aggregated Swaps data---
        let aggregatedFees:any[] = [];
        let  protocolFees = 0;
        let protocolFeesChange = 0;
        if (protocolData.feeData && protocolArbitrumData.feeData && protocolPolygonData.feeData) {
            aggregatedFees = getAggregatedProtocolChartData(protocolData.feeData, protocolArbitrumData.feeData, protocolPolygonData.feeData, 0)
            if (protocolData.fees24 && protocolArbitrumData.fees24 && protocolPolygonData.fees24) {
                protocolFees = protocolData.fees24 + protocolArbitrumData.fees24 + protocolPolygonData.fees24;
            }
            if (protocolData.feesChange && protocolArbitrumData.feesChange && protocolPolygonData.feesChange) {
                protocolFeesChange = protocolData.feesChange + protocolArbitrumData.feesChange + protocolPolygonData.feesChange;
            }
        }
        let aggregatedWeeklyFees:any[] = [];
        const weeklyFeeData = useTransformedVolumeData(protocolData?.feeData, 'week');
        const weeklyArbitrumFeeData = useTransformedVolumeData(protocolArbitrumData?.feeData, 'week');
        const weeklyPolygonFeeData = useTransformedVolumeData(protocolPolygonData?.feeData, 'week');
    
        if (weeklySwapData && weeklyArbitrumSwapData && weeklyPolygonSwapData) {
            //time, value, chainId
            aggregatedWeeklyFees = getAggregatedProtocolChartData(weeklyFeeData, weeklyArbitrumFeeData, weeklyPolygonFeeData, 0)
        }
    

    const [volumeHover, setVolumeHover] = useState<number | undefined>();
    const [liquidityHover, setLiquidityHover] = useState<number | undefined>();
    const [feesHover, setFeesHover] = useState<number | undefined>();
    const [swapsHover, setSwapsHover] = useState<number | undefined>();
    const [leftLabel, setLeftLabel] = useState<string | undefined>();
    const [rightLabel, setRightLabel] = useState<string | undefined>();
    const [swapsLabel, setSwapsLabel] = useState<string | undefined>();
    const [feesLabel, setFeesLabel] = useState<string | undefined>();
    
    useEffect(() => {
        setLiquidityHover(protocolTVL);
        setVolumeHover(protocolVolume);
        setFeesHover(protocolFees);
        setSwapsHover(protocolSwaps);
    }, [activeNetwork, protocolTVL]);

    // if hover value undefined, reset to current day value
    useEffect(() => {
        if (!volumeHover && protocolData) {
            setVolumeHover(protocolVolume);
        }
    }, [volumeHover, protocolData]);

    useEffect(() => {
        if (liquidityHover === undefined && protocolTVL > 0) {
          setLiquidityHover(protocolTVL)
        }
      }, [liquidityHover, protocolData])

    useEffect(() => {
        if (!feesHover && protocolData) {
            setFeesHover(protocolFees);
        }
    }, [feesHover, protocolData]);

    useEffect(() => {
        if (!swapsHover && protocolData?.swaps24) {
            setSwapsHover(protocolSwaps);
        }
    }, [swapsHover, protocolData]);

    return (
        <PageWrapper>
            <ThemedBackgroundGlobal backgroundColor={'#7f7f7f'} />
            <AutoColumn gap="16px">
                <TYPE.largeHeader>Balancer V2: Protocol Overview</TYPE.largeHeader>
                {weeklyVolumeData.length > 0 && weeklyArbitrumVolumeData.length > 0 && weeklyPolygonVolumeData.length > 0 ?
                <ResponsiveRow>
                    <ChartWrapper>
                        <StackedAreaChart
                            data={aggregatedTVL}
                            tokenSet={['Mainnet', 'Arbitrum', 'Polygon']}
                            height={220}
                            minHeight={332}
                            color={activeNetwork.primaryColor}
                            value={liquidityHover}
                            label={leftLabel}
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
                    {protocolData.volumeData && protocolArbitrumData.volumeData && protocolPolygonData.volumeData ?
                    <ChartWrapper>
                    <BarChartStacked
                            height={220}
                            minHeight={332}
                            data={aggregatedWeeklyVolume}
                            color={activeNetwork.primaryColor}
                            tokenSet={['Mainnet', 'Arbitrum', 'Polygon']}
                            isDollarAmount={true}
                            value={volumeHover}
                            label={rightLabel}
                            topLeft={
                                <AutoColumn gap="4px">
                                    <TYPE.mediumHeader fontSize="16px">Weekly Trading Volume</TYPE.mediumHeader>
                                    <TYPE.largeHeader fontSize="32px">
                                        <MonoSpace> {formatDollarAmount(volumeHover, 2)}</MonoSpace>
                                    </TYPE.largeHeader>
                                    <TYPE.main fontSize="12px" height="14px">
                                        {rightLabel ? <MonoSpace>{rightLabel} (UTC)</MonoSpace> : null}
                                    </TYPE.main>
                                </AutoColumn>
                            }
                        />
                    </ChartWrapper> : null }
                </ResponsiveRow> : <Loader/> }
                {weeklySwapData.length > 0 && weeklyArbitrumSwapData.length > 0 && weeklyPolygonSwapData.length > 0 ?
                <ResponsiveRow>
                <ChartWrapper>
                <BarChartStacked
                            height={220}
                            minHeight={332}
                            data={aggregatedWeeklySwaps}
                            color={activeNetwork.primaryColor}
                            tokenSet={['Mainnet', 'Arbitrum', 'Polygon']}
                            value={swapsHover}
                            label={swapsLabel}
                            topLeft={
                                <AutoColumn gap="4px">
                                    <TYPE.mediumHeader fontSize="16px">Weekly Swaps</TYPE.mediumHeader>
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
                        <BarChartStacked
                            height={220}
                            minHeight={332}
                            data={aggregatedWeeklyFees
                            }
                            color={activeNetwork.primaryColor}
                            tokenSet={['Mainnet', 'Arbitrum', 'Polygon']}
                            value={feesHover}
                            label={feesLabel}
                            topLeft={
                                <AutoColumn gap="4px">
                                    <TYPE.mediumHeader fontSize="16px">Weekly Collected fees</TYPE.mediumHeader>
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
            </ResponsiveRow> : null }
                {protocolVolume > 0 && protocolFees > 0 && protocolTVL > 0 ?
                <HideSmall>
                    <DarkGreyCard>
                        <RowBetween>
                            <RowFixed align="center" justify="center">
                                <RowFixed mr="20px">
                                    <TYPE.main mr="4px">Weekly volume: </TYPE.main>
                                    <TYPE.label mr="4px">{formatDollarAmount(protocolVolume)}</TYPE.label>
                                    <Percent value={protocolVolumeChange} wrap={true} />
                                </RowFixed>
                                <RowFixed mr="20px">
                                    <TYPE.main mr="4px">Weekly fees: </TYPE.main>
                                    <TYPE.label mr="4px">{formatDollarAmount(protocolFees)}</TYPE.label>
                                    <Percent value={protocolFeesChange} wrap={true} />
                                </RowFixed>
                                <HideMedium>
                                    <RowFixed mr="20px">
                                        <TYPE.main mr="4px">TVL: </TYPE.main>
                                        <TYPE.label mr="4px">{formatDollarAmount(protocolTVL)}</TYPE.label>
                                        <TYPE.main></TYPE.main>
                                        <Percent value={protocolTVLChange} wrap={true} />
                                    </RowFixed>
                                </HideMedium>
                            </RowFixed>
                        </RowBetween>
                    </DarkGreyCard>
                </HideSmall> : null }
            </AutoColumn>
        </PageWrapper>
    );
}
