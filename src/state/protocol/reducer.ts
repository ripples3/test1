import { currentTimestamp } from './../../utils/index'
import { updateProtocolData } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { ChartDayData, Transaction } from 'types'
import { SupportedNetwork } from 'constants/networks'

export interface ProtocolData {
    volume24?: number;
    volumeChange?: number;
    fees24?: number;
    feesChange?: number;
    tvl?: number;
    tvlChange?: number;
    swaps24?: number;
}

export interface ProtocolState {
  [networkId: string]: {
    // timestamp for last updated fetch
    readonly lastUpdated: number | undefined
    // overview data
    readonly data: ProtocolData | undefined
    readonly chartData: ChartDayData[] | undefined
    readonly transactions: Transaction[] | undefined
  }
}

export const initialState: ProtocolState = {
  [SupportedNetwork.ETHEREUM]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    lastUpdated: undefined,
  },
  [SupportedNetwork.ARBITRUM]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    lastUpdated: undefined,
  },
  [SupportedNetwork.POLYGON]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    lastUpdated: undefined,
  },
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateProtocolData, (state, { payload: { protocolData, networkId } }) => {
      state[networkId].data = protocolData
      // mark when last updated
      state[networkId].lastUpdated = currentTimestamp()
    })
)