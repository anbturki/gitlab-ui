import { nextTick } from 'vue';
import { mount, shallowMount } from '@vue/test-utils';

import GlToken from '../token/token.vue';
import GlTokenSelector from './token_selector.vue';
import GlTokenContainer from './token_container.vue';
import GlDropdownItem from '../dropdown/dropdown_item.vue';
import GlTokenSelectorDropdown from './token_selector_dropdown.vue';

describe('GlTokenSelector', () => {
  const tokens = [
    {
      id: 1,
      name: 'Vue.js',
    },
    {
      id: 2,
      name: 'Ruby On Rails',
    },
    {
      id: 3,
      name: 'GraphQL',
    },
    {
      id: 4,
      name: 'Redis',
    },
  ];

  const dropdownItems = [
    {
      id: 1,
      name: 'Vue.js',
    },
    {
      id: 2,
      name: 'Ruby On Rails',
    },
    {
      id: 3,
      name: 'GraphQL',
    },
    {
      id: 4,
      name: 'Redis',
    },
  ];

  let wrapper;

  const defaultProps = { selectedTokens: [] };

  const createComponent = (options, shallow = false) => {
    const mountFunction = shallow ? shallowMount : mount;

    wrapper = mountFunction(GlTokenSelector, {
      ...options,
      propsData: {
        ...defaultProps,
        ...(options?.propsData || {}),
      },
    });
  };

  const findTokenByName = name => {
    const tokenWrappers = wrapper.findAll(GlToken);

    return tokenWrappers.wrappers.find(tokenWrapper => tokenWrapper.text() === name);
  };

  const findDropdownItemByName = name => {
    const dropdownItemWrappers = wrapper.findAll(GlDropdownItem);

    return dropdownItemWrappers.wrappers.find(
      dropdownItemWrapper => dropdownItemWrapper.text() === name
    );
  };

  const findTextInput = () => wrapper.find({ ref: 'textInput' });

  const findDropdownMenu = () =>
    wrapper.find(GlTokenSelectorDropdown).find({ ref: 'dropdownMenu' });

  beforeAll(() => {
    if (!HTMLElement.prototype.scrollIntoView) {
      HTMLElement.prototype.scrollIntoView = jest.fn();
    }
  });

  afterAll(() => {
    if (HTMLElement.prototype.scrollIntoView.mock) {
      delete HTMLElement.prototype.scrollIntoView;
    }
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  describe('props', () => {
    describe('dropdownItems', () => {
      it('renders dropdown items', () => {
        createComponent({
          propsData: { dropdownItems },
          data() {
            return {
              dropdownIsOpen: true,
            };
          },
        });

        expect(wrapper.findAll(GlDropdownItem).length).toBe(4);
      });
    });

    describe('allowUserDefinedTokens', () => {
      it('passes prop to `gl-token-selector-dropdown` component', () => {
        createComponent({ propsData: { allowUserDefinedTokens: true } });

        expect(wrapper.find(GlTokenSelectorDropdown).vm.$props.allowUserDefinedTokens).toBe(true);
      });
    });

    describe('loading', () => {
      it('passes prop to `gl-token-selector-dropdown` component', () => {
        createComponent({ propsData: { loading: true } });

        expect(wrapper.find(GlTokenSelectorDropdown).vm.$props.loading).toBe(true);
      });
    });

    describe('hideDropdownWithNoItems', () => {
      it('hides dropdown with no items', () => {
        createComponent({ propsData: { hideDropdownWithNoItems: true } });

        const textInput = findTextInput();
        textInput.trigger('focus');

        expect(findDropdownMenu().classes()).not.toContain('show');
      });
    });

    describe('containerClass', () => {
      it('renders passed CSS classes', () => {
        createComponent({
          propsData: {
            containerClass: 'gl-h-auto',
          },
        });

        expect(wrapper.find({ ref: 'container' }).classes()).toContain('gl-h-auto');
      });
    });

    describe('text input attributes', () => {
      it.each`
        attribute            | value
        ${'autocomplete'}    | ${'on'}
        ${'placeholder'}     | ${'foo bar'}
        ${'aria-labelledby'} | ${'input-label'}
      `('renders `$attribute` on text input', ({ attribute, value }) => {
        createComponent({
          propsData: {
            [attribute]: value,
          },
        });

        const textInput = findTextInput();

        expect(textInput.attributes(attribute)).toBe(value);
      });
    });
  });

  describe('custom v-model', () => {
    it('renders tokens in bound data', () => {
      createComponent({
        propsData: {
          selectedTokens: tokens,
        },
      });

      expect(wrapper.findAll(GlToken).length).toBe(4);
    });
  });

  describe('slots', () => {
    it.each`
      slot                            | component                  | componentName
      ${'token-content'}              | ${GlTokenContainer}        | ${'GlTokenContainer'}
      ${'loading-content'}            | ${GlTokenSelectorDropdown} | ${'GlTokenSelectorDropdown'}
      ${'user-defined-token-content'} | ${GlTokenSelectorDropdown} | ${'GlTokenSelectorDropdown'}
      ${'no-results-content'}         | ${GlTokenSelectorDropdown} | ${'GlTokenSelectorDropdown'}
      ${'dropdown-item-content'}      | ${GlTokenSelectorDropdown} | ${'GlTokenSelectorDropdown'}
    `('passes `$slot` to `$componentName`', ({ slot, component }) => {
      createComponent({ propsData: { dropdownItems, selectedTokens: tokens } });

      expect(wrapper.find(component).vm.$scopedSlots).toHaveProperty(slot);
    });
  });

  describe('text input events', () => {
    describe('when input is focused', () => {
      let textInput;

      beforeEach(() => {
        createComponent();

        textInput = findTextInput();
        textInput.trigger('focus');
      });

      it('opens dropdown', () => {
        expect(findDropdownMenu().classes()).toContain('show');
      });

      it('adds focus class to main container', () => {
        expect(wrapper.find('.gl-token-selector').classes()).toContain(
          'gl-token-selector-focus-glow'
        );
      });

      it('fires `focus` event', () => {
        expect(wrapper.emitted('focus')).toBeTruthy();
      });
    });

    describe('when input is blurred', () => {
      let textInput;

      beforeEach(() => {
        createComponent();

        textInput = findTextInput();
        textInput.trigger('focus');
        textInput.trigger('blur');
      });

      it('fires `blur` event', () => {
        expect(wrapper.emitted('blur')).toBeTruthy();
      });

      it('removes focus class from main container', () => {
        expect(wrapper.find('.gl-token-selector').classes()).not.toContain(
          'gl-token-selector-focus-glow'
        );
      });

      it('closes dropdown', () => {
        expect(findDropdownMenu().classes()).not.toContain('show');
      });
    });

    describe('when escape key is pressed', () => {
      let textInput;

      beforeEach(() => {
        createComponent();

        textInput = findTextInput();
        textInput.trigger('focus');
      });

      it('clears text input', async () => {
        textInput.setValue('foo bar');
        await textInput.trigger('keydown.esc');

        expect(textInput.element.value).toBe('');
      });

      it('closes dropdown', async () => {
        await textInput.trigger('keydown.esc');

        expect(findDropdownMenu().classes()).not.toContain('show');
      });
    });

    describe('when delete key is pressed', () => {
      let textInput;

      beforeEach(() => {
        createComponent({ propsData: { selectedTokens: tokens } });

        textInput = findTextInput();
        textInput.trigger('focus');
      });

      it('does nothing if text input has value', async () => {
        textInput.setValue('foo bar');
        await textInput.trigger('keydown.delete');

        wrapper.findAll(GlToken).wrappers.forEach(tokenWrapper => {
          expect(tokenWrapper.element).not.toHaveFocus();
        });
      });

      it('focuses on last token if text input does not have a value', async () => {
        await textInput.trigger('keydown.delete');

        expect(findTokenByName(tokens[3].name).element.parentNode).toHaveFocus();
      });
    });

    describe('arrow keys', () => {
      const dropdownEventHandlers = {
        handleUpArrow: jest.fn(),
        handleDownArrow: jest.fn(),
        handleHomeKey: jest.fn(),
        handleEndKey: jest.fn(),
      };
      let textInput;

      beforeEach(() => {
        createComponent(
          {
            data() {
              return { dropdownEventHandlers };
            },
            stubs: { 'gl-token-container': GlTokenContainer },
          },
          true
        );

        textInput = findTextInput();
      });

      describe.each`
        key       | expectedHandler
        ${'up'}   | ${dropdownEventHandlers.handleUpArrow}
        ${'down'} | ${dropdownEventHandlers.handleDownArrow}
        ${'home'} | ${dropdownEventHandlers.handleHomeKey}
        ${'end'}  | ${dropdownEventHandlers.handleEndKey}
      `('when $key is pressed', ({ key, expectedHandler }) => {
        it('calls dropdown event handler', () => {
          textInput.trigger(`keydown.${key}`);

          expect(expectedHandler).toHaveBeenCalled();
        });
      });
    });

    describe('when input is clicked', () => {
      it('opens dropdown if input is focused and does not have a value', async () => {
        createComponent();

        const textInput = findTextInput();
        textInput.element.closest = () => null;
        textInput.trigger('focus');
        await textInput.trigger('click');

        expect(findDropdownMenu().classes()).toContain('show');
      });
    });

    describe('when `enter` key is pressed', () => {
      it('adds focused dropdown item as a token', async () => {
        createComponent({
          propsData: { dropdownItems },
        });

        const textInput = findTextInput();

        textInput.trigger('focus');
        await textInput.trigger('keydown.enter');

        expect(wrapper.emitted('input')[0]).toEqual([[dropdownItems[0]]]);
      });

      it('adds a user defined token', async () => {
        createComponent({
          propsData: { allowUserDefinedTokens: true },
        });

        const textInput = findTextInput();

        textInput.trigger('focus');
        textInput.setValue('foo bar');
        await textInput.trigger('keydown.enter');

        expect(wrapper.emitted('input')[0][0][0].name).toBe('foo bar');
      });
    });

    describe('when `keydown` event is triggered', () => {
      it('emits `keydown` event', () => {
        createComponent();

        const textInput = findTextInput();

        textInput.trigger('keydown');

        expect(wrapper.emitted('keydown')).toBeTruthy();
      });
    });
  });

  describe('adding tokens when clicking dropdown item', () => {
    const item = dropdownItems[0];

    beforeEach(async () => {
      createComponent({
        propsData: { dropdownItems },
      });

      wrapper.find(GlTokenSelectorDropdown).vm.$emit('dropdown-item-click', item);

      await nextTick();
    });

    it('fires `input` event', () => {
      expect(wrapper.emitted('input')[0]).toEqual([[item]]);
    });

    it('fires `token-add` event', () => {
      expect(wrapper.emitted('token-add')[0]).toEqual([item]);
    });
  });

  describe('removing tokens', () => {
    const token = tokens[0];

    beforeEach(async () => {
      createComponent({
        propsData: { selectedTokens: [token] },
      });

      wrapper.find(GlTokenContainer).vm.$emit('token-remove', token);

      await nextTick();
    });

    it('fires `input` event', () => {
      expect(wrapper.emitted('input')[0]).toEqual([[]]);
    });

    it('fires `token-remove` event', () => {
      expect(wrapper.emitted('token-remove')[0]).toEqual([token]);
    });
  });

  describe('when component container is clicked', () => {
    it('focuses on the text input', async () => {
      createComponent();

      const container = wrapper.find({ ref: 'container' });
      container.element.closest = () => null;

      container.trigger('click');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });
  });

  describe('filtering dropdown items', () => {
    it('removes selected tokens from the dropdown items', () => {
      createComponent({
        propsData: { dropdownItems, selectedTokens: [tokens[0]] },
      });
      expect(findDropdownItemByName(dropdownItems[0].name)).toBeUndefined();
    });
  });

  describe('when `GlTokenContainer` fires `cancel-focus`', () => {
    it('focuses on the text input', async () => {
      createComponent({
        selectedTokens: tokens,
      });

      wrapper.find(GlTokenContainer).vm.$emit('cancel-focus');

      await nextTick();

      expect(findTextInput().element).toHaveFocus();
    });
  });
});
