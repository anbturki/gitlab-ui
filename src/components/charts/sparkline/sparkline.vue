<script>
import merge from 'lodash/merge';
import Chart from '../chart/chart.vue';
import ChartTooltip from '../tooltip/tooltip.vue';

import defaultChartOptions, {
  mergeSeriesToOptions,
  symbolSize,
} from '../../../utils/charts/config';
import resizeObserver from '../../../directives/resize_observer/resize_observer';

import { sparkline } from '../../../utils/charts/theme';

const { variants, defaultVariant } = sparkline;
// the padding is needed so the mark points don't overflow when visible
const gridPadding = symbolSize / 2;

export default {
  components: { Chart, ChartTooltip },
  directives: {
    resizeObserver,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    tooltipLabel: {
      type: String,
      required: false,
      default: '',
    },
    height: {
      type: Number,
      required: false,
      default: 50,
    },
    variant: {
      type: String,
      required: false,
      default: defaultVariant,
      validator(value) {
        return Object.keys(variants).includes(value);
      },
    },
    showLastYValue: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      chartInstance: null,
      tooltip: {
        show: false,
        title: '',
        content: '',
        position: {
          left: '0',
          top: '0',
        },
      },
    };
  },
  computed: {
    options() {
      const sparkLineChartOptions = {
        grid: {
          top: gridPadding,
          bottom: gridPadding,
          left: gridPadding,
          right: gridPadding,
        },
        xAxis: {
          type: 'category',
          show: false,
          axisLabel: {
            show: true,
          },
          axisPointer: {
            show: true,
            type: 'none',
            label: {
              formatter: this.xAxisLabelFormatter,
            },
          },
        },
        yAxis: {
          type: 'value',
          show: false,
          min: 'datamin',
        },
      };
      const mergedOptions = merge({}, defaultChartOptions, sparkLineChartOptions);
      return mergeSeriesToOptions(mergedOptions, this.series);
    },
    series() {
      const { data } = this;
      return {
        type: 'line',
        symbol: 'circle',
        hoverAnimation: false,
        animation: true,
        cursor: 'auto',
        lineStyle: { color: this.variantColor },
        itemStyle: { color: this.variantColor },
        symbolSize,
        markPoint: {
          symbol: 'circle',
          cursor: 'auto',
          animation: false,
          symbolSize,
          data: [
            {
              xAxis: data.length - 1,
              yAxis: data[data.length - 1][1],
            },
          ],
        },
        data,
      };
    },
    lastYValue() {
      const latestEntry = this.data.slice(-1)[0];

      return latestEntry[1];
    },
    variantColor() {
      return variants[this.variant];
    },
  },
  methods: {
    onChartCreated(chartInstance) {
      this.chartInstance = chartInstance;
      this.$emit('chartCreated', chartInstance);
    },
    handleResize() {
      this.chartInstance.resize();
    },
    hideTooltip() {
      this.tooltip.show = false;
    },
    formatTooltipText([xValue, yValue]) {
      this.tooltip.title = xValue;
      this.tooltip.content = yValue;
    },
    setTooltipPosition(data) {
      const [left, top] = this.chartInstance.convertToPixel('grid', data);
      this.tooltip.position = {
        left: `${left}px`,
        top: `${top}px`,
      };
    },
    // This function is called any time the axis pointer is changed (the black bubble showing which
    // point on the line is selected). Note that it will not trigger if the axis pointer is removed,
    // only when it changes from one point to another or is shown for the first time.
    xAxisLabelFormatter({ seriesData = [] }) {
      // seriesData is an array of nearby data point coordinates
      // seriesData[0] is the nearest point at which the tooltip is displayed
      // https://echarts.apache.org/en/option.html#xAxis.axisPointer.label.formatter
      const [firstEntry = {}] = seriesData;
      const { data } = firstEntry;

      if (data) {
        this.tooltip.show = true;
        this.formatTooltipText(data);
        this.setTooltipPosition(data);
      }
    },
  },
};
</script>

<template>
  <div v-resize-observer="handleResize" class="d-flex align-items-center" @mouseleave="hideTooltip">
    <slot name="default"></slot>
    <div class="flex-grow-1 position-relative">
      <chart :height="height" :options="options" @created="onChartCreated" />
      <chart-tooltip
        v-if="chartInstance"
        :show="tooltip.show"
        :chart="chartInstance"
        :top="tooltip.position.top"
        :left="tooltip.position.left"
        :style="{ pointerEvents: 'none' }"
        placement="top"
      >
        <template>
          <div slot="title" class="js-tooltip-title text-nowrap">{{ tooltip.title }}</div>
          <div slot="default" class="js-tooltip-content d-flex">
            <span v-if="tooltipLabel" class="pr-4 mr-auto">{{ tooltipLabel }}</span>
            <strong>{{ tooltip.content }}</strong>
          </div>
        </template>
      </chart-tooltip>
    </div>
    <span v-if="showLastYValue" class="js-last-y-value d-inline-flex justify-content-center ml-3">{{
      lastYValue
    }}</span>
  </div>
</template>
