<template>
<nxt-table
  ref="issuesTable"
  title="Issues"
  provider="supabase-rest"
  :tabs="tabs"
  :columns="columns"
  :pg-rest-options="pgRestOptionsIssues"
  :records-postfix="` / ${ totalNumberOfMeters } meters`"
  :initial-variables="{
    sort: 'created_at',
    order: 'desc',
    filters: {
      issue_type: tabs.options[0].value,
    },
  }"
  :hidden-filters="{
    'meter.connection.customer.grid_id': gridId,
    issue_status: 'OPEN',
  }"
>
  <template v-slot:header>
    <nxt-button
      size="small"
      :to="{ name: 'grid--issues--commissioning' }"
    >
      View commissioning meters
    </nxt-button>
  </template>
</nxt-table>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDashboardUiStore } from '@nxt/components/dashboard';
import { supabaseRepo } from '@/repo/supabaseRepo';

import { NxtTable } from '@nxt/components';

export default {
  setup() {
    const issuesTable = ref();
    const route = useRoute();
    useDashboardUiStore().addBreadCrumbs([ { label: 'Issues' } ]);

    const { gridId } = route.params;
    const createCustomerLink = data => `/grid/${ gridId }/customer/${ data.meter.connection.customer.id }`;

    const totalNumberOfMeters = ref(0);
    supabaseRepo.client
      .from('meters_with_account_and_statuses')
      .select('*', { count: 'exact', head: true })
      .match({ grid_id: gridId, is_hidden_from_reporting: false })
      .then(supabaseRepo.handleResponse)
      .then(res => {
        totalNumberOfMeters.value = res?.count ?? 0;
      })
    ;

    const pgRestOptionsIssues = {
      from: 'issues',
      select: `
        id,
        created_at,
        meter:meter_id!inner(
          external_reference,
          kwh_credit_available,


          last_non_zero_consumption_at,


          connection:connection_id!inner(
            customer:customer_id!inner(
              id,
              grid_id,
              lives_primarily_in_the_community,
              account:account_id(
                full_name
              )
            )
          ),


          last_install_session:last_metering_hardware_install_session_id(
            commissioning:last_meter_commissioning_id(
              created_at
            )
          )


        )
      `,
      withDeleted: true,
    };

    const tabs = {
      field: 'issue_type',
      options: [
        {
          value: 'NO_CREDIT',
          label: 'No credit',
        },
        {
          value: 'NO_CONSUMPTION',
          label: 'No consumption',
        },
        {
          value: 'UNEXPECTED_METER_STATUS',
          label: 'Unexpected meter status',
        },
      ],
    };

    const columns = computed(() => {
      const activeIssue = issuesTable.value?.variables.filters.issue_type;
      return  [
        {
          field: 'created_at',
          header: (tabs.options.find(({ value }) => value === activeIssue)?.label ?? 'Effective') + ' since',
          component: 'DateTime',
          sortable: true,
        },
        {
          field: 'meter.connection.customer.account.full_name',
          header: 'Customer',
          component: 'FormatText',
          createLink: createCustomerLink,
        },
        {
          field: 'meter.external_reference',
          header: 'Meter',
        },
        {
          field: 'meter.kwh_credit_available',
          header: 'Credit (kWh)',
          sortable: true,
          hideWhen: (entries, variables) =>
            variables.filters.issue_type !== 'NO_CONSUMPTION',
        },
        {
          field: 'meter.connection.customer.lives_primarily_in_the_community',
          header: 'Customer outside community',
          component: 'FormatText',
        },
        {
          field: 'meter.last_non_zero_consumption_at',
          header: 'Never consumed',
          hideWhen: (entries, variables) =>
            variables.filters.issue_type !== 'NO_CONSUMPTION',
          component: 'ConsumptionNever',
        },
      ];
    });

    return {
      issuesTable,
      gridId,
      totalNumberOfMeters,
      pgRestOptionsIssues,
      columns,
      tabs,
    };
  },

  components: { NxtTable },
};
</script>
