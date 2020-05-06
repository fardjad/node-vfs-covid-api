/* global httpVueLoader, Vue */

const app = httpVueLoader('components/app.vue');

new Vue({
  el: '#app',
  components: {
    app,
  },
  render: createElement => createElement(app),
});

httpVueLoader.register(Vue, 'components/query-form.vue');
httpVueLoader.register(Vue, 'components/search-results.vue');
