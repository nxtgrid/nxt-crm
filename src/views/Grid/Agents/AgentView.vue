<template>
<div class="grid-3 mb-1">
  <agent-card
    v-if="agent"
    class="grid-3__2-columns"
    :agent="agent"
    :show-actions="accountStore.trainingLevel > 0"
    @delete="onAgentDelete"
    @update="fetchAgentData"
  />
  <div v-else class="scc scc-card grid-3__2-columns"></div>
</div>

<transactions-table :agent_id="parseInt(agentId)" />
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDashboardUiStore } from '@nxt/components/dashboard';
import { useAccountStore, useRealtime } from '@nxt/libraries/api-connection';

import { AgentCard } from '@nxt/components/dashboard';
import TransactionsTable from '@nxt/components/tables/TransactionsTable.vue';

import { supabaseRepo } from '@/repo/supabaseRepo';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const ordersTable = ref();
    const uiStore = useDashboardUiStore();
    const accountStore = useAccountStore();

    const agent = ref();

    const { gridId, agentId } = route.params;
    uiStore.addBreadCrumbs([ { label: 'Agents', path: `/grid/${ gridId }/agents/` } ]);

    const fetchAgentData = () => supabaseRepo
      .getAgent(agentId)
      .then(_agent => {
        agent.value = _agent;
        // Also fetch 'me' to ensure latest global organization wallet
        accountStore.fetchMyProfile();
        // Also refresh the orders table
        ordersTable.value?.refresh();
      })
      .catch(err => {
        console.error('Error fetching agent data:', err.message);
      })
    ;

    const onAgentDelete = () => {
      router.push(`/grid/${ gridId }/agents`);
    };

    let channelUnsubscribe;

    const initRealtime = () => {
      channelUnsubscribe = useRealtime().addChannel(sbClient => {
        const channel = sbClient.channel('eos_agent');
        channel.on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `id=eq.${ agent.value.wallet.id }`,
        }, fetchAgentData);
        return channel;
      });
    };

    onBeforeMount(async () => {
      await fetchAgentData();
      const label = agent.value.account.full_name;
      uiStore.addBreadCrumbs([ { label } ]);
      uiStore.setPageTitle(`Agent ${ label }`);
      initRealtime();
    });

    onBeforeUnmount(() => { channelUnsubscribe?.(); });

    return {
      accountStore,
      ordersTable,
      agentId,
      agent,
      fetchAgentData,
      onAgentDelete,
    };
  },

  components: {
    AgentCard,
    TransactionsTable,
  },
};
</script>
