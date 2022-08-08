import { useEffect, useState } from "react";
import { Incentives } from "data/balancer/balancerTypes";
import { ChainIncentives } from "data/balancer/balancerTypes";

const url = "https://raw.githubusercontent.com/balancer-labs/frontend-v2/master/src/lib/utils/liquidityMining/MultiTokenLiquidityMining.json";

export function GetIncentiveList () {
        const [jsonData, setJsonData] = useState("");
        //Fetch Balancer Front-End Json containing incentives data:
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(url);
                    const json = await response.json();
                    setJsonData(json);
                    //Find newest week and store it in global data state
                    
                } catch (error) {
                    console.log("error", error);
                }
            };
    
            fetchData();
        }, []);

        //Map jsonData to new Interface cain -> pool -> [...weeks] ... [tokenAddress, amount]
        //let incentiveArray = <ChainIncentives>

    return jsonData;
}