<script>
import GlFilteredSearchTokenSegment from './filtered_search_token_segment.vue';
import GlFilteredSearchSuggestion from './filtered_search_suggestion.vue';

export default {
  components: {
    GlFilteredSearchTokenSegment,
    GlFilteredSearchSuggestion,
  },
  inheritAttrs: false,
  props: {
    availableTokens: {
      type: Array,
      required: true,
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: Object,
      required: false,
      default: () => ({ data: '' }),
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    suggestedTokens() {
      return this.availableTokens.filter(item =>
        item.title.toLowerCase().includes(this.value.data.toLowerCase())
      );
    },
    internalValue: {
      get() {
        return this.value.data;
      },
      set(data) {
        this.$emit('input', { data });
      },
    },
  },
};
</script>

<template>
  <div class="gl-h-auto gl-filtered-search-term">
    <gl-filtered-search-token-segment
      v-model="internalValue"
      class="gl-filtered-search-term-token"
      :active="active"
      :class="{ 'gl-w-full': placeholder }"
      @activate="$emit('activate')"
      @deactivate="$emit('deactivate')"
      @complete="$emit('replace', { type: $event })"
      @backspace="$emit('destroy')"
      @submit="$emit('submit')"
      @split="$emit('split', $event)"
    >
      <template #suggestions>
        <gl-filtered-search-suggestion
          v-for="(item, idx) in suggestedTokens"
          :key="idx"
          :value="item.type"
          :icon-name="item.icon"
        >
          {{ item.title }}
        </gl-filtered-search-suggestion>
      </template>
      <template #view>
        <input
          v-if="placeholder"
          class="gl-filtered-search-term-input"
          :placeholder="placeholder"
        />
        <template v-else>{{ value.data }}</template>
      </template>
    </gl-filtered-search-token-segment>
  </div>
</template>
