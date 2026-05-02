<template>
<meter-interactions-table
  v-if="meter"
  :meter_id="meter.id"
  :meter-reference="meter.externalReference"
/>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDashboardUiStore } from '@nxt/components/dashboard';
import { supabaseRepo } from '@/repo/supabaseRepo';

import { MeterInteractionsTable } from '@nxt/components/tables';

export default {
  setup() {
    const route = useRoute();
    const uiStore = useDashboardUiStore();

    const { gridId, customerId, meterId } = route.params;
    uiStore.addBreadCrumbs([ { label: 'Customers', path: `/grid/${ gridId }/customers/` } ]);

    const meter = ref();

    supabaseRepo.client
      .from('meters')
      .select(`
        id,
        external_reference,
        communication_protocol,
        ...connections(
          ...customers(
            ...accounts(
              full_name
            )
          )
        )
      `)
      .eq('id', meterId)
      .maybeSingle()
      .then(supabaseRepo.handleResponse)
      .then(_meter => {
        meter.value = _meter;
        uiStore.addBreadCrumbs([
          { label: _meter.full_name, path: `/grid/${ gridId }/customer/${ customerId }` },
          { label: 'Commands' },
        ]);
        uiStore.setPageTitle(`Customer commands ${ _meter.external_reference }`);
      })
    ;

    return { meter };
  },

  components: { MeterInteractionsTable },
};
</script>
