import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getChartColorsForDataset, getChartAxisTypography } from '@/utils/chartColors';
import styles from './Chart.module.css';

export interface ChartDataPoint {
  name?: string;
  y?: number;
  x?: number | string;
  [key: string]: unknown;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[] | number[];
  type?: string;
  [key: string]: unknown;
}

export interface ChartProps {
  type: 'line' | 'bar' | 'column' | 'pie' | 'area' | 'scatter' | 'spline' | 'donut';
  series: ChartSeries[];
  title?: string;
  xAxis?: {
    title?: string;
    categories?: string[];
    [key: string]: unknown;
  };
  yAxis?: {
    title?: string;
    [key: string]: unknown;
  };
  responsive?: boolean;
  customOptions?: Partial<Highcharts.Options>;
  className?: string;
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({
  type,
  series,
  title,
  xAxis,
  yAxis,
  responsive = true,
  customOptions = {},
  className,
  height = 400,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const axisTypography = getChartAxisTypography();

  const getColorCount = () => {
    if ((type === 'pie' || type === 'donut') && series.length > 0 && Array.isArray(series[0].data)) {
      return series[0].data.length;
    }
    return series.length;
  };

  const chartColors = getChartColorsForDataset(getColorCount());
  const actualType = type === 'donut' ? 'pie' : type;

  const styledSeries = series.map((serie, index) => {
    const serieType = serie.type || actualType;

    if ((serieType === 'pie' || type === 'donut') && Array.isArray(serie.data)) {
      const dataWithColors = serie.data.map((dataPoint, dataIndex) => {
        if (typeof dataPoint === 'object' && dataPoint !== null) {
          return {
            ...dataPoint,
            color: chartColors[dataIndex % chartColors.length]
          };
        }
        return dataPoint;
      });

      return {
        ...serie,
        data: dataWithColors,
        type: 'pie' as const,
        innerSize: type === 'donut' ? '50%' : undefined,
      };
    }

    return {
      ...serie,
      color: chartColors[index],
      type: serieType,
    };
  });

  const defaultOptions: Highcharts.Options = {
    chart: {
      type: actualType,
      height: height,
      backgroundColor: 'transparent',
      style: { fontFamily: axisTypography.fontFamily },
    },
    title: {
      text: title || '',
      style: {
        fontSize: '16px',
        fontWeight: '600',
        color: axisTypography.color,
      },
    },
    colors: chartColors,
    xAxis: {
      categories: xAxis?.categories,
      title: {
        text: xAxis?.title || '',
        style: {
          fontSize: axisTypography.fontSize,
          fontFamily: axisTypography.fontFamily,
          fontWeight: axisTypography.fontWeight,
          color: axisTypography.color,
        },
      },
      labels: {
        style: {
          fontSize: axisTypography.fontSize,
          fontFamily: axisTypography.fontFamily,
          fontWeight: axisTypography.fontWeight,
          color: axisTypography.color,
        },
      },
    },
    yAxis: {
      title: {
        text: yAxis?.title || '',
        style: {
          fontSize: axisTypography.fontSize,
          fontFamily: axisTypography.fontFamily,
          fontWeight: axisTypography.fontWeight,
          color: axisTypography.color,
        },
      },
      labels: {
        style: {
          fontSize: axisTypography.fontSize,
          fontFamily: axisTypography.fontFamily,
          fontWeight: axisTypography.fontWeight,
          color: axisTypography.color,
        },
      },
    },
    legend: {
      itemStyle: {
        fontSize: axisTypography.fontSize,
        fontFamily: axisTypography.fontFamily,
        fontWeight: axisTypography.fontWeight,
        color: axisTypography.color,
      },
    },
    tooltip: {
      style: {
        fontSize: axisTypography.fontSize,
        fontFamily: axisTypography.fontFamily,
        fontWeight: axisTypography.fontWeight,
        color: axisTypography.color,
      },
    },
    plotOptions: {
      series: { animation: { duration: 300 } },
    },
    series: styledSeries as Highcharts.SeriesOptionsType[],
    credits: { enabled: false },
    responsive: responsive ? {
      rules: [{
        condition: { maxWidth: 500 },
        chartOptions: {
          legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' },
        },
      }],
    } : undefined,
  };

  const finalOptions = { ...defaultOptions, ...customOptions };

  return (
    <div
      className={`${styles.chartContainer} ${className || ''}`}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={finalOptions} />
    </div>
  );
};

export default Chart;

