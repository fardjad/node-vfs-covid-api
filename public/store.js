/* global window, Vuex, fetch, he */

const state = {
  from: undefined,
  to: undefined,
  toast_message: undefined,
  data: [],
};

const mutations = {
  setData(state, sourceCountries) {
    const data = [];
    for (const sourceCountry of sourceCountries) {
      const from = sourceCountry.name;
      for (const destinationCountry of sourceCountry.visiting) {
        data.push({
          from: he.unescape(from),
          to: he.unescape(destinationCountry.name),
          toastMessage: destinationCountry.toast_message,
        });
      }
    }

    state.data = data;
  },
  setFrom(state, value) {
    this.state.from = value;
  },
  setTo(state, value) {
    this.state.to = value;
  },
  setToastMessage(state, value) {
    this.state.toastMessage = value;
  },
};

const actions = {
  async fetchData({commit, state}) {
    const url = new URL(
      `${window.location.protocol}//${window.location.host}/api/vfs-application-centers`
    );
    const params = {
      from: state.from,
      to: state.to,
      toast_message: state.toastMessage,
    };
    Object.keys(params).forEach(key => {
      if (params[key] == null) {
        return;
      }
      url.searchParams.append(key, params[key]);
    });
    const sourceCountries = await (await fetch(url)).json();
    commit('setData', sourceCountries);
  },
};

window.store = new Vuex.Store({
  state,
  actions,
  mutations,
});
