<template>
  <div>
    <vue-good-table
      v-if="!loading"
      :columns="columns"
      :rows="rows"
      :pagination-options="paginationOptions"
    ></vue-good-table>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      paginationOptions: {
        enabled: true,
      },
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
    rows() {
      return store.state.data;
    },
    loading() {
      return store.state.loading;
    },
  },
};
</script>
