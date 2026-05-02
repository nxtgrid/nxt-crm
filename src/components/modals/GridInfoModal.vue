<template>
<dl class="details-list grid-info-list">
  <dt>Location</dt>
  <dd><lat-long :lat="allInfo.location_geom?.coordinates[1]" :long="allInfo.location_geom?.coordinates[0]" /></dd>
  <dt>Commissioned at</dt>
  <dd>{{ allInfo.commissioned_at ? prettyDate(allInfo.commissioned_at, { withTime: false }) : '-' }}</dd>
  <template
    v-for="item in infoItems"
    :key="item.key"
  >
    <dt>
      {{ item.name }}
    </dt>
    <dd :class="item.class">
      {{ item.isNumber ? allInfo[item.key]?.toLocaleString() : allInfo[item.key] }} {{ item.unit }}
    </dd>
  </template>
</dl>
</template>

<script>
import { computed, ref } from 'vue';
import { supabaseRepo } from '@/repo/supabaseRepo';
import { useNxtModal } from '@nxt/components/NxtModal';
import { prettyLocalizedDateTime } from '@nxt/libraries/date-helpers';

import { LatLong } from '@nxt/components';

export default {
  setup() {
    const modal = useNxtModal();

    const { gridMeta } = modal.data;
    const prettyDate = prettyLocalizedDateTime(gridMeta.timezone);
    const gridInfo = ref({});

    supabaseRepo.client
      .from('grids')
      .select(`
        location_geom,
        commissioned_at,
        kwp,
        kwh,
        kwh_tariff_essential_service,
        kwp_tariff,
        kwh_tariff,
        default_hps_connection_fee,
        default_fs_3_phase_connection_fee
      `)
      .eq('id', gridMeta.id)
      .maybeSingle()
      .then(supabaseRepo.handleResponse)
      .then(data => { gridInfo.value = data; })
    ;

    const allInfo = computed(() => ({
      ...gridMeta,
      ...gridInfo.value,
    }));

    const infoItems = [
      {
        name: 'Solar PV',
        key: 'kwp',
        unit: 'kWp',
        isNumber: true,
      },
      {
        name: 'Lithium storage',
        key: 'kwh',
        unit: 'kWh',
        isNumber: true,
      },
      {
        name: 'Energy tariff',
        key: 'kwh_tariff_essential_service',
        unit: '₦/kWh',
        isNumber: true,
      },
      {
        name: 'Monthly PV rental fee',
        key: 'kwp_tariff',
        unit: '$/kWp',
        isNumber: true,
      },
      {
        name: 'Monthly storage rental fee',
        key: 'kwh_tariff',
        unit: '$/kWh',
        isNumber: true,
      },
      {
        name: 'Monthly costs',
        key: 'monthly_rental',
        unit: '₦',
        isNumber: true,
      },
      {
        name: 'Single phase connection fee',
        key: 'default_hps_connection_fee',
        unit: '₦',
        isNumber: true,
      },
      {
        name: 'Three phase connection fee',
        key: 'default_fs_3_phase_connection_fee',
        unit: '₦',
        isNumber: true,
      },
    ];

    return { allInfo, infoItems, prettyDate };
  },

  components: { LatLong },
};
</script>

<style lang="scss">
.grid-info-list {
  padding-top: 1rem;
  border-top: thin solid $nxt-color-blue-light;
  grid-template-columns: 1fr 1fr;

  dd {
    word-break: unset;
  }
}
</style>
