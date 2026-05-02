<template>
<fs-control-predictor
  :grid-id="gridMeta.id"
  :timezone="gridMeta.timezone"
  :read-only="trainingLevel < 1 || !gridMeta.feature_access_config.eos_fs_control"
/>
</template>

<script>
import { useAccountStore } from '@nxt/libraries/api-connection';
import { useDashboardUiStore } from '@nxt/components/dashboard';
import { useMetadataStore } from '@/stores/metadata';
import { storeToRefs } from 'pinia';
import { FsControlPredictor } from '@nxt/components';

export default {
  setup() {
    useDashboardUiStore().addBreadCrumbs([ { label: 'Full Service Control' } ]);
    const { trainingLevel } = storeToRefs(useAccountStore());
    const { gridMeta } = storeToRefs(useMetadataStore());

    return { gridMeta, trainingLevel };
  },

  components: { FsControlPredictor },
};
</script>
