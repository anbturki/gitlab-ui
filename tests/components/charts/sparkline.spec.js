import { shallowMount, createLocalVue } from '@vue/test-utils';

import { waitForAnimationFrame } from '../../test_utils';

import { sparkline } from '../../../src/utils/charts/theme';

import Chart from '../../../src/components/charts/chart/chart.vue';
import SparklineChart from '../../../src/components/charts/sparkline/sparkline.vue';
import ChartTooltip from '../../../src/components/charts/tooltip/tooltip.vue';

const mockResize = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockChartInstance = {
  subscribedEvents: {},
  getDom() {
    return {
      addEventListener: (eventName, handler) => {
        this.subscribedEvents[eventName] = handler.bind(null, []);
      },
      removeEventListener: mockRemoveEventListener,
    };
  },
  containPixel: () => true,
  convertToPixel: () => [],
  resize: mockResize,
};

// echarts need to be mocked to prevent prop-validation in chart-tooltips to fail
jest.mock('echarts', () => ({
  getInstanceByDom: () => mockChartInstance,
}));

jest.mock('../../../src/utils/charts/theme', () => ({
  sparkline: {
    variants: { foo: 'foo', bar: 'bar' },
    defaultVariant: 'foo',
  },
}));

let triggerResize = () => {};
jest.mock('../../../src/directives/resize_observer/resize_observer', () => ({
  bind(el, { value: resizeHandler }) {
    triggerResize = () => resizeHandler();
  },
}));

const localVue = createLocalVue();

describe('sparkline chart component', () => {
  let wrapper;
  let componentOptions;
  const factory = () => {
    componentOptions = {
      localVue,
      propsData: {
        data: [[]],
        variant: null,
      },
      scopedSlots: { latestSeriesEntry: jest.fn() },
      sync: false,
    };

    wrapper = shallowMount(SparklineChart, componentOptions);
  };

  // helpers
  const getChart = () => wrapper.find(Chart);

  const getTooltip = () => wrapper.find(ChartTooltip);
  const getTooltipTitle = () => getTooltip().find('.js-tooltip-title');
  const getTooltipContent = () => getTooltip().find('.js-tooltip-content');

  const getLastYValue = () => wrapper.find('.js-last-y-value');
  const getVariantPropConfig = () => wrapper.vm.$options.props.variant;
  const getVariantPropValidator = () => getVariantPropConfig().validator;

  const getChartOptions = () => getChart().props('options');
  const getLabelFormatter = () => {
    const {
      xAxis: {
        axisPointer: {
          label: { formatter },
        },
      },
    } = getChartOptions();

    return formatter;
  };

  const emitChartCreated = () => getChart().vm.$emit('created', mockChartInstance);

  beforeEach(() => {
    factory();
    // needs to run after every mount, or the chart-instance is `null` and `beforeDestroy` throws
    emitChartCreated();
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });

  it('renders a chart', () => {
    expect(wrapper.find(Chart).exists()).toBe(true);
  });

  it('has a default height of 50', () => {
    expect(getChart().props('height')).toBe(50);
  });

  it('accepts a custom height', () => {
    const newHeight = 1000;
    wrapper.setProps({ height: newHeight });

    expect(getChart().props('height')).not.toBe(newHeight);

    return wrapper.vm.$nextTick().then(() => {
      expect(getChart().props('height')).toBe(newHeight);
    });
  });

  it.each(Object.keys(sparkline.variants))(
    'accepts a value that is in `theme.sparkline.variants` as a valid variant',
    validVariant => {
      expect(getVariantPropValidator()(validVariant)).toBe(true);
    }
  );

  it('rejects a value that is not in `theme.sparkline.variants` as a valid variant', () => {
    expect(getVariantPropValidator()('invalid')).toBe(false);
  });

  it('uses `theme.sparkline.defaultVariant` as a default variant', () => {
    expect(getVariantPropConfig().default).toBeTruthy();
    expect(getVariantPropConfig().default).toBe(sparkline.defaultVariant);
  });

  it('unsubscribes the mouse events when the component is destroyed', () => {
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(0);

    wrapper.destroy();

    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  it('triggers the chart to resize when the containing elements size changes', () => {
    expect(mockChartInstance.resize).toHaveBeenCalledTimes(0);

    triggerResize();

    expect(mockChartInstance.resize).toHaveBeenCalledTimes(1);
  });

  it('includes a chart tooltip', () => {
    expect(getTooltip().exists()).toBe(true);
  });

  it('displays the given tooltip label', () => {
    const tooltipLabel = 'foo';

    wrapper.setProps({ tooltipLabel: 'foo' });

    return wrapper.vm.$nextTick().then(() => {
      expect(getTooltipContent().text()).toContain(tooltipLabel);
    });
  });

  it('shows the tooltip when the mouse moves over the chart', () => {
    mockChartInstance.containPixel = () => true;
    mockChartInstance.subscribedEvents.mousemove();

    expect(getTooltip().attributes('show')).toBeFalsy();

    return waitForAnimationFrame().then(() => {
      expect(getTooltip().attributes('show')).toBeTruthy();
    });
  });

  it('hides the tooltip when the mouse leaves the root component', () => {
    mockChartInstance.containPixel = () => true;
    mockChartInstance.subscribedEvents.mousemove();

    return waitForAnimationFrame()
      .then(() => {
        expect(getTooltip().attributes('show')).toBe('true');

        wrapper.trigger('mouseleave');
      })
      .then(waitForAnimationFrame())
      .then(() => {
        expect(getTooltip().attributes('show')).toBeFalsy();
      });
  });

  it('adds the right content to the tooltip', () => {
    const labelFormatter = getLabelFormatter();

    const xValue = 'foo';
    const yValue = 'bar';
    const mockData = { seriesData: [{ data: [xValue, yValue] }] };

    labelFormatter(mockData);

    expect(getTooltipTitle().text()).toBe('');
    expect(getTooltipContent().text()).toBe('');

    return waitForAnimationFrame().then(() => {
      expect(getTooltipTitle().text()).toBe(xValue);
      expect(getTooltipContent().text()).toBe(yValue);
    });
  });

  it(`shows the last entry's y-value per default`, () => {
    const data = [['foo', 'bar'], ['baz', 'biz']];
    const latestEntryYValue = data[1][1];

    wrapper.setProps({ data });

    return wrapper.vm.$nextTick().then(() => {
      expect(getLastYValue().text()).toBe(latestEntryYValue);
    });
  });

  it(`does not show the last entry's y-value if 'showLastYValue' is false`, () => {
    expect(getLastYValue().exists()).toBe(true);

    wrapper.setProps({ showLastYValue: false });

    return wrapper.vm.$nextTick().then(() => {
      expect(getLastYValue().exists()).toBe(false);
    });
  });
});