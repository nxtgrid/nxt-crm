<template>
<app-shell-public v-if="route.meta.public" />
<login-overlay v-else-if="route.name === 'login'" />
<app-shell v-else-if="isLoggedIn" />
<sw-reload-prompt />
</template>

<script>
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@nxt/libraries/api-connection';

import { LoginOverlay, SwReloadPrompt } from '@nxt/components';
import AppShellPublic from './AppShellPublic.vue';
import AppShell from './AppShell.vue';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { isLoggedIn } = storeToRefs(useAccountStore());

    // We watch for log out "events" and always push user
    // back to login page if it happens.
    watch(isLoggedIn, (newVal, oldVal) => {
      if(oldVal && !newVal) router.push('/login');
    });

    return { route, isLoggedIn };
  },

  components: { AppShellPublic, AppShell, LoginOverlay, SwReloadPrompt },
};
</script>
