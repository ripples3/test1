import { useState, useLayoutEffect, useMemo } from 'react';
import { shade } from 'polished';
import Vibrant from 'node-vibrant';
import { hex } from 'wcag-contrast';
import { Token, ChainId } from '@uniswap/sdk-core';
import uriToHttp from 'utils/uriToHttp';
import { isAddress } from 'utils';
import { SupportedNetwork } from 'constants/networks';
import { getTokenLogoURL } from 'components/CurrencyLogo';

async function getColorFromToken(token: Token, supportedNetwork?: SupportedNetwork): Promise<string | null> {
    
    if (token.chainId === ChainId.RINKEBY && token.address === '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735') {
        return Promise.resolve('#FAAB14');
    }

    
    let path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`;
    if (supportedNetwork) {
        path = getTokenLogoURL(token.address, supportedNetwork)
    }

    return Vibrant.from(path)
        .getPalette()
        .then((palette) => {
            if (palette?.Vibrant) {
                let detectedHex = palette.Vibrant.hex;
                let AAscore = hex(detectedHex, '#FFF');
                while (AAscore < 3) {
                    detectedHex = shade(0.005, detectedHex);
                    AAscore = hex(detectedHex, '#FFF');
                }
                return detectedHex;
            }
            return null;
        })
        .catch(() => null);
}

async function getColorFromUriPath(uri: string): Promise<string | null> {
    const formattedPath = uriToHttp(uri)[0];

    return Vibrant.from(formattedPath)
        .getPalette()
        .then((palette) => {
            if (palette?.Vibrant) {
                return palette.Vibrant.hex;
            }
            return null;
        })
        .catch(() => null);
}

export function useColor(address?: string, supportedNetwork?: SupportedNetwork) {
    const [color, setColor] = useState('#2172E5');
    const formattedAddress = isAddress(address);

    const token = useMemo(() => {
        return formattedAddress ? new Token(1, formattedAddress, 0) : undefined;
    }, [formattedAddress]);

    useLayoutEffect(() => {
        let stale = false;

        if (token) {
            getColorFromToken(token, supportedNetwork).then((tokenColor) => {
                if (!stale && tokenColor !== null) {
                    setColor(tokenColor);
                }
            });
        }

        return () => {
            stale = true;
            setColor('#2172E5');
        };
    }, [token]);

    return color;
}

export function useListColor(listImageUri?: string) {
    const [color, setColor] = useState('#2172E5');

    useLayoutEffect(() => {
        let stale = false;

        if (listImageUri) {
            getColorFromUriPath(listImageUri).then((color) => {
                if (!stale && color !== null) {
                    setColor(color);
                }
            });
        }

        return () => {
            stale = true;
            setColor('#2172E5');
        };
    }, [listImageUri]);

    return color;
}
