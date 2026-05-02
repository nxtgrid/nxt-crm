<template>
<div class="card mt-1">
  <p class="p">
    Please use the map to draw an <span class="text-bold text-highlight">outline</span> around your site, so we can start making initial calculations.
  </p>
</div>

<div class="card card--no-padding stretched-card">
  <draft-design-map class="community-outline"/>

  <footer class="card-footer">
    <nxt-button
      size="small"
      to="/site-submission"
    >
      Back
    </nxt-button>

    <div
      v-if="!ddStore.outline || ddStore.isLoading"
      class="pull-right flex-horizontal"
    >
      <nxt-popover v-if="accountStore.isNxtGridMember" placement="top">
        <template #trigger="{ uid, togglePopover }">
          <nxt-button
            :id="uid"
            variant="tertiary"
            icon-only
            icon-name="mdiCogOutline"
            :disabled="ddStore.isLoading"
            @click="togglePopover"
          />
        </template>
        <draft-design-settings />
      </nxt-popover>
      <nxt-button
        v-if="!ddStore.outlineDrawing && !ddStore.isLoading"
        size=small
        @click="siteOutlineDriver.drive()"
      >
        Help
      </nxt-button>
      <nxt-button
        size="small"
        :is-loading="ddStore.isLoading"
        @click="ddStore.submitOutline"
        :disabled="!ddStore.outlineDrawing || ddStore.isLoading"
      >
        Calculat{{ ddStore.isLoading ? 'ing' : 'e' }}
      </nxt-button>
    </div>
    <div
      v-else
      class="pull-right flex-horizontal"
    >
      <nxt-button
        title="Restart"
        variant="tertiary"
        icon-only
        icon-name="mdiRefresh"
        @click="ddStore.clearGeo"
      />
      <nxt-button
        size="small"
        @click="goNext"
        :disabled="ddStore.gotError"
      >
        Next
      </nxt-button>
    </div>
  </footer>
</div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAccountStore } from '@nxt/libraries/api-connection';
import { useSiteSubmissionFormStore } from '@/stores/site-submission';
import { CENTER_NIGERIA } from '@nxt/libraries/constants';
import { siteOutlineDriver } from './siteOutlineDriver';

import { NxtPopover } from '@nxt/components';
import { DraftDesignMap, DraftDesignSettings, useDraftDesignStore } from '@nxt/components/maps';

export default {
  setup() {
    const router = useRouter();
    const accountStore = useAccountStore();
    const siteStore = useSiteSubmissionFormStore();
    const ddStore = useDraftDesignStore();

    const goNext = () => {
      router.push('/site-submission/details');
    };

    return {
      CENTER_NIGERIA,
      accountStore,
      siteStore,
      ddStore,
      siteOutlineDriver,
      goNext,
    };
  },

  components: { NxtPopover, DraftDesignMap, DraftDesignSettings },
};
</script>

<style lang="scss">
.stretched-card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-block: 1rem;

  .card-footer {
    margin-top: 0;
    padding: 1rem $card-padding-inline-mobile;

    @media(min-width: $table-break) {
      padding: 1rem $card-padding-inline;
    }
  }
}

.community-outline {
  flex: 1 1 0;
}
</style>
