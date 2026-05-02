<template>
<dashboard-shell profile-link-to="/my-profile">
  <template #header>
    <branded-header-logo />
    <div class="dashboard-header__actions">
      <realtime-status />
      <global-search-box
        :use-customers-with-meters="true"
        style="margin-left: 8px;"
      />
    </div>
  </template>
  <template #side-menu>
    <app-menu />
  </template>
</dashboard-shell>
</template>

<script>
import { DashboardShell } from '@nxt/components/dashboard';
import { BrandedHeaderLogo } from '@nxt/components';
import { RealtimeStatus } from '@nxt/libraries/api-connection';
import AppMenu from './AppMenu.vue';
import { GlobalSearchBox } from '@nxt/components/dashboard/global-search';

export default {
  components: { DashboardShell, BrandedHeaderLogo, RealtimeStatus, AppMenu, GlobalSearchBox },
};
</script>
