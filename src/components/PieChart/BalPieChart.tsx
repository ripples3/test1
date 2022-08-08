import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';
import Card from 'components/Card';
import { RowBetween } from 'components/Row';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useTheme from 'hooks/useTheme';
import { formatDollarAmount } from '../../utils/numbers';

dayjs.extend(utc);

const DEFAULT_HEIGHT = 300;

const Wrapper = styled(Card)`
  width: 100%;
  height: ${DEFAULT_HEIGHT}px;
  padding: 1rem;
  padding-right: 2rem;
  display: flex;
  background-color: ${({ theme }) => theme.bg0}
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`;

export type PieChartProps = {
    data: any[];
    color?: string | undefined;
    tokenSet: string[],
    height?: number | undefined;
    cxcy?: string[],
    minHeight?: number;
    setValue?: Dispatch<SetStateAction<number | undefined>>; // used for value on hover
    setLabel?: Dispatch<SetStateAction<string | undefined>>; // used for label of value
    value?: number;
    label?: string;
    topLeft?: ReactNode | undefined;
    topRight?: ReactNode | undefined;
    bottomLeft?: ReactNode | undefined;
    bottomRight?: ReactNode | undefined;
} & React.HTMLAttributes<HTMLDivElement>;


export const BalPieChart = ({
    data,
    color = '#56B2A4',
    tokenSet,
    cxcy = ['50%', '50%'],
    value,
    label,
    setValue,
    setLabel,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    minHeight = DEFAULT_HEIGHT,
    ...rest
}: PieChartProps) => {
    const theme = useTheme();
    const parsedValue = value;

    return (
        <Wrapper minHeight={minHeight} {...rest}>
            <RowBetween>
                {topLeft ?? null}
                {topRight ?? null}
            </RowBetween>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={minHeight} height={minHeight}>
                    <Pie
                        dataKey="value"
                        stroke="#959eb2"
                        isAnimationActive={true}
                        data={data}
                        cx={cxcy[0]}
                        cy={cxcy[1]}
                        innerRadius={35}
                        outerRadius={75}
                        paddingAngle={15}
                        //fill="#8884d8"
                        label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            index
                          }) => {
                            const RADIAN = Math.PI / 180;
                            // eslint-disable-next-line
                            const radius = 25 + innerRadius + (outerRadius - innerRadius);
                            // eslint-disable-next-line
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            // eslint-disable-next-line
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                            return (
                              <text
                                x={x}
                                y={y}
                                fill={data[index].fill}
                                fontSize='80%'
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                              >
                                {data[index].name}
                              </text>
                            );
                          }}
                    >
                    </Pie>
                    <Tooltip
                        cursor={{ stroke: theme.bg2 }}
                        formatter={(
                            value: number,
                            name: string,
                            props: { payload: { time: string; value: number } },
                        ) => {
                            if (setValue && parsedValue !== props.payload.value) {
                                setValue(props.payload.value);
                            }
                            const formattedTime = dayjs(props.payload.time).format('MMM D, YYYY');
                            if (setLabel && label !== formattedTime) setLabel(formattedTime);
                            return formatDollarAmount(value);
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <RowBetween>
                {bottomLeft ?? null}
                {bottomRight ?? null}
            </RowBetween>
        </Wrapper>
    );
};
