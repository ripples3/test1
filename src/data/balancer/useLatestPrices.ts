import { useActiveNetworkVersion } from 'state/application/hooks';
import { SupportedNetwork } from 'constants/networks';
import { useBalancerTokenPageData } from './useTokens';

//TODO: Network dependent address fetching!
const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

export const getBalTokenAddress = (networkId: SupportedNetwork) => {
    switch (networkId) {
      case SupportedNetwork.ETHEREUM:
        return '0xba100000625a3754423978a60c9317c58a424e3d';
      case SupportedNetwork.ARBITRUM:
        return '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8';
        
      case SupportedNetwork.POLYGON:
        return '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3';
      default:
        return '0xba100000625a3754423978a60c9317c58a424e3d';
    } 
  }

  export const getWethTokenAddress = (networkId: SupportedNetwork) => {
    switch (networkId) {
      case SupportedNetwork.ETHEREUM:
        return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
      case SupportedNetwork.ARBITRUM:
        return '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
      case SupportedNetwork.POLYGON:
        return '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619';
      default:
        return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    } 
  }



const reducer = (previousValue: number, currentValue: number) => previousValue + currentValue;

export function useLatestPrices(): { eth?: number; bal?: number } {

    const [activeNetwork] = useActiveNetworkVersion();
    //V2: latest price is not reliable, therefore get chartdata that has the correct USD value:
    const balTokenData = useBalancerTokenPageData(getBalTokenAddress(activeNetwork.id)).priceData;
    const wethTokenData = useBalancerTokenPageData(getWethTokenAddress(activeNetwork.id)).priceData;

    //const wethChartData = chartData;
    let bal = 0;
    let eth = 0;

    if (balTokenData.length >0 && wethTokenData.length > 0) {
      bal = balTokenData[balTokenData.length -1].value;
      eth = wethTokenData[wethTokenData.length-1].value;
    }

    return {
        eth: eth ? eth : undefined,
        bal: bal ? bal : undefined,
    };
}
