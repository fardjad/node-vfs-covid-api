<template>
  <b-table :data="data" :columns="columns"></b-table>
</template>

<script>
module.exports = {
  data() {
    return {
      columns: [
        {
          field: 'from',
          label: 'From',
        },
        {
          field: 'to',
          label: 'To',
        },
        {
          field: 'toastMessage',
          label: 'Status',
        },
      ],
    };
  },
  computed: {
    data() {
      return store.state.data;
    },
  },
};
</script>
