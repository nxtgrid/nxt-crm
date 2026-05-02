import { useDashboardUiStore } from '@nxt/components/dashboard';
import { useMetadataStore } from '@/stores/metadata';

const inferBaseRoute = route => route.path.split('/').filter(Boolean)[0];

export const setBaseBreadCrumbs = route => {
  const uiStore = useDashboardUiStore();
  const metadataStore = useMetadataStore();

  uiStore.setBreadCrumbs(null);

  if(route.meta.noCrumbs) return;

  const baseRoute = inferBaseRoute(route);
  let baseCrumbs = null;

  if(baseRoute === 'grid') {
    baseCrumbs = [ {
      path: `/grid/${ route.params.gridId }`,
      label: metadataStore.gridMeta.name,
    } ];
  }

  uiStore.setBreadCrumbs(baseCrumbs);
};
