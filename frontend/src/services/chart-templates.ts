import { ChartConfig } from '../types/chart';

export const chartTemplates: Record<string, ChartConfig> = {
  // 折线图模板
  'line-basic': {
    title: {
      text: '基础折线图',
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      backgroundColor: '#ffffff',
      textStyle: {
        color: '#1e293b'
      }
    },
    legend: {
      data: ['销售额', '利润'],
      position: 'bottom',
      show: true,
      textStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      itemGap: 15,
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      padding: [10, 10, 10, 10],
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
      show: true,
      borderColor: 'transparent'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: '月份',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        rotate: 0,
        padding: [5, 3, 5, 3]
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        },
        length: 5
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '金额（万元）',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      min: null,
      max: null,
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        padding: [5, 3, 5, 3]
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        },
        length: 5
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    toolbox: {
      show: true,
      position: 'right-top',
      backgroundColor: 'transparent',
      feature: {
        saveAsImage: {},
        dataZoom: {
          show: true
        },
        restore: {
          show: true
        }
      }
    },
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    animationDelay: 0,
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicOut',
    series: [
      {
        name: '销售额',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        smooth: true,
        itemStyle: {
          color: '#3b82f6'
        },
        lineStyle: {
          width: 3
        },
        label: {
          show: false,
          color: '#1e293b',
          fontSize: 11,
          position: 'top'
        },
        barWidth: 20,
        emphasis: {
          itemStyle: {
            scale: true,
            scaleSize: 10
          }
        }
      },
      {
        name: '利润',
        type: 'line',
        data: [620, 732, 701, 734, 1090, 1130, 1120],
        smooth: true,
        itemStyle: {
          color: '#10b981'
        },
        lineStyle: {
          width: 3
        },
        label: {
          show: false,
          color: '#1e293b',
          fontSize: 11,
          position: 'top'
        },
        barWidth: 20,
        emphasis: {
          itemStyle: {
            scale: true,
            scaleSize: 10
          }
        }
      }
    ],
    backgroundColor: '#ffffff',
    padding: [20, 30, 30, 30],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: true
      }
    ]
  },

  // 柱状图模板
  'bar-basic': {
    title: {
      text: '基础柱状图',
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      backgroundColor: '#ffffff',
      textStyle: {
        color: '#1e293b'
      }
    },
    legend: {
      data: ['产品A', '产品B', '产品C'],
      position: 'top',
      show: true,
      textStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      itemGap: 15,
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      padding: [10, 10, 10, 10],
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
      show: true,
      borderColor: 'transparent'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      name: '季度',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      data: ['Q1', 'Q2', 'Q3', 'Q4'],
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        rotate: 0,
        padding: [5, 3, 5, 3]
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        },
        length: 5
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '销量（件）',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      min: null,
      max: null,
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        padding: [5, 3, 5, 3]
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        },
        length: 5
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    toolbox: {
      show: true,
      position: 'right-top',
      backgroundColor: 'transparent',
      feature: {
        saveAsImage: {},
        dataZoom: {
          show: false
        },
        restore: {
          show: true
        }
      }
    },
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    animationDelay: 0,
    animationDurationUpdate: 800,
    animationEasingUpdate: 'cubicOut',
    series: [
      {
        name: '产品A',
        type: 'bar',
        data: [120, 132, 101, 134],
        smooth: false,
        itemStyle: {
          color: '#3b82f6'
        },
        lineStyle: {
          width: 2
        },
        label: {
          show: true,
          color: '#1e293b',
          fontSize: 11,
          position: 'top'
        },
        barWidth: '30%',
        emphasis: {
          itemStyle: {
            scale: true,
            scaleSize: 5
          }
        }
      },
      {
        name: '产品B',
        type: 'bar',
        data: [220, 182, 191, 234],
        smooth: false,
        itemStyle: {
          color: '#10b981'
        },
        lineStyle: {
          width: 2
        },
        label: {
          show: true,
          color: '#1e293b',
          fontSize: 11,
          position: 'top'
        },
        barWidth: '30%',
        emphasis: {
          itemStyle: {
            scale: true,
            scaleSize: 5
          }
        }
      },
      {
        name: '产品C',
        type: 'bar',
        data: [150, 232, 201, 154],
        smooth: false,
        itemStyle: {
          color: '#f59e0b'
        },
        lineStyle: {
          width: 2
        },
        label: {
          show: true,
          color: '#1e293b',
          fontSize: 11,
          position: 'top'
        },
        barWidth: '30%',
        emphasis: {
          itemStyle: {
            scale: true,
            scaleSize: 5
          }
        }
      }
    ],
    backgroundColor: '#ffffff',
    padding: [20, 30, 30, 30],
    dataZoom: []
  },

  // 饼图模板
  'pie-basic': {
    title: {
      text: '基础饼图',
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      show: true,
      backgroundColor: '#ffffff',
      textStyle: {
        color: '#1e293b'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
      position: 'bottom',
      show: true,
      textStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      itemGap: 15,
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      padding: [10, 10, 10, 10],
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
      show: true,
      borderColor: 'transparent'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: 'X轴',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      data: [],
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        rotate: 0,
        padding: [5, 3, 5, 3]
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        },
        length: 5
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Y轴',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      min: null,
      max: null,
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        padding: [5, 3, 5, 3]
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        },
        length: 5
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    toolbox: {
      show: true,
      position: 'right-top',
      backgroundColor: 'transparent',
      feature: {
        saveAsImage: {},
        dataZoom: {
          show: false
        },
        restore: {
          show: true
        }
      }
    },
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    animationDelay: 0,
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicOut',
    series: [
      {
        name: '访问来源',
        type: 'pie',
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' }
        ],
        smooth: false,
        itemStyle: {
          color: '#3b82f6'
        },
        lineStyle: {
          width: 2
        },
        label: {
          show: true,
          color: '#1e293b',
          fontSize: 11,
          position: 'outside'
        },
        barWidth: 20,
        emphasis: {
          itemStyle: {
            scale: true,
            scaleSize: 10
          }
        },
        radius: ['40%', '70%'],
        center: ['50%', '50%']
      }
    ],
    backgroundColor: '#ffffff',
    padding: [20, 30, 30, 30],
    dataZoom: []
  }
};

export const getTemplateList = () => {
  return Object.keys(chartTemplates).map(key => ({
    key,
    name: chartTemplates[key].title.text,
    type: chartTemplates[key].series[0]?.type || 'unknown'
  }));
};

export const getTemplate = (templateKey: string): ChartConfig | null => {
  return chartTemplates[templateKey] || null;
};