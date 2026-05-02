<template>
<iframe
  v-if="src"
  class="walkaround-iframe"
  :src="src"
></iframe>
<div v-else class="walkaround-iframe center-content">
  <p>No walkaround view for this grid</p>
</div>
</template>

<script>
import { useMetadataStore } from '@/stores/metadata';

export default {
  setup() {
    const walkthroughId = useMetadataStore().gridMeta.walkthrough_external_id;
    const src = walkthroughId ? `https://www.mapillary.com/embed?image_key=${ walkthroughId }&style=classic` : undefined;

    return { src };
  },
};
</script>

<style lang="scss">
.walkaround-iframe {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: 0;
}
</style>
