import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { TYPE } from 'theme';
import { DarkGreyCard } from 'components/Card';
import Loader, { LoadingRows } from 'components/Loader';
import { Link } from 'react-router-dom';
import { AutoColumn } from 'components/Column';
import CurrencyLogo from 'components/CurrencyLogo';
import { formatDollarAmount } from 'utils/numbers';
import { Label, ClickableText } from '../Text';
import { PageButtons, Arrow, Break } from 'components/shared';
import useTheme from 'hooks/useTheme';
import {AssetData } from '../../data/balancer/balancerTypes';




const Wrapper = styled(DarkGreyCard)`
    width: 100%;
`;

const ResponsiveGrid = styled.div`
    display: grid;
    grid-gap: 1em;
    align-items: center;

    grid-template-columns: 20px 3fr repeat(3, 1fr);

    @media screen and (max-width: 900px) {
        grid-template-columns: 20px 1.5fr repeat(3, 1fr);
        & :nth-child(4) {
            display: none;
        }
    }

    @media screen and (max-width: 800px) {
        grid-template-columns: 20px 1.5fr repeat(2, 1fr);
        & :nth-child(6) {
            display: none;
        }
    }

    @media screen and (max-width: 670px) {
        grid-template-columns: repeat(2, 1fr);
        > *:first-child {
            display: none;
        }
        > *:nth-child(3) {
            display: none;
        }
    }
`;

const LinkWrapper = styled(Link)`
    text-decoration: none;
    :hover {
        cursor: pointer;
        opacity: 0.7;
    }
`;

const ResponsiveLogo = styled(CurrencyLogo)`
    @media screen and (max-width: 670px) {
        width: 16px;
        height: 16px;
    }
`;

const DataRow = ({ assetData, index }: { assetData: AssetData; index: number }) => {
    const theme = useTheme();
    return (
            <ResponsiveGrid>
                <Label>{index + 1}</Label>
                <Label fontWeight={400}>
                    {assetData.name}
                </Label>
                <Label fontWeight={400}>
                    {assetData.type}
                </Label>
                <Label end={1} fontWeight={400}>
                {Number(assetData.relativeWeight).toFixed(2) + '%'}
                </Label>
                <Label end={1} fontWeight={400}>
                    {formatDollarAmount(assetData.valueUSD)}
                </Label>
            </ResponsiveGrid>
    );
};

const SORT_FIELD = {
    name: 'name',
    type: 'type',
    relativeWeight: 'relativeWeight',
    valueUSD: 'valueUSD',
};

const MAX_ITEMS = 10;

export default function TreasuryAssetTable({
    assetDatas,
    maxItems = MAX_ITEMS,
}: {
    assetDatas: AssetData[] | undefined;
    maxItems?: number;
}) {
    // theming
    const theme = useTheme();

    // for sorting
    const [sortField, setSortField] = useState(SORT_FIELD.valueUSD);
    const [sortDirection, setSortDirection] = useState<boolean>(true);

    // pagination
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    useEffect(() => {
        let extraPages = 1;
        if (assetDatas) {
            if (assetDatas.length % maxItems === 0) {
                extraPages = 0;
            }
            setMaxPage(Math.floor(assetDatas.length / maxItems) + extraPages);
        }
    }, [maxItems, assetDatas]);

    const sortedTokens = useMemo(() => {
        return assetDatas
            ? assetDatas
                .filter((x) => !!x )
                .sort((a, b) => {
                    if (a && b) {
                        return a[sortField as keyof AssetData] > b[sortField as keyof AssetData]
                            ? (sortDirection ? -1 : 1) * 1
                            : (sortDirection ? -1 : 1) * -1;
                    } else {
                        return -1;
                    }
                })
                .slice(maxItems * (page - 1), page * maxItems)
            : [];
    }, [assetDatas, maxItems, page, sortDirection, sortField]);

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

    if (!assetDatas) {
        return <Loader />;
    }

    return (
        <Wrapper>
            {sortedTokens.length > 0 ? (
                <AutoColumn gap="8px">
                    <ResponsiveGrid>
                        <Label color={theme.text2}>#</Label>
                        <ClickableText color={theme.text2} onClick={() => handleSort(SORT_FIELD.name)}>
                            Name {arrow(SORT_FIELD.name)}
                        </ClickableText>
                        <ClickableText color={theme.text2} onClick={() => handleSort(SORT_FIELD.type)}>
                            Type {arrow(SORT_FIELD.type)}
                        </ClickableText>
                        <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.relativeWeight)}>
                            Weight {arrow(SORT_FIELD.relativeWeight)}
                        </ClickableText>
                        <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.valueUSD)}>
                            Value {arrow(SORT_FIELD.valueUSD)}
                        </ClickableText>
                    </ResponsiveGrid>
                    <Break />
                    {sortedTokens.map((data, i) => {
                        if (data) {
                            return (
                                <React.Fragment key={i}>
                                    <DataRow index={(page - 1) * MAX_ITEMS + i} assetData={data} />
                                    <Break />
                                </React.Fragment>
                            );
                        }
                        return null;
                    })}
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
            ) : (
                <LoadingRows>
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                </LoadingRows>
            )}
        </Wrapper>
    );
}
