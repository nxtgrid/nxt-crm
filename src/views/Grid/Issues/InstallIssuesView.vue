<template>
<nxt-table
  title="Commissioning meters"
  :columns="columns"
  :pg-rest-options="pgRestOptionsMeters"
  :hidden-filters="{
    grid_id: gridId,
    not: [ 'install_status', 'eq', 'SUCCESSFUL' ],
  }"
>
  <template v-slot:header>
    <nxt-button
      size="small"
      :to="{ name: 'grid--issues' }"
    >
      View metering issues
    </nxt-button>
  </template>
</nxt-table>
</template>

<script>
import { useRoute } from 'vue-router';
import { useDashboardUiStore } from '@nxt/components/dashboard';

import { NxtTable } from '@nxt/components';

export default {
  setup() {
    const route = useRoute();
    const { gridId } = route.params;
    useDashboardUiStore().addBreadCrumbs([ { label: 'Commissioning meters' } ]);

    const pgRestOptionsMeters = {
      from: 'meters_with_account_and_statuses',
      select: `
        id,
        external_reference,
        install_status,
        full_name,
        phone
      `,
    };

    const columns = [
      {
        field: 'external_reference',
        header: 'Meter',
        component: 'DeviceName',
      },
      {
        field: 'install_status',
        header: 'Status',
        component: 'MeteringHardwareStatus',
      },
      {
        field: 'full_name',
        header: 'Customer',
        sortable: true,
      },
      {
        field: 'phone',
        header: 'Phone',
        component: 'PhoneNumber',
      },
    ];

    return { gridId, pgRestOptionsMeters, columns };
  },

  components: { NxtTable },
};
</script>
