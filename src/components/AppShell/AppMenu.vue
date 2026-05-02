<template>
<div
  v-if="metaStore.firstLoaded"
  class="nav-wrapper"
  @click="ui.closeMenu"
>
  <transition name="nav-slide-level-2">
    <dashboard-nav
      v-if="navGridItems"
      :nav-items="navGridItems"
      :grid-meta="metaStore.gridMeta"
      :disabled="!metaStore.gridMeta"
      with-local-info
    />
  </transition>
  <transition name="nav-slide-level-1">
    <dashboard-nav
      v-if="!navGridItems"
      :nav-items="navRootItems"
    />
  </transition>
</div>
</template>

<script>
import { computed } from 'vue';
import { DashboardNav, useDashboardUiStore } from '@nxt/components/dashboard';
import { useMetadataStore } from '@/stores/metadata';

export default {
  components: { DashboardNav },

  setup() {
    const metaStore = useMetadataStore();
    const uiStore = useDashboardUiStore();

    const navRootItems = [
      {
        label: 'Dashboard',
        path: '/',
        icon: 'mdiMonitorDashboard',
      },
      {
        label: 'Transactions',
        path: '/transactions/',
        icon: 'mdiCashMultiple',
      },
      {
        label: 'Members',
        path: '/members/',
        icon: 'mdiCrowd',
      },
    ];

    const navGridItems = computed(() => {
      if(!metaStore.gridMeta) return;

      const basePath = `/grid/${ metaStore.gridMeta.id }`;
      return [
        {
          label: 'Back',
          path: '/',
          icon: 'mdiArrowLeft',
        },
        {
          label: 'Grid Status',
          path: basePath + '/dashboard/',
          icon: 'mdiSolarPowerVariantOutline',
        },
        {
          label: 'Issues',
          path: basePath + '/issues/',
          icon: 'mdiAlertCircleOutline',
        },
        {
          label: 'Customers',
          path: basePath + '/customers/',
          icon: 'mdiAccountGroupOutline',
        },
        {
          label: 'Agents',
          path: basePath + '/agents/',
          icon: 'mdiHumanGreetingProximity',
        },
        {
          label: 'Top-ups',
          path: basePath + '/top-ups/',
          icon: 'mdiCurrencyUsd',
        },
        metaStore.gridMeta.feature_access_config.eos_fs_control && {
          label: 'Full Service Control',
          path: basePath + '/full-service-control/',
          icon: 'mdiSunClockOutline',
        },
        {
          label: 'Walkaround',
          path: basePath + '/walkaround/',
          icon: 'mdiMapMarkerPath',
        },
      ].filter(Boolean);
    });

    return { ui: uiStore, metaStore, navRootItems, navGridItems };
  },
};
</script>

