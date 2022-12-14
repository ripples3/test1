
import ARBITRUM_LOGO_URL from '../assets/images/arbitrum.svg'
import ETHEREUM_LOGO_URL from '../assets/images/ethereum-logo.png'
import POLYGON_LOGO_URL from '../assets/images/polygon-logo.png'
import { BALANCER_PRIMARY_COLOR, BALANCER_SECONDARY_COLOR } from '../data/balancer/constants';

export enum SupportedNetwork {
  ETHEREUM,
  ARBITRUM,
  POLYGON,
}

export type NetworkInfo = {
  id: SupportedNetwork
  chainId: string
  route: string
  name: string
  startTimeStamp: number
  clientUri: string
  appUri: string
  imageURL: string
  bgColor: string
  primaryColor: string
  secondaryColor: string
  blurb?: string
}

export const EthereumNetworkInfo: NetworkInfo = {
    id: SupportedNetwork.ETHEREUM,
    chainId: '1',
    route: '',
    name: 'Ethereum',
    startTimeStamp: 1619874000,
    appUri: 'https://app.balancer.fi/',
    clientUri: 'https://api.thegraph.com/subgraphs/name/xeonus/balancer-v2-analytics',
    bgColor: BALANCER_PRIMARY_COLOR,
    primaryColor: BALANCER_PRIMARY_COLOR,
    secondaryColor: BALANCER_SECONDARY_COLOR,
    imageURL: ETHEREUM_LOGO_URL,
}

export const ArbitrumNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.ARBITRUM,
  chainId: '42161',
  route: 'arbitrum',
  name: 'Arbitrum',
  startTimeStamp: 1619874000,
  appUri: 'https://arbitrum.balancer.fi/',
  clientUri: 'https://api.thegraph.com/subgraphs/name/xeonus/balancer-v2-analytics-arbitrum',
  imageURL: ARBITRUM_LOGO_URL,
  bgColor: '#0A294B',
  primaryColor: '#0490ED',
  secondaryColor: '#96BEDC',
  blurb: 'L2',
}

export const PolygonNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.POLYGON,
  chainId: '137',
  route: 'polygon',
  name: 'Polygon',
  startTimeStamp: 1619874000,
  appUri: 'https://polygon.balancer.fi/',
  clientUri: 'https://api.thegraph.com/subgraphs/name/xeonus/balancer-v2-analytics-polygon',
  bgColor: '#8247e5',
  primaryColor: '#8247e5',
  secondaryColor: '#FB7876',
  imageURL: POLYGON_LOGO_URL,
  blurb: 'Beta',
}

export const SUPPORTED_NETWORK_VERSIONS: NetworkInfo[] = [
  EthereumNetworkInfo,
  ArbitrumNetworkInfo,
  PolygonNetworkInfo,
]