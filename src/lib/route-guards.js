import { useAccountStore } from '@nxt/libraries/api-connection';
import { useToast } from 'vue-toastification';
import { useDashboardUiStore } from '@nxt/components/dashboard';
import { useMetadataStore } from '@/stores/metadata';
import { supabaseRepo } from '@/repo/supabaseRepo';
import { setBaseBreadCrumbs } from './bread-crumbs';

export const applyRouteGuards = router => {
  router.beforeEach(async (to, from) => {
    if(to.meta.public ) return true;

    const accountStore = useAccountStore();
    const metadataStore = useMetadataStore();
    const isFirstRoute = from.name === undefined;

    // If this is the first route, we await Supabase session, so we're
    // sure we have the latest session data. This is handled in the
    // supabaseRepo internals.
    if(isFirstRoute) await supabaseRepo.client.auth.getSession();

    if(to.name === 'login') {
      if(accountStore.isLoggedIn) accountStore.doLogOut();
      return true;
    }

    if(!accountStore.isLoggedIn) {
      accountStore.setRedirectAfterLogin(to);
      return '/login';
    }

    if(!accountStore.myProfile) {
      // We wait for user meta to be fetched, which saves us
      // a lot of conditional logic in the consuming code
      await accountStore.fetchMyProfile();

      if(accountStore.myProfile.customer) {
        useToast().error('You\'re not allowed to use this application. Please use https://pay.nxtgrid.co instead.',
          { timeout: false, closeOnClick: false, draggable: false });
        accountStore.doLogOut();
        return false;
      }
      if(accountStore.myProfile.agent) {
        useToast().error('You can\'t use this application as an agent. Please use https://pay.nxtgrid.co instead.',
          { timeout: false, closeOnClick: false, draggable: false });
        accountStore.doLogOut();
        return false;
      }
      if(accountStore.myProfile.member?.member_type === 'TECH') {
        useToast().error('You can\'t use this application as a technician. Please use https://sphinx.nxtgrid.co/ instead.',
          { timeout: false, closeOnClick: false, draggable: false });
        accountStore.doLogOut();
        return false;
      }
    }

    if(to.params.gridId && to.params.gridId !== from.params.gridId) {
      await metadataStore.fetchGridMeta(to.params.gridId);
    }

    if(!metadataStore.firstLoaded)
      metadataStore.setFirstLoaded(true);

    setBaseBreadCrumbs(to);
  });

  router.afterEach((to, from) => {
    const accountStore = useAccountStore();
    const metadataStore = useMetadataStore();
    // Remove grid metadata if we're navigating away from a grid
    if((from.params.gridId && !to.params.gridId) && !([ 'search', 'my--profile' ].includes(to.name))) {
      metadataStore.setGridMeta(null);
    }
    const orgName = accountStore.myProfile?.organization.name;
    const gridName = metadataStore.gridMeta?.name;
    const entityName = gridName ?? orgName;
    const newTitle = (to.meta.pageTitle ?? 'Dashboard').replace('%s', entityName);

    useDashboardUiStore().setPageTitle(newTitle);
  });
};
