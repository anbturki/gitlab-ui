import Toasted from '@gitlab/vue-toasted';

const DEFAULT_OPTIONS = {
  action: {
    text: '×',
    class: 'font-weight-light text-white text-decoration-none toast-close',
    onClick: (e, toastObject) => toastObject.goAway(0),
  },
  iconPack: 'custom-class',
  position: 'bottom-left',
  duration: 5000,
  singleton: true,
  className: 'gl-toast',
  keepOnHover: true,
};

/**
 * Note: This is not a typical Vue component and needs to be registered before instantiating a Vue app.
 * Once registered, the toast will be globally available throughout your app.
 *
 * See https://gitlab-org.gitlab.io/gitlab-ui/ for detailed documentation.
 */
export default {
  install(Vue) {
    /* eslint-disable no-param-reassign */
    Vue.use(Toasted, DEFAULT_OPTIONS);

    Vue.prototype.$toast = {
      show: (message, options = {}) => Vue.toasted.show(message, this.generateOptions(options)),
    };
  },
  generateOptions(options) {
    const updatedOptions = { ...DEFAULT_OPTIONS, ...options };

    // ensures only one extra action can be added
    // ensures toasts always have a close/dismiss button
    if (options.action) {
      updatedOptions.action = [options.action, DEFAULT_OPTIONS.action];
    }

    return updatedOptions;
  },
};
