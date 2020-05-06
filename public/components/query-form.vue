<template>
  <section>
    <b-field label="I want to apply from (leave empty to include all countries)">
      <b-input @input="setFrom" placeholder="ex. Canada"></b-input>
    </b-field>

    <b-field label="I want to visit (leave empty to include all countries)">
      <b-input @input="setTo" placeholder="ex. The Netherlands"></b-input>
    </b-field>

    <b-field label="Only show the visa application centers with the following status">
      <b-select @input="setToastMessage" value>
        <option
          v-for="option in applicationCenterStatuses"
          :value="option.id"
          :key="option.id"
        >{{ option.value }}</option>
      </b-select>
    </b-field>
    <div class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item">
          <b-field>
            <p class="control">
              <button @click="fetchData" class="button is-primary">Show Results</button>
            </p>
          </b-field>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const {mapState} = Vuex;

module.exports = {
  data: () => ({
    applicationCenterStatuses: [
      {
        id: '',
        value: 'Any',
      },
      {
        id: 'open',
        value: 'Open',
      },
      {
        id: 'closed',
        value: 'Closed',
      },
      {
        id: 'partial open',
        value: 'Partial Open',
      },
    ],
  }),
  methods: {
    setFrom(value) {
      store.commit('setFrom', value.trim() == '' ? undefined : value);
    },
    setTo(value) {
      store.commit('setTo', value.trim() == '' ? undefined : value);
    },
    setToastMessage(value) {
      store.commit('setToastMessage', value.trim() == '' ? undefined : value);
    },
    fetchData() {
      store.dispatch('fetchData');
    },
  },
  computed: {
    ...mapState({
      from: ({from}) => from,
      to: ({to}) => to,
      toastMessage: ({toastMessage}) => toastMessage,
    }),
  },
};
</script>
