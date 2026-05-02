<template>
<agents-table
  :grid_id="gridId"
  :create-agent-link-fn="createAgentLink"
  :show-actions="trainingLevel > 0"
/>
</template>

<script>
import { useRoute } from 'vue-router';
import { useAccountStore } from '@nxt/libraries/api-connection';
import { useDashboardUiStore } from '@nxt/components/dashboard/store/dashboard-ui';

import { AgentsTable } from '@nxt/components/tables';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    useDashboardUiStore().addBreadCrumbs([ { label: 'Agents' } ]);
    const route = useRoute();
    const gridId = route.params.gridId;
    const { trainingLevel } = storeToRefs(useAccountStore());
    const createAgentLink = data => `/grid/${ gridId }/agent/${ data.id }/`;

    return { gridId, trainingLevel, createAgentLink };
  },

  components: { AgentsTable },
};
</script>
