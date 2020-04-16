import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';
import { documentedStoriesOf } from '../../../../documentation/documented_stories';
import {
  newButtonCategoryOptions,
  newButtonVariantOptions,
  newButtonSizeOptions,
  targetOptions,
} from '../../../utils/constants';
import readme from './button.md';
import { GlButton } from '../../../../index';

const components = {
  GlButton,
};

function generateProps({
  category = newButtonCategoryOptions.tertiary,
  variant = newButtonVariantOptions.default,
  size = newButtonSizeOptions.medium,
  withLink = false,
  block = false,
} = {}) {
  let props = {
    category: {
      type: String,
      default: select('category', newButtonCategoryOptions, category),
    },
    variant: {
      type: String,
      default: select('variant', newButtonVariantOptions, variant),
    },
    size: {
      type: String,
      default: select('size', newButtonSizeOptions, size),
    },
    block: {
      type: Boolean,
      default: boolean('block', block),
    },
    disabled: {
      type: Boolean,
      default: boolean('disabled', false),
    },
  };

  if (withLink) {
    props = {
      ...props,
      href: {
        type: String,
        default: text('href', '#'),
      },
      target: {
        type: String,
        default: select('target', targetOptions, targetOptions.null),
      },
    };
  }

  return props;
}

documentedStoriesOf('base|button', readme)
  .addDecorator(withKnobs)
  .add('default', () => ({
    props: generateProps(),
    components,
    template: `
      <gl-button
        :category="category"
        :variant="variant"
        :size="size"
        :block="block"
        :disabled="disabled"
      >
        This is a button
      </gl-button>
    `,
  }))
  .add('block button', () => ({
    props: generateProps({ block: true }),
    components,
    template: `
      <gl-button
        :category="category"
        :variant="variant"
        :size="size"
        :block="block"
        :disabled="disabled"
      >
        This is a block button
      </gl-button>
    `,
  }))
  .add('icon button', () => ({
    props: generateProps({
      category: newButtonCategoryOptions.primary,
      variant: newButtonVariantOptions.danger,
    }),
    components,
    template: `
      <gl-button
        :category="category"
        :variant="variant"
        :size="size"
        :block="block"
        :disabled="disabled"
        icon="star-o"
      />
    `,
  }))
  .add('link button', () => ({
    props: generateProps({ withLink: true }),
    components,
    template: `
      <gl-button
        :category="category"
        :variant="variant"
        :size="size"
        :block="block"
        :disabled="disabled"
        :href="href"
        :target="target"
      >
        This is a link button
      </gl-button>
    `,
  }));