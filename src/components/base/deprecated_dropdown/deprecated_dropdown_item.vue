<script>
import { BDropdownItem, BDropdownItemButton } from 'bootstrap-vue';

export default {
  inheritAttrs: false,
  computed: {
    bootstrapComponent() {
      return this.$attrs.href ? BDropdownItem : BDropdownItemButton;
    },
  },
};
</script>

<template>
  <component :is="bootstrapComponent" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </component>
</template>
