<template>
<div class="card mt-1">
  <header class="card-header">
    <h1 class="h2">
      Thank you for submitting the <span class="text-highlight">{{ sitesStore.submissions[0]?.site_name }}</span> site
    </h1>
  </header>
  <p class="p">
    Our staff will follow up on this submission, and provide you with log-in credentials for our platform.
    <br><br>
    Once log in you will have access to many more features and a much more detailed mini-grid design.
    <br><br>
    From there on out we can start working together to make this mini-grid a reality!
  </p>
</div>

<div class="card mt-1 mb-4">
  <header class="card-header">
    <h2 class="h2">
      Your submissions
    </h2>
  </header>
  <nxt-table
    provider="raw-data"
    :data-entries="sitesStore.submissions"
    :columns="columns"
    variant="in-card"
    :pagination="false"
  />
</div>
</template>

<script>
import { useSiteSubmissionStore } from '@/stores/site-submission';
import { NxtTable } from '@nxt/components';

export default {
  setup() {
    const sitesStore = useSiteSubmissionStore();

    const columns = [
      {
        field: 'site_name',
        header: 'Name',
      },
    ];

    return { sitesStore, columns };
  },

  components: { NxtTable },
};
</script>
