<template>
<topups-table
  :grid_id="gridId"
  :create-customer-link-fn="createCustomerLink"
  with-downloads
/>
</template>

<script>
import { useRoute } from 'vue-router';
import { useDashboardUiStore } from '@nxt/components/dashboard';

import { TopupsTable } from '@nxt/components/tables';

export default {
  setup() {
    useDashboardUiStore().addBreadCrumbs([ { label: 'Top-ups' } ]);
    const route = useRoute();
    const gridId = route.params.gridId;
    const createCustomerLink = ({ meta_receiver_id_part_2 }) => meta_receiver_id_part_2 && `/grid/${ gridId }/customer/${ meta_receiver_id_part_2 }`;

    return { gridId, createCustomerLink };
  },

  components: { TopupsTable },
};
</script>
