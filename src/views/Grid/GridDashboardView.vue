<template>
<div class="grid-3">
  <div
    v-if="isAnyGatewayOffline"
    class="card grid-3__3-columns card--warn"
  >
    <div class="grid-warning">
      <mdi-icon name="mdiAlertOutline" />
      <p class="p text-bold">
        Unable to monitor meters remotely at this moment.
      </p>
    </div>
    <p class="p text-small text-center mt-0-half">
      Meters providing power normally, and tokens can be punched in via Customer Interface Units (CIUs) as usual.
    </p>
  </div>
  <section class="card grid-3__3-columns">
    <grid-status-header
      :grid-status="gridStatus"
      :grid-id="gridId"
      :grid-name="gridMeta.name"
      :customer-meter-link="`/grid/${ gridId }/customers/`"
    >
      <nxt-button
        title="Grid info"
        class="pull-right"
        icon-name="mdiInformationVariant"
        icon-only
        @click="openGridInfoModal"
      />
    </grid-status-header>
    <live-generation-status
      v-if="showProductionInfo"
      :grid-meta="gridMeta"
    />
  </section>
  <block-revenue
    ref="blockRevenue"
    :grid-meta="gridMeta"
    :num-customers="gridStatus.customer_count"
    class="card dashboard-card"
  />
  <block-top-customers
    ref="blockTopCustomers"
    :grid-meta="gridMeta"
    class="card dashboard-card"
  />
  <block-uptime
    :grid-meta="gridMeta"
    class="card dashboard-card"
  />
  <section
    v-if="iframeChartUrl"
    class="card grid-3__3-columns"
  >
    <header class="card-header">
      <div class="pull-right">
        <period-picker-dialog
          initial="Last 7 days"
          max="today"
          @pick="val => range = val"
        />
      </div>
    </header>
    <iframe
      :src="iframeChartUrl"
      width="100%"
      height="300"
      frameborder="0"
    ></iframe>
  </section>
</div>
</template>

<script>
import { ref, computed, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { stringify } from 'qs';
import { useAccountStore, useRealtime } from '@nxt/libraries/api-connection';
import { useMetadataStore } from '@/stores/metadata';
import { useNxtModal } from '@nxt/components/NxtModal';
import { supabaseRepo } from '@/repo/supabaseRepo';
import { storeToRefs } from 'pinia';

import { LiveGenerationStatus, PeriodPickerDialog } from '@nxt/components';
import { GridStatusHeader } from '@nxt/components/dashboard';
import { BlockRevenue, BlockTopCustomers, BlockUptime } from '@nxt/components/dashboard/blocks';
import GridInfoModal from '@/components/modals/GridInfoModal.vue';

const { VITE_GRAFANA_API_URL } = import.meta.env;

export default {
  setup() {
    const route = useRoute();
    const toast = useToast();
    const accountStore = useAccountStore();
    const { gridMeta } = storeToRefs(useMetadataStore());
    const nxtModal = useNxtModal();

    const { gridId } = route.params;

    const showProductionInfo = computed(() =>
      gridMeta.value?.generation_external_gateway_id && gridMeta.value?.is_generation_managed_by_nxt_grid);

    const blockRevenue = ref();
    const blockTopCustomers = ref();

    const gridStatus = ref({});

    const getGridStatus = () => supabaseRepo.client
      .rpc('get_grid_status', { grid_id: gridId })
      .maybeSingle()
      .then(supabaseRepo.handleResponse)
      .then(data => { gridStatus.value = data; })
      .catch(err => {
        const title = 'Error fetching grid status info';
        console.error(title, err);
        toast.error(`${ title }: ${ err.message }`);
      })
    ;
    getGridStatus();

    const isAnyGatewayOffline = ref(false);
    const getGatewaysStatus = () => supabaseRepo.client
      .from('dcus')
      .select('is_online')
      .eq('grid_id', gridId)
      .then(supabaseRepo.handleResponse)
      .then(_gateways => {
        isAnyGatewayOffline.value = _gateways.some(({ is_online }) => is_online === false);
      })
      .catch(err => {
        const title = 'Error fetching grid gateway info';
        console.error(title, err);
        toast.error(`${ title }: ${ err.message }`);
      })
    ;
    getGatewaysStatus();


    /**
     * Grafana Chart
    **/

    const range = ref({
      from: null,
      to: null,
    });

    accountStore.checkGrafanaToken();

    const iframeChartUrl = computed(() => {
      if(!gridMeta.value?.name ||
        !showProductionInfo.value ||
        !accountStore.grafanaToken
      ) return null;

      const params = {
        theme: 'light',
        from: range.value.from,
        to: range.value.to,
        'var-grid_name': gridMeta.value.name,
        'var-victron_id': gridMeta.value.generation_external_site_id,
        'auth_token': accountStore.grafanaToken,
        panelId: 18,
      };

      return VITE_GRAFANA_API_URL + '?' + stringify(params);
    });


    /**
     * Interaction
    **/

    const openGridInfoModal = () => {
      nxtModal.open(GridInfoModal, {
        props: {
          header: gridMeta.value.name + ' grid info',
        },
        data: {
          gridMeta: gridMeta.value,
        },
      });
    };


    /**
     * Realtime
    **/

    const refreshRevenues = () => {
      setTimeout(() => {
        blockRevenue.value?.refreshData();
        blockTopCustomers.value?.refreshData();
      }, 1000);
    };

    const channelUnsubscribe = useRealtime().addChannel(sbClient => {
      const channel = sbClient.channel('eos_grid_dashboard');

      channel.on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'grids',
        filter: `id=eq.${ gridId }`,
      }, getGridStatus);

      channel.on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ducs',
        filter: `grid_id=eq.${ gridId }`,
      }, getGatewaysStatus);

      channel.on('postgres_changes', {
        // No point to INSERT because historical_grid_id
        // is added later, after the initial insert event
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `historical_grid_id=eq.${ gridId }`,
      }, refreshRevenues);

      return channel;
    });

    onBeforeUnmount(channelUnsubscribe);

    return { gridId, gridStatus, isAnyGatewayOffline, showProductionInfo, gridMeta, range, iframeChartUrl, blockRevenue, blockTopCustomers, openGridInfoModal };
  },

  components: { GridStatusHeader, LiveGenerationStatus, PeriodPickerDialog, BlockRevenue, BlockTopCustomers, BlockUptime },
};
</script>
