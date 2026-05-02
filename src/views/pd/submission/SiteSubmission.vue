<template>
<header class="site-submission-header">
  <div class="site-submission-header__top">
    <div class="site-submission-header__container">
      <branded-header-logo />
    </div>
  </div>
  <div class="site-submission-header__container site-submission-header__bottom">
    <progress-bar :percentage="progress" />
    <nxt-button
      v-if="progress === 100"
      title="Close form"
      size="small"
      variant="primary"
      icon-only
      icon-name="mdiClose"
      to="/site-submission"
    />
    <nxt-button
      v-else
      title="Reset form"
      size="small"
      variant="primary"
      icon-only
      icon-name="mdiRefresh"
      @click="confirmResetForm"
    />
  </div>
</header>
<main class="main-public main-site-submission">
  <div class="page-site-submission centered-page">
    <router-view />
  </div>
</main>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDraftDesignStore } from '@nxt/components/maps';
import { useSiteSubmissionFormStore } from '@/stores/site-submission';

import { BrandedHeaderLogo, ProgressBar } from '@nxt/components';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const ddStore = useDraftDesignStore();
    const siteStore = useSiteSubmissionFormStore();

    const progress = computed(() => {
      if(route.meta.step === 2) {
        if(ddStore.distributionLines) return 60;
        if(ddStore.outline) return 45;
        return 30;
      }
      if(route.meta.step === 3) return 80;
      if(route.meta.step === 4) return 100;
      return 5;
    });

    const resetForm = () => {
      siteStore.$reset();
      ddStore.$reset();
      router.push('/site-submission/');
    };

    const confirmResetForm = () => {
      const confirmed = confirm('This will remove your answers from all questions, and cannot be undone. Proceed?');
      if(confirmed) resetForm();
    };

    return { progress, confirmResetForm };
  },

  components: { BrandedHeaderLogo, ProgressBar },
};
</script>

<style lang="scss">
.main-site-submission {
  border-top: $dashboard-header-bar-height + 24px solid transparent;
  @media(min-width: $table-break) {
    border-top-width: $dashboard-header-bar-height + 32px;
  }
}

.site-submission-header {
  position: fixed;
  width: 100%;
  z-index: $z-top-bar;

  &__top {
    position: relative;
    display: flex;
    align-items: center;
    height: $dashboard-header-bar-height;
    background-color: $nxt-color-blue-dark;
    z-index: 2;
  }

  &__container {
    width: $dashboard-content-width-mobile;
    margin-inline: auto;
    max-width: 960px;
  }

  &__bottom {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 2px;
    background-color: $nxt-color-white;
    padding-left: 8px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: $sh1;
    z-index: 1;

    color: $nxt-color-blue-lighter;

    @media(min-width: $table-break) {
      column-gap: 4px;
      padding: 0.25rem 8px 0.25rem 12px;
    }
  }

  .header-logo {
    margin: 0;
  }
}

// .page-site-submission {
//   padding-top: 1.25rem;

//   @media(min-width: $table-break) {
//     padding-top: 2rem;
//   }
// }

.nxt-form--full-page {
  .nxt-form-row--2 {
    flex-wrap: wrap;
  }
  .nxt-form-column {
    width: 100%;
  }

  @media(min-width: $ipad-vertical) {
    .nxt-form-row--2 {
      .nxt-form-column {
        width: calc(50% - 8px);
      }
    }
  }
}
</style>
