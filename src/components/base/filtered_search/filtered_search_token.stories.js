import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import Vue from 'vue';
import PortalVue from 'portal-vue';
import { documentedStoriesOf } from '../../../../documentation/documented_stories';
import GlFilteredSearchToken from './filtered_search_token.vue';
import GlFilteredSearchSuggestion from './filtered_search_suggestion.vue';
import readme from './filtered_search_token.md';

Vue.use(PortalVue);

const noop = () => {};

documentedStoriesOf('base|filtered-search/token', readme)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: {
      GlFilteredSearchToken,
      GlFilteredSearchSuggestion,
    },
    provide: {
      portalName: 'portal',
      alignSuggestions: noop,
    },
    props: {
      title: {
        type: String,
        default: text('title', 'Confidential'),
      },
      active: {
        type: Boolean,
        default: boolean('active', true),
      },
    },
    data() {
      return {
        value: { operator: '=', data: 'Yes' },
      };
    },
    mounted() {
      this.$nextTick(() => {
        document.activeElement.blur();
      });
    },
    template: `
      <div>
        <div> {{ value }} </div>
        <div class="gl-border-1 gl-border-solid gl-border-gray-400">
          <gl-filtered-search-token
            v-model="value"
            class="gl-h-full"
            :title="title"
            :active="active"
          >
            <template #suggestions>
              <gl-filtered-search-suggestion value="Yes"><gl-icon name="eye-slash" :size="16"/> Yes</gl-filtered-search-suggestion>
              <gl-filtered-search-suggestion value="No"><gl-icon name="eye" :size="16"/> No</gl-filtered-search-suggestion>
            </template>
          </gl-filtered-search-token>
        </div>
        <div>
          <portal-target name="portal" class="gl-relative" />
        </div>
      </div>
    `,
  }))
  .add('with custom operators options', () => ({
    components: {
      GlFilteredSearchToken,
      GlFilteredSearchSuggestion,
    },
    provide: {
      portalName: 'portal',
      alignSuggestions: noop,
    },
    props: {
      title: {
        type: String,
        default: text('title', 'Confidential'),
      },
      active: {
        type: Boolean,
        default: boolean('active', true),
      },
    },
    data() {
      return {
        value: { operator: '=', data: 'Yes' },
        operators: [
          { value: '^', description: 'or' },
          { value: '!', description: 'is not', default: 'true' },
        ],
      };
    },
    mounted() {
      this.$nextTick(() => {
        document.activeElement.blur();
      });
    },
    template: `
      <div>
        <div> {{ value }} </div>
        <div class="gl-border-1 gl-border-solid gl-border-gray-400">
          <gl-filtered-search-token
            v-model="value"
            class="gl-h-full"
            :title="title"
            :active="active"
            :operators="operators"
          >
          <template #suggestions>
            <gl-filtered-search-suggestion value="Yes"><gl-icon name="eye-slash" :size="16"/> Yes</gl-filtered-search-suggestion>
            <gl-filtered-search-suggestion value="No"><gl-icon name="eye" :size="16"/> No</gl-filtered-search-suggestion>
          </template>
        </div>
        <div>
          <portal-target name="portal" class="gl-relative" />
        </div>
      </div>
    `,
  }))
  .add('with static options', () => ({
    components: {
      GlFilteredSearchToken,
      GlFilteredSearchSuggestion,
    },
    provide: {
      portalName: 'portal',
      alignSuggestions: noop,
    },
    props: {
      title: {
        type: String,
        default: text('title', 'Confidential'),
      },
      active: {
        type: Boolean,
        default: boolean('active', true),
      },
    },
    data() {
      return {
        value: { operator: '=', data: 'first' },
        options: [
          { icon: 'hourglass', title: 'first', value: 'one' },
          { title: 'second-without-icon', value: 'two' },
          { icon: 'issues', title: 'third', value: 'three' },
        ],
      };
    },
    mounted() {
      this.$nextTick(() => {
        document.activeElement.blur();
      });
    },
    template: `
      <div>
        <div> {{ value }} </div>
        <div class="gl-border-1 gl-border-solid gl-border-gray-400">
          <gl-filtered-search-token
            v-model="value"
            class="gl-h-full"
            :title="title"
            :active="active"
            :options="options"
          />
        </div>
        <div>
          <portal-target name="portal" class="gl-relative" />
        </div>
      </div>
    `,
  }));