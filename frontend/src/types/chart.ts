export interface ChartConfig {
  title: {
    text: string;
    left: 'left' | 'center' | 'right';
    textStyle: {
      color: string;
      fontSize: number;
      fontWeight: 'normal' | 'bold' | 'bolder' | 'lighter';
    };
  };
  tooltip: {
    trigger: 'axis' | 'item';
    show: boolean;
    backgroundColor: string;
    textStyle: {
      color: string;
    };
    formatter?: string | ((params: any) => string);
  };
  legend: {
    data: string[];
    position: 'top' | 'bottom' | 'left' | 'right';
    show: boolean;
    textStyle: {
      color: string;
      fontSize: number;
    };
    itemGap: number;
    icon: 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow';
    itemWidth: number;
    itemHeight: number;
    padding: [number, number, number, number];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };
  grid: {
    left: string;
    right: string;
    bottom: string;
    top: string;
    containLabel: boolean;
    show: boolean;
    borderColor: string;
  };
  xAxis: XAxisConfig;
  yAxis: YAxisConfig;
  toolbox: {
    show: boolean;
    position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
    backgroundColor: string;
    feature: {
      saveAsImage: {};
      dataZoom: {
        show: boolean;
      };
      restore: {
        show: boolean;
      };
    };
  };
  animation: boolean;
  animationDuration: number;
  animationEasing: 'linear' | 'quadraticIn' | 'quadraticOut' | 'quadraticInOut' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'quarticIn' | 'quarticOut' | 'quarticInOut' | 'quinticIn' | 'quinticOut' | 'quinticInOut' | 'sinusoidalIn' | 'sinusoidalOut' | 'sinusoidalInOut' | 'exponentialIn' | 'exponentialOut' | 'exponentialInOut' | 'circularIn' | 'circularOut' | 'circularInOut' | 'elasticIn' | 'elasticOut' | 'elasticInOut' | 'backIn' | 'backOut' | 'backInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut';
  animationDelay: number;
  animationDurationUpdate: number;
  animationEasingUpdate: 'linear' | 'quadraticIn' | 'quadraticOut' | 'quadraticInOut' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'quarticIn' | 'quarticOut' | 'quarticInOut' | 'quinticIn' | 'quinticOut' | 'quinticInOut' | 'sinusoidalIn' | 'sinusoidalOut' | 'sinusoidalInOut' | 'exponentialIn' | 'exponentialOut' | 'exponentialInOut' | 'circularIn' | 'circularOut' | 'circularInOut' | 'elasticIn' | 'elasticOut' | 'elasticInOut' | 'backIn' | 'backOut' | 'backInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut';
  series: SeriesConfig[];
  backgroundColor: string;
  padding: [number, number, number, number];
  dataZoom: DataZoomConfig[];
}

export interface XAxisConfig {
  type: 'category' | 'value';
  boundaryGap: boolean;
  name: string;
  nameTextStyle: {
    color: string;
    fontSize: number;
  };
  data: string[];
  axisLine: {
    lineStyle: {
      color: string;
      width: number;
      type: 'solid' | 'dashed' | 'dotted';
    };
  };
  axisLabel: {
    color: string;
    fontSize: number;
    rotate: number;
    padding: [number, number, number, number];
  };
  axisTick: {
    show: boolean;
    lineStyle: {
      color: string;
      width: number;
    };
    length: number;
  };
  splitLine: {
    show: boolean;
    lineStyle: {
      color: string;
      type: 'solid' | 'dashed' | 'dotted';
    };
  };
}

export interface YAxisConfig {
  type: 'value';
  name: string;
  nameTextStyle: {
    color: string;
    fontSize: number;
  };
  min: number | null;
  max: number | null;
  splitNumber: number;
  axisLine: {
    lineStyle: {
      color: string;
      width: number;
      type: 'solid' | 'dashed' | 'dotted';
    };
  };
  axisLabel: {
    color: string;
    fontSize: number;
    padding: [number, number, number, number];
  };
  axisTick: {
    show: boolean;
    lineStyle: {
      color: string;
      width: number;
    };
    length: number;
  };
  splitLine: {
    show: boolean;
    lineStyle: {
      color: string;
      type: 'solid' | 'dashed' | 'dotted';
    };
  };
}

export interface SeriesConfig {
  name: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'gauge';
  data: number[] | { value: number; name: string }[];
  smooth?: boolean;
  itemStyle: {
    color: string;
  };
  lineStyle?: {
    width: number;
  };
  label: {
    show: boolean;
    color: string;
    fontSize: number;
    position: 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'outside';
  };
  barWidth?: number | string;
  emphasis: {
    itemStyle: {
      scale: boolean;
      scaleSize: number;
    };
  };
  radius?: string | string[];
  center?: [string, string];
  min?: number;
  max?: number;
  splitNumber?: number;
  startAngle?: number;
  endAngle?: number;
}

export interface DataZoomConfig {
  type: 'inside';
  xAxisIndex: number;
  zoomOnMouseWheel: boolean;
  moveOnMouseMove: boolean;
  moveOnMouseWheel: boolean;
}

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'gauge';

export interface ConfigPanelState {
  basic: boolean;
  global: boolean;
  axis: boolean;
  legend: boolean;
  series: boolean;
  animation: boolean;
  advanced: boolean;
}