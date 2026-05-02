<template>
<router-view />
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    return { route };
  },
};
</script>

<style lang="scss">
.main-public {
  position: relative;
  width: 100%;
}

.centered-box {
  width: $dashboard-content-width-mobile;
  max-width: 460px;
}

.centered-page {
  display: flex;
  flex-direction: column;
  width: $dashboard-content-width-mobile;
  margin-inline: auto;
  min-height: 100%;
  max-width: 960px;
}
</style>
