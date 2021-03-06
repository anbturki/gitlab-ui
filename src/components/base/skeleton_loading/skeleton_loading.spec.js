import { shallowMount } from '@vue/test-utils';
import SkeletonLoading from './skeleton_loading.vue';

describe('skeleton loading component', () => {
  const mountWithOptions = shallowMount.bind(null, SkeletonLoading);

  it('should render 1 line', () => {
    const component = mountWithOptions({
      propsData: {
        lines: 1,
      },
    });

    const lines = component.vm.$el.querySelectorAll('.animation-container div');
    expect(lines).toHaveLength(1);
    expect(lines[0].classList.contains('skeleton-line-1')).toEqual(true);
  });

  it('should render 2 lines', () => {
    const component = mountWithOptions({
      propsData: {
        lines: 2,
      },
    });

    const lines = component.vm.$el.querySelectorAll('.animation-container div');

    expect(lines).toHaveLength(2);
    expect(lines[0].classList.contains('skeleton-line-1')).toEqual(true);
    expect(lines[1].classList.contains('skeleton-line-2')).toEqual(true);
  });

  describe('3 lines', () => {
    function expectThreeLines(component) {
      const lines = component.vm.$el.querySelectorAll('.animation-container div');
      expect(lines).toHaveLength(3);
      expect(lines[0].classList.contains('skeleton-line-1')).toEqual(true);
      expect(lines[1].classList.contains('skeleton-line-2')).toEqual(true);
      expect(lines[2].classList.contains('skeleton-line-3')).toEqual(true);
    }

    it('should render by default', () => {
      const component = mountWithOptions({});

      expectThreeLines(component);
    });

    it('should render when 3 lines are passed', () => {
      const component = mountWithOptions({
        propsData: {
          lines: 3,
        },
      });

      expectThreeLines(component);
    });
  });
});
