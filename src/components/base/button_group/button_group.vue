<script>
import { BButtonGroup } from 'bootstrap-vue';

export default {
  components: {
    BButtonGroup,
  },
};
</script>
<template>
  <b-button-group v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </b-button-group>
</template>
