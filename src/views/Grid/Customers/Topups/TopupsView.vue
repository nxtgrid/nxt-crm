<template>
<topups-table
  :meter_id="meterId"
  :gridId="gridId"
  :meter-reference="externalReference"
/>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDashboardUiStore } from '@nxt/components/dashboard';
import { supabaseRepo } from '@/repo/supabaseRepo';

import { TopupsTable } from '@nxt/components/tables';

export default {
  setup() {
    const route = useRoute();
    const uiStore = useDashboardUiStore();

    const { gridId, customerId, meterId } = route.params;
    uiStore.addBreadCrumbs([ { label: 'Customers', path: `/grid/${ gridId }/customers/` } ]);

    const externalReference = ref('');

    supabaseRepo.client
      .from('meters')
      .select(`
        external_reference,
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
      .then(({ external_reference, full_name }) => {
        externalReference.value = external_reference;
        uiStore.addBreadCrumbs([
          { label: full_name, path: `/grid/${ gridId }/customer/${ customerId }` },
          { label: 'Top-ups' },
        ]);
        uiStore.setPageTitle(`Customer top-ups ${ external_reference }`);
      })
    ;

    return {
      gridId,
      meterId,
      externalReference,
    };
  },

  components: { TopupsTable },
};
</script>
