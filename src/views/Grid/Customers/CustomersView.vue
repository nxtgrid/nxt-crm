<template>
<nxt-only>
  <ul>
    <li>Do we want a map? Do our customers care? (Ayrton doesn't do maps for developers currently)</li>
    <li>Do we want to show:
      <ul>
        <li>Last top-up date? Sortable? What is most useful to our customers?</li>
        <li>kWh credit? Balance in Naira? What to do if 2 meters?</li>
      </ul>
    </li>
  </ul>
</nxt-only>
<nxt-table
  title="Customers"
  provider="supabase-rest"
  :columns="columns"
  :pg-rest-options="pgRestOptionsCustomers"
  :row-link-generator="createLink"
  :initial-variables="{
    sort: 'full_name',
    order: 'asc',
  }"
  :hidden-filters="{
    grid_id: gridId,
    // is_hidden_from_reporting: false,
  }"
></nxt-table>
</template>

<script>
import { useRoute } from 'vue-router';
import { useDashboardUiStore } from '@nxt/components/dashboard';

import NxtTable from '@nxt/components/table/NxtTable.vue';
import { NxtOnly } from '@nxt/components';
import { isNil } from 'ramda';

export default {
  setup() {
    useDashboardUiStore().addBreadCrumbs([ { label: 'Customers' } ]);
    const route = useRoute();

    const gridId = parseInt(route.params.gridId);
    const createLink = data => `/grid/${ gridId }/customer/${ data.id }/`;

    const pgRestOptionsCustomers = {
      from: 'customers_with_account',
      select: `
        id,
        full_name,
        meter,
        phone,
        total_connection_paid,
        total_connection_fee
      `,
      searchPaths: [ 'full_name', 'meter' ],
    };

    const columns = [
      {
        field: 'full_name',
        header: 'Name',
        sortable: true,
        createLink,
      },
      {
        field: 'meter',
        header: 'Meter',
        filterOptions: {
          type: 'select',
          placeholder: 'Has a meter?',
          options: [
            {
              value: 'meter*not.is*null',
              label: 'Yes',
            },
            {
              value: 'meter*is*null',
              label: 'No',
            },
          ],
          field: 'filter',
        },
      },
      {
        field: 'phone',
        component: 'PhoneNumber',
        header: 'Phone',
      },
      {
        field: 'total_connection_paid',
        header: 'Fees Paid',
        component: 'FeesPaid',
        justYesNo: true,
        filterOptions: {
          type: 'select',
          placeholder: 'Has fully paid fees',
          options: [
            {
              value: true,
              label: 'Yes',
            },
            {
              value: false,
              label: 'No',
            },
          ],
          field: 'has_fully_paid_connection_fees',
        },
        hideWhen: (entries, variables) => entries
          .every(entry => entry.total_connection_paid >= entry.total_connection_fee)
          && isNil(variables.filters.has_fully_paid_connection_fees),
      },
    ];

    return { gridId, createLink, pgRestOptionsCustomers, columns };
  },

  components: { NxtTable, NxtOnly },
};
</script>
