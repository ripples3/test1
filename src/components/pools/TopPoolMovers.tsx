import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ScrollableX, GreyCard, GreyBadge } from 'components/Card';
import Loader from 'components/Loader';
import { AutoColumn } from 'components/Column';
import { RowFixed } from 'components/Row';
import { TYPE, StyledInternalLink } from 'theme';
import { formatDollarAmount } from 'utils/numbers';
import Percent from 'components/Percent';
import PoolCurrencyLogo from 'components/PoolCurrencyLogo';
import HoverInlineText from 'components/HoverInlineText';
import { feeTierPercent } from 'utils';
import { PoolData } from '../../data/balancer/balancerTypes';
import { useBalancerPools } from '../../data/balancer/usePools';

const Container = styled(StyledInternalLink)`
    min-width: 210px;
    margin-right: 16px;

    :hover {
        cursor: pointer;
        opacity: 0.6;
    }
`;

const Wrapper = styled(GreyCard)`
    padding: 12px;
`;

const DataCard = ({ poolData }: { poolData: PoolData }) => {
    return (
        <Container to={'pools/' + poolData.id}>
            <Wrapper>
                <AutoColumn gap="sm">
                    <RowFixed>
                        <PoolCurrencyLogo tokens={poolData.tokens} size={16} />
                        <TYPE.label ml="8px">
                            <HoverInlineText
                                maxCharacters={10}
                                text={`${poolData.tokens[0].symbol}/${poolData.tokens[1].symbol}`}
                            />
                        </TYPE.label>
                        <GreyBadge ml="10px" fontSize="12px">
                            {feeTierPercent(poolData.feeTier)}
                        </GreyBadge>
                    </RowFixed>
                    <RowFixed>
                        <TYPE.label mr="6px">{formatDollarAmount(poolData.volumeUSD)}</TYPE.label>
                        <Percent fontSize="14px" value={poolData.volumeUSDChange} />
                    </RowFixed>
                </AutoColumn>
            </Wrapper>
        </Container>
    );
};

export default function TopPoolMovers() {
    const allPools = useBalancerPools();

    const topVolume = useMemo(() => {
        return Object.values(allPools)
            .sort((a, b) => {
                return a && b ? (a?.volumeUSDChange > b?.volumeUSDChange ? -1 : 1) : -1;
            })
            .slice(0, Math.min(20, Object.values(allPools).length));
    }, [allPools]);

    if (Object.keys(allPools).length === 0) {
        return <Loader />;
    }

    return (
        <ScrollableX>
            {topVolume.map((entry) =>
                entry ? <DataCard key={'top-card-pool-' + entry.address} poolData={entry} /> : null,
            )}
        </ScrollableX>
    );
}
