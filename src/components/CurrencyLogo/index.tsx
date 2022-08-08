import React, { useMemo } from 'react'
import styled from 'styled-components'
import { isAddress } from 'utils'
import Logo from '../Logo'
import { useCombinedActiveList } from 'state/lists/hooks'
import useHttpLocations from 'hooks/useHttpLocations'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { EthereumNetworkInfo, SupportedNetwork } from 'constants/networks'

//TODO: Refactor with uni-v3 tokenlist nesting methods
export const getTokenLogoURL = (address: string, networkId: SupportedNetwork) => {
    switch (networkId) {
      case SupportedNetwork.ETHEREUM:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
      case SupportedNetwork.ARBITRUM:
        if (address === '0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8') {
          return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png`
        } else {
        return `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/arbitrum/assets/${address}/logo.png`
        }
      case SupportedNetwork.POLYGON:
        if (address === '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3') {
          return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png`
        } else {
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/${address}/logo.png`
        }
      default:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
    }
  }

const StyledLogo = styled(Logo) <{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.text4};
`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export default function CurrencyLogo({
  address,
  size = '24px',
  style,
  ...rest
}: {
  address?: string
  size?: string
  style?: React.CSSProperties
}) {
  // useOptimismList()
  const arbitrumList = useCombinedActiveList()?.[42161]
  
  const polygonList = useCombinedActiveList()?.[137]

  const [activeNetwork] = useActiveNetworkVersion()

  let assetLoc = 'master';
  if (activeNetwork !== EthereumNetworkInfo) {
    assetLoc = 'refactor-for-multichain'
  }

  const checkSummed = isAddress(address)

  const polygonURI = useMemo(() => {
    if (checkSummed && polygonList?.[checkSummed]) {
      return polygonList?.[checkSummed].token.logoURI
    }
    return undefined
  }, [checkSummed, polygonList])
  const uriLocationsPolygon = useHttpLocations(polygonURI)

  const arbitrumURI = useMemo(() => {
    if (checkSummed && arbitrumList?.[checkSummed]) {
      return arbitrumList?.[checkSummed].token.logoURI
    }
    return undefined
  }, [checkSummed, arbitrumList])
  const uriLocationsArbitrum = useHttpLocations(arbitrumURI)

  //Secondary assets are loaded through Balancer
  const tempSources: { [address: string]: string } = useMemo(() => {
    return {
      [`${address}`]:
        `https://raw.githubusercontent.com/balancer-labs/assets/${assetLoc}/assets/${address}.png`,
    }
  }, [])

  const srcs: string[] = useMemo(() => {
    const checkSummed = isAddress(address)


    if (checkSummed && address) {
      const override = tempSources[address]
      return [getTokenLogoURL(checkSummed, activeNetwork.id), ...uriLocationsPolygon, ...uriLocationsArbitrum, override]
    }
    return []
  }, [address, tempSources, uriLocationsArbitrum, uriLocationsPolygon])


  return <StyledLogo size={size} srcs={srcs} alt={'token logo'} style={style} {...rest} />
}
