import React from 'react';
import styled from 'styled-components';
import { AutoRow, RowBetween, RowFixed } from 'components/Row';
import { ExternalLink, TYPE } from 'theme';
import { formatDollarAmount } from 'utils/numbers';
import Polling from './Polling';
import { useLatestPrices } from '../../data/balancer/useLatestPrices';
import { BALANCER_APP_LINK, BALANCER_DOCS_LINK } from '../../data/balancer/constants';
import { BALANCER_BACKGROUND_IMAGE } from '../../data/balancer/constants';

const Wrapper = styled.div`
    width: 100%;
    background-color: ${({ theme }) => theme.black};
    padding: 10px 20px;
    background-image: url(${BALANCER_BACKGROUND_IMAGE});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
`;

const StyledPolling = styled.div`
    display: flex;
    color: white;
    border-radius: 4px;
    padding: 4px;
    background-color: ${({ theme }) => theme.bg2};
    transition: opacity 0.25s ease;
    color: ${({ theme }) => theme.green1};
    :hover {
        opacity: 1;
    }
    z-index: 9999;

    ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`;


const Item = styled(TYPE.main)`
    font-size: 12px;
`;

const StyledLink = styled(ExternalLink)`
    font-size: 12px;
    color: ${({ theme }) => theme.text1};
`;

const TopBar = () => {
    const { eth, bal } = useLatestPrices();

    return (
        <Wrapper>
            <RowBetween>
                <Polling />
                <AutoRow gap="6px">
                    <RowFixed>
                        <StyledPolling>
                        <Item>ETH:</Item>
                        <Item fontWeight="700" ml="4px">
                            {formatDollarAmount(eth)}
                        </Item>
                        </StyledPolling>
                    </RowFixed>
                    <RowFixed>
                    <StyledPolling>
                        <Item>BAL:</Item>
                        <Item fontWeight="700" ml="4px">
                            {formatDollarAmount(bal)}
                        </Item>
                        </StyledPolling>
                    </RowFixed>
                </AutoRow>
                <AutoRow gap="6px" style={{ justifyContent: 'flex-end' }}>
                    <StyledLink href={BALANCER_DOCS_LINK}>Docs</StyledLink>
                    <StyledLink href={BALANCER_APP_LINK}>App</StyledLink>
                </AutoRow>
            </RowBetween>
        </Wrapper>
    );
};

export default TopBar;
