import { shallowMount } from '@vue/test-utils';
import Button from '../../../components/base/button/button.vue';

describe('button component', () => {
  const mountWithOptions = shallowMount.bind(null, Button);

  it('should have set the rel attribute with "noopener noreferrer" for target="blank"', () => {
    const button = mountWithOptions({
      propsData: {
        target: '_blank',
        href: '#',
      },
    });

    expect(button.vm.relType).toBe('noopener noreferrer');
  });

  describe('default settings', () => {
    let button;

    beforeEach(() => {
      button = mountWithOptions({});
    });

    it('should not have a set rel attribute', () => {
      expect(button.vm.relType).toBeUndefined();
    });

    it('should not have a target attribute', () => {
      expect(
        button.vm.$el.getAttribute('target'),
      ).toBe(null);
    });

    it('should not have a href attribute', () => {
      expect(
        button.vm.$el.getAttribute('href'),
      ).toBe(null);
    });
  });

  describe('target blank', () => {
    it('should have set the rel attribute with "noopener noreferrer"', () => {
      const mockedHostFunction = jest.fn(() => 'http://test.com');

      const button = mountWithOptions({
        propsData: {
          target: '_blank',
          href: 'http://example.com',
        },
        computed: {
          hostname: mockedHostFunction,
        },
      });

      expect(button.vm.relType).toBe('noopener noreferrer');
    });

    it('should keep rel attribute for hrefs in the same domain', () => {
      const buttonWithRel = mountWithOptions({ attrs: { rel: 'noopener' } });

      expect(buttonWithRel.vm.relType).toEqual('noopener');
    });
  });
});
