import React, { Dispatch, SetStateAction, ReactNode } from 'react';
import { Bar, BarChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled from 'styled-components';
import Card from 'components/Card';
import { RowBetween } from 'components/Row';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useTheme from 'hooks/useTheme';
import { darken } from 'polished';
import { formatAmount, formatDollarAmount } from 'utils/numbers';
import getChartColor from '../../utils/getChartColor';
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

const CustomBar = ({
    x,
    y,
    width,
    height,
    fill,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}) => {
    return (
        <g>
            <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
        </g>
    );
};

export type LineChartProps = {
    data: any[];
    color?: string | undefined;
    tokenSet: string[],
    isDollarAmount?: boolean,
    height?: number | undefined;
    minHeight?: number;
    value?: number;
    label?: string;
    topLeft?: ReactNode | undefined;
    topRight?: ReactNode | undefined;
    bottomLeft?: ReactNode | undefined;
    bottomRight?: ReactNode | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

const BarChartStacked = ({
    data,
    color = '#56B2A4',
    tokenSet,
    isDollarAmount,
    value,
    label,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    minHeight = DEFAULT_HEIGHT,
    ...rest
}: LineChartProps) => {
    const theme = useTheme();
    const parsedValue = value;
    const now = dayjs();

    return (
        <Wrapper minHeight={minHeight} {...rest}>
            <RowBetween>
                {topLeft ?? null}
                {topRight ?? null}
            </RowBetween>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 25,
                        bottom: 5,
                    }}
                >
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(time) => dayjs(time).format('DD.MM.YY')}
                        minTickGap={10}
                    />
                    <YAxis 
                    allowDataOverflow={true} 
                    tickFormatter={(entry) => isDollarAmount ? formatDollarAmount(entry): formatAmount(entry)}
                    />
                    <Legend />
                    <Tooltip
                    contentStyle={{ backgroundColor: "#191B1F" }}
                    formatter={(value:number) => isDollarAmount ?formatDollarAmount(value) : formatAmount(value)}
                    labelFormatter={(time) => {
                        const isCurrent = dayjs(time).add(1, 'week').isAfter(now);
                        return dayjs(time).format('DD.MM.YY') + ' - ' + (isCurrent ? 'today' : dayjs(time).add(1, 'week').format('DD.MM.YY'))}}
                    />
                   { tokenSet.map((el) => 
                    <Bar 
                    key={el} 
                    dataKey={el} 
                    stackId="a" 
                    stroke={getChartColor(el, tokenSet.indexOf(el))} 
                    fill={getChartColor(el, tokenSet.indexOf(el))} 
                    strokeWidth={2}
                    shape={(props) => {
                        return (
                            <CustomBar
                                height={props.height}
                                width={props.width}
                                x={props.x}
                                y={props.y}
                                fill={getChartColor(el, tokenSet.indexOf(el))}
                            />
                        );
                    }} 
                    />
                    )}
                </BarChart>
            </ResponsiveContainer>
            <RowBetween>
                {bottomLeft ?? null}
                {bottomRight ?? null}
            </RowBetween>
        </Wrapper>
    );
};

export default BarChartStacked;
