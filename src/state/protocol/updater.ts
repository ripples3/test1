import { useProtocolData, useProtocolChartData } from './hooks'
import { useEffect } from 'react'
import { useBalancerProtocolData } from 'data/balancer/useProtocolData'
import { useClients } from 'state/application/hooks'

export default function Updater(): null {
  // client for data fetching
  const { dataClient } = useClients()

  const [protocolData, updateProtocolData] = useProtocolData()
  const  data = useBalancerProtocolData()

  const [chartData, updateChartData] = useProtocolChartData()

  // update overview data if available and not set
  useEffect(() => {
    if (protocolData === undefined && data) {
      updateProtocolData(data)
    }
  }, [protocolData, updateProtocolData])

  return null
}