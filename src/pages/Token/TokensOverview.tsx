import React, { useEffect } from 'react';
import { PageWrapper } from 'pages/styled';
import { AutoColumn } from 'components/Column';
import { HideSmall, TYPE } from 'theme';
import TokenTable from 'components/tokens/TokenTable';
import { useSavedTokens } from 'state/user/hooks';
import { DarkGreyCard } from 'components/Card';
import TopTokenMovers from 'components/tokens/TopTokenMovers';
import { useBalancerTokens } from '../../data/balancer/useTokens';

export default function TokensOverview() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [savedTokens] = useSavedTokens();
    const formattedTokens = useBalancerTokens();
    const watchListTokens = formattedTokens.filter((token) => savedTokens.includes(token.address));

    return (
        <PageWrapper>
            <AutoColumn gap="lg">
                <TYPE.main>Your Watchlist</TYPE.main>
                {savedTokens.length > 0 ? (
                    <TokenTable tokenDatas={watchListTokens} />
                ) : (
                    <DarkGreyCard>
                        <TYPE.main>Saved tokens will appear here</TYPE.main>
                    </DarkGreyCard>
                )}
                <HideSmall>
                    <DarkGreyCard style={{ paddingTop: '12px' }}>
                        <AutoColumn gap="md">
                            <TYPE.mediumHeader fontSize="16px">Top Movers</TYPE.mediumHeader>
                            <TopTokenMovers tokenDatas={formattedTokens} />
                        </AutoColumn>
                    </DarkGreyCard>
                </HideSmall>
                <TYPE.main>All Tokens</TYPE.main>
                <TokenTable tokenDatas={formattedTokens} />
            </AutoColumn>
        </PageWrapper>
    );
}
