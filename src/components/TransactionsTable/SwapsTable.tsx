import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DarkGreyCard } from 'components/Card';
import Loader from 'components/Loader';
import { AutoColumn } from 'components/Column';
import { formatAmount, formatDollarAmount } from 'utils/numbers';
import { getEtherscanLink, shortenAddress } from 'utils';
import { ClickableText, Label } from 'components/Text';
import { formatTime } from 'utils/date';
import { RowFixed } from 'components/Row';
import { ExternalLink, TYPE } from 'theme';
import { Arrow, Break, PageButtons } from 'components/shared';
import useTheme from 'hooks/useTheme';
import HoverInlineText from 'components/HoverInlineText';
import { useActiveNetworkVersion } from 'state/application/hooks';
import { BalancerSwapFragment } from '../../apollo/generated/graphql-codegen-generated';
import WhaleImage from '../../assets/svg/whale.svg';

const Wrapper = styled(DarkGreyCard)`
    width: 100%;
`;

const ResponsiveGrid = styled.div`
    display: grid;
    grid-gap: 1em;
    align-items: center;

    grid-template-columns: 1.5fr repeat(5, 1fr);

    @media screen and (max-width: 940px) {
        grid-template-columns: 1.5fr repeat(4, 1fr);
        & > *:nth-child(5) {
            display: none;
        }
    }

    @media screen and (max-width: 800px) {
        grid-template-columns: 1.5fr repeat(2, 1fr);
        & > *:nth-child(5) {
            display: none;
        }
        & > *:nth-child(3) {
            display: none;
        }
        & > *:nth-child(4) {
            display: none;
        }
    }

    @media screen and (max-width: 500px) {
        grid-template-columns: 1.5fr repeat(1, 1fr);
        & > *:nth-child(5) {
            display: none;
        }
        & > *:nth-child(3) {
            display: none;
        }
        & > *:nth-child(4) {
            display: none;
        }
        & > *:nth-child(2) {
            display: none;
        }
    }
`;

const SortText = styled.button<{ active: boolean }>`
    cursor: pointer;
    font-weight: ${({ active }) => (active ? 500 : 400)};
    margin-right: 0.75rem !important;
    border: none;
    background-color: transparent;
    font-size: 1rem;
    padding: 0px;
    color: ${({ active, theme }) => (active ? theme.text1 : theme.text3)};
    outline: none;
    @media screen and (max-width: 600px) {
        font-size: 14px;
    }
`;

const SORT_FIELD = {
    amountUSD: 'amountUSD',
    timestamp: 'timestamp',
    sender: 'sender',
    amountToken0: 'amountToken0',
    amountToken1: 'amountToken1',
};

const DataRow = ({ swap, color }: { swap: BalancerSwapFragment; color?: string }) => {
    const abs0 = Math.abs(parseFloat(swap.tokenAmountIn));
    const abs1 = Math.abs(parseFloat(swap.tokenAmountOut));
    const [activeNetwork] = useActiveNetworkVersion();
    const theme = useTheme();
    const value = parseFloat(swap.valueUSD);

    return (
        <ResponsiveGrid>
            <ExternalLink href={getEtherscanLink(1, swap.tx, 'transaction', activeNetwork)}>
                <Label color={color ?? theme.blue1} fontWeight={400}>
                    {`Swap ${swap.tokenInSym} for ${swap.tokenOutSym}`}
                    {value > 10000 ? <img src={WhaleImage} width={20} style={{ marginLeft: '4px' }} /> : null}
                </Label>
            </ExternalLink>
            <Label end={1} fontWeight={400}>
                {formatDollarAmount(value)}
            </Label>
            <Label end={1} fontWeight={400}>
                <HoverInlineText text={`${formatAmount(abs0)}  ${swap.tokenInSym}`} maxCharacters={16} />
            </Label>
            <Label end={1} fontWeight={400}>
                <HoverInlineText text={`${formatAmount(abs1)}  ${swap.tokenOutSym}`} maxCharacters={16} />
            </Label>
            <Label end={1} fontWeight={400}>
                <ExternalLink
                    href={getEtherscanLink(1, swap.userAddress.id, 'address', activeNetwork)}
                    style={{ color: color ?? theme.blue1 }}
                >
                    {shortenAddress(swap.userAddress.id)}
                </ExternalLink>
            </Label>
            <Label end={1} fontWeight={400}>
                {formatTime(`${swap.timestamp}`)}
            </Label>
        </ResponsiveGrid>
    );
};

export default function SwapsTable({
    swaps,
    maxItems = 10,
    color,
}: {
    swaps: BalancerSwapFragment[];
    maxItems?: number;
    color?: string;
}) {
    // theming
    const theme = useTheme();

    // for sorting
    const [sortField, setSortField] = useState(SORT_FIELD.timestamp);
    const [sortDirection, setSortDirection] = useState<boolean>(true);

    // pagination
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {
        let extraPages = 1;
        if (swaps.length % maxItems === 0) {
            extraPages = 0;
        }
        setMaxPage(Math.floor(swaps.length / maxItems) + extraPages);
    }, [maxItems, swaps]);

    const sortedTransactions = useMemo(() => {
        return swaps
            ? swaps
                  .slice()
                  .sort((a, b) => {
                      if (a && b) {
                          return a[sortField as keyof BalancerSwapFragment] > b[sortField as keyof BalancerSwapFragment]
                              ? (sortDirection ? -1 : 1) * 1
                              : (sortDirection ? -1 : 1) * -1;
                      } else {
                          return -1;
                      }
                  })
                  .slice(maxItems * (page - 1), page * maxItems)
            : [];
    }, [swaps, maxItems, page, sortField, sortDirection]);

    const handleSort = useCallback(
        (newField: string) => {
            setSortField(newField);
            setSortDirection(sortField !== newField ? true : !sortDirection);
        },
        [sortDirection, sortField],
    );

    const arrow = useCallback(
        (field: string) => {
            return sortField === field ? (!sortDirection ? '↑' : '↓') : '';
        },
        [sortDirection, sortField],
    );

    if (!swaps) {
        return <Loader />;
    }

    return (
        <Wrapper>
            <AutoColumn gap="12px">
                <ResponsiveGrid>
                    <RowFixed></RowFixed>
                    <ClickableText color={theme.text2} onClick={() => handleSort(SORT_FIELD.amountUSD)} end={1}>
                        Total Value {arrow(SORT_FIELD.amountUSD)}
                    </ClickableText>
                    <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.amountToken0)}>
                        Token Amount {arrow(SORT_FIELD.amountToken0)}
                    </ClickableText>
                    <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.amountToken1)}>
                        Token Amount {arrow(SORT_FIELD.amountToken1)}
                    </ClickableText>
                    <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.sender)}>
                        Account {arrow(SORT_FIELD.sender)}
                    </ClickableText>
                    <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.timestamp)}>
                        Time {arrow(SORT_FIELD.timestamp)}
                    </ClickableText>
                </ResponsiveGrid>
                <Break />

                {sortedTransactions.map((swap, i) => {
                    if (swap) {
                        return (
                            <React.Fragment key={i}>
                                <DataRow swap={swap} color={color} />
                                <Break />
                            </React.Fragment>
                        );
                    }
                    return null;
                })}
                {sortedTransactions.length === 0 ? <TYPE.main>No Transactions</TYPE.main> : undefined}
                <PageButtons>
                    <div
                        onClick={() => {
                            setPage(page === 1 ? page : page - 1);
                        }}
                    >
                        <Arrow faded={page === 1 ? true : false}>←</Arrow>
                    </div>
                    <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
                    <div
                        onClick={() => {
                            setPage(page === maxPage ? page : page + 1);
                        }}
                    >
                        <Arrow faded={page === maxPage ? true : false}>→</Arrow>
                    </div>
                </PageButtons>
            </AutoColumn>
        </Wrapper>
    );
}
