import { withKnobs, select, boolean } from '@storybook/addon-knobs/vue';
import documentedStoriesOf from '../../../utils/documented_stories';
import { sizeOptionsWithNoDefault, buttonVariantOptions } from '../../../utils/constants';
import readme from './button_group.md';
import { GlButtonGroup } from '../../../index';

const components = {
  GlButtonGroup,
};

function generateProps({
  variant = buttonVariantOptions.primary,
  size = sizeOptionsWithNoDefault.default,
} = {}) {
  const props = {
    variant: {
      type: String,
      default: select('variant', buttonVariantOptions, variant),
    },
    size: {
      type: String,
      default: select('size', sizeOptionsWithNoDefault, size),
    },
    vertical: {
      type: Boolean,
      default: boolean('vertical', false),
    },
  };

  return props;
}

documentedStoriesOf('base|button group', readme)
  .addDecorator(withKnobs)
  .add('default', () => ({
    props: generateProps(),
    components,
    template: `
     <gl-button-group :vertical="vertical" :size="size">
       <gl-button :variant="variant">Button 1</gl-button>
       <gl-button>Button 2</gl-button>
     </gl-button-group> 
    `,
  }))
  .add('with dropdowns', () => ({
    props: generateProps(),
    components,
    template: `
     <gl-button-group :vertical="vertical" :size="size">
       <gl-button :variant="variant">Button 1</gl-button>
       <gl-button>Button 2</gl-button>
       <gl-dropdown text="Some dropdown">
        <gl-dropdown-item>First item</gl-dropdown-item>
        <gl-dropdown-item>Second item</gl-dropdown-item>
        <gl-dropdown-item>Last item</gl-dropdown-item>
       </gl-dropdown>
     </gl-button-group> 
    `,
  }));