<template>
<div class="card mt-1">
  <header>
    <h1 class="h2 text-highlight">Site submission form</h1>
  </header>
  <p class="p mt-0-half">
    Here you will submit all information required for us to process the initial information for the site you wish to develop.
  </p>
</div>
<form
  @submit.prevent="goNext"
  class="nxt-form--full-page mb-4"
>
  <div class="card mt-1">
    <div class="nxt-form-row nxt-form-row--2">
      <div class="nxt-form-column">
        <label for="author_full_name">
          Your full name*
        </label>
        <input
          id="author_full_name"
          class="nxt-input"
          v-model="author_full_name"
          required
          :disabled="accountStore.isLoggedIn"
        />
      </div>
      <div class="nxt-form-column">
        <label for="author_email">
          Your e-mail address*
        </label>
        <input
          id="author_email"
          class="nxt-input"
          type="email"
          v-model="author_email"
          required
          :disabled="accountStore.isLoggedIn"
        />
      </div>
    </div>
    <div class="nxt-form-row nxt-form-row--2 mt-1">
      <div class="nxt-form-column">
        <label for="author_organization_name">
          Your company name*
        </label>
        <input
          id="author_organization_name"
          class="nxt-input"
          v-model="author_organization_name"
          required
          :disabled="accountStore.isLoggedIn"
        />
      </div>
    </div>
  </div>
  <div class="card mt-1">
    <div class="nxt-form-row nxt-form-row--2">
      <div class="nxt-form-column">
        <label for="site_name">
          Site name*
        </label>
        <input
          id="site_name"
          class="nxt-input"
          v-model="site_name"
          required
        />
      </div>
      <div class="nxt-form-column">
        <label for="site_state">
          State*
        </label>
        <nxt-select
          id="site_state"
          v-model="site_state"
          :options="states"
          required
          placeholder="Please choose"
        />
      </div>
    </div>

    <p class="p mt-1">
      Please enter the site GPS coordinates (e.g. 9.072264, 7.491302) below
    </p>

    <div class="nxt-form-row nxt-form-row--2 mt-1">
      <div class="nxt-form-column">
        <label for="latitude">
          Latitude*
        </label>
        <input
          id="latitude"
          type="number"
          class="nxt-input nxt-input--hide-spinner"
          v-model="site_latitude"
          inputmode="decimal"
          required
          min="-90"
          max="90"
          step="any"
        />
      </div>
      <div class="nxt-form-column">
        <label for="longitude">
          Longitude*
        </label>
        <input
          id="longitude"
          type="number"
          class="nxt-input nxt-input--hide-spinner"
          v-model="site_longitude"
          inputmode="decimal"
          required
          min="-180"
          max="180"
          step="any"
        />
      </div>
    </div>

    <footer class="card-footer">
      <nxt-button
        type="submit"
        size="small"
        class="pull-right"
      >
        Next
      </nxt-button>
    </footer>
  </div>
</form>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@nxt/libraries/api-connection';
import { useDraftDesignStore } from '@nxt/components/maps';
import { useSiteSubmissionFormStore } from '@/stores/site-submission';
import { cachedStates } from '@/lib/nigerian-states';

import { NxtSelect } from '@nxt/components/form';

export default {
  setup() {
    const router = useRouter();
    const accountStore = useAccountStore();
    const ddStore = useDraftDesignStore();
    const siteStore = useSiteSubmissionFormStore();

    const states = ref(cachedStates);
    // fetchStates()
    //   .then(stateNames => {
    //     states.value = stateNames;
    //   })
    //   .catch(err => {
    //     console.error('Error fetching states', err);
    //   })
    // ;

    const author_full_name = computed({
      get: () => siteStore.author_full_name,
      set: val => siteStore.setValue('author_full_name', val),
    });

    const author_email = computed({
      get: () => siteStore.author_email,
      set: val => siteStore.setValue('author_email', val),
    });

    const author_organization_name = computed({
      get: () => siteStore.author_organization_name,
      set: val => siteStore.setValue('author_organization_name', val),
    });

    const site_name = computed({
      get: () => siteStore.site_name,
      set: val => siteStore.setValue('site_name', val),
    });

    const site_state = computed({
      get: () => siteStore.state,
      set: val => siteStore.setValue('state', val),
    });

    const site_latitude = computed({
      get: () => ddStore.gridLocation.coordinates[1],
      set: val => ddStore.gridLocation.coordinates[1] = val,
    });

    const site_longitude = computed({
      get: () => ddStore.gridLocation.coordinates[0],
      set: val => ddStore.gridLocation.coordinates[0] = val,
    });

    if(accountStore.isLoggedIn) {
      if(author_full_name.value === null) author_full_name.value = accountStore.myProfile.full_name;
      if(author_email.value === null) author_email.value = accountStore.myProfile.email;
      if(author_organization_name.value === null) {
        author_organization_name.value = accountStore.myProfile.organization.name;
        siteStore.setValue('author_organization_id', accountStore.myProfile.organization.id);
      }
    }

    const goNext = () => {
      router.push('/site-submission/outline');
    };

    return {
      accountStore,
      ddStore,
      states,
      author_full_name,
      author_email,
      author_organization_name,
      site_name,
      site_state,
      site_latitude,
      site_longitude,
      goNext,
    };
  },

  components: { NxtSelect },
};
</script>
