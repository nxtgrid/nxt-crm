<template>
<section>
  <header class="header-line">
    <h2 class="h2">{{ accountStore.myProfile.organization.name }}</h2>
  </header>
  <div class="grid-3 mt-1">
    <section class="card">
      <header class="card-header">
        <mdi-icon name="mdiWalletBifold" />
        <h3 class="h5">
          Organization wallet
        </h3>
      </header>

      <p class="balance-title">
        Current balance:
      </p>
      <p class="balance-amount">
        ₦ {{ accountStore.myProfile.primary_wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
      </p>

      <footer v-if="accountStore.myProfile.member.training_level > 0" class="card-footer">
        <nxt-button
          size="small"
          icon-name="mdiCurrencyUsd"
          @click="openTopUpModal"
          :disabled="accountStore.isNxtGridMember"
        >
          Buy energy credit
        </nxt-button>
      </footer>
    </section>
  </div>
</section>
<section v-if="grids.length" class="mt-3">
  <header class="header-line">
    <h2 class="h2">Grids</h2>
  </header>
  <ul class="mt-1 grid-3 grid-grid">
    <grid-card
      v-for="grid in grids"
      :key="grid.id"
      :grid="grid"
    >
    </grid-card>
  </ul>
</section>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue';
import { useAccountStore, useRealtime } from '@nxt/libraries/api-connection';
import { supabaseRepo } from '@/repo/supabaseRepo';
import { useNxtModal } from '@nxt/components/NxtModal';

import { TopUpModal } from '@nxt/components/modals';
import GridCard from '@/components/GridCard/GridCard.vue';

export default {
  setup() {
    const accountStore = useAccountStore();
    const nxtModal = useNxtModal();
    const grids = ref([]);

    // Update wallet balance
    accountStore.fetchMyProfile();
    const myOrgId = accountStore.myOrgIdForFiltering;

    const gridsQuery = supabaseRepo.client
      .from('grids')
      .select('id, name, is_fs_on, is_hps_on')
      .is('deleted_at', null)
      .order('name', { ascending: true })
    ;

    if(myOrgId) gridsQuery.eq('organization_id', myOrgId);

    gridsQuery
      .then(supabaseRepo.handleResponse)
      .then(_grids => { grids.value = _grids; })
    ;

    const channelUnsubscribe = useRealtime().addChannel(sbClient => {
      const channel = sbClient.channel('eos_organization_home');

      channel
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `id=eq.${ accountStore.myProfile.primary_wallet.id }`,
        }, accountStore.fetchMyProfile)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'grids',
          filter: myOrgId ? `organization_id=eq.${ myOrgId }` : undefined,
        }, ({ new: _new }) => {
          const grid = grids.value.find(({ id }) => id === _new.id);
          if(grid) {
            grid.is_fs_on = _new.is_fs_on;
            grid.is_hps_on = _new.is_hps_on;
          }
        })
      ;

      return channel;
    });

    onBeforeUnmount(channelUnsubscribe);

    const openTopUpModal = () => {
      nxtModal.open(TopUpModal, {
        props: {
          header: `Buy energy credit for ${ accountStore.myProfile.organization.name }`,
          saveButtonText: 'Purchase',
          withFlutterwave: true,
        },
        data: {
          receiver: {
            type: 'organization',
            name: accountStore.myProfile.organization.name,
            walletId: accountStore.myProfile.primary_wallet.id,
            email: accountStore.myProfile.organization.email,
            phone: accountStore.myProfile.organization.phone,
          },
        },
      });
    };

    return { accountStore, grids, openTopUpModal };
  },

  components: { GridCard },
};
</script>

<style lang="scss">
.balance-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: $nxt-color-blue-lighter;
}

.balance-amount {
  font-weight: 700;
  font-size: 1.625rem;
  color: $nxt-color-blue-highlight;
}

.grid-grid {
  padding: 0;
  list-style: none;
}
</style>
