<template>
<div class="grid-2-1">
  <template v-if="isLoadingCustomer">
    <div>
      <div class="scc scc-card"></div>
      <div class="scc scc-card mt-1"></div>
    </div>
    <div class="scc scc-card"></div>
  </template>
  <template v-else>
    <div>
      <section class="card">
        <header class="card-header">
          <h2 class="mb-1 h2--flexed">
            {{ customer.account.full_name }}
            <span
              v-if="customer.lives_primarily_in_the_community !== true"
              class="text-small text-regular"
            >
              (Lives outside the community)
            </span>
          </h2>
          <nxt-button
            title="Edit customer"
            class="pull-right"
            icon-name="mdiAccountEditOutline"
            icon-only
            @click="openCustomerEditModal"
          />
        </header>
        <dl class="details-list details-list--large">
          <dt>
            Phone
          </dt>
          <dd>
            <a
              v-if="customer.account.phone"
              class="link-inline"
              :href="`tel:${ customer.account.phone }`"
            >
              {{ formatPhone(customer.account.phone) }}
            </a>
            <span v-else>-</span>
          </dd>
          <dt>
            Location
          </dt>
          <dd>
            <lat-long :lat="customer.latitude" :long="customer.longitude" />
          </dd>
          <template v-if="connectionFeePaymentStillOpen > 0">
            <dt>
              Connection fee payable
            </dt>
            <dd>
              ₦ {{ customer.total_connection_fee - customer.total_connection_paid }}
            </dd>
            <template v-if="customer.total_connection_paid > 0">
              <dt>
                Already paid
              </dt>
              <dd>
                ₦ {{ customer.total_connection_paid }}
              </dd>
            </template>
          </template>
          <template v-else-if="canReverseConnectionFees">
            <dt>
              Connection fee paid
            </dt>
            <dd>
              ₦ {{ customer.total_connection_paid }}
            </dd>
          </template>
        </dl>
        <footer v-if="accountStore.trainingLevel > 0 && (canPayConnectionFees || canReverseConnectionFees || (customer.wallet && isAsaba))" class="card-footer">
          <nxt-button
            v-if="canPayConnectionFees"
            size="small"
            icon-name="mdiCashLockOpen"
            @click="openPayConnectionFeeModal"
          >
            Pay connection fee
          </nxt-button>
          <nxt-button
            v-if="canReverseConnectionFees"
            size="small"
            icon-name="mdiChevronDoubleLeft"
            @click="openReverseConnectionFeeModal"
          >
            Reverse connection payment
          </nxt-button>
          <nxt-button
            v-if="customer.wallet && isAsaba"
            size="small"
            icon-name="mdiCurrencyUsd"
            @click="openTopUpModal"
          >
            Top-up customer wallet
          </nxt-button>
        </footer>
      </section>

      <template v-if="meters.length">
        <meter-card-basic
          v-for="meter in meters"
          :key="meter.id"
          class="mt-1"
          :meter="meter"
          :is-dual-meter-grid="isDualMeterGrid"
          :show-actions="accountStore.trainingLevel > 0"
        />
      </template>
    </div>
    <div class="card card--no-padding overflow-hidden customer-map">
      <mapbox-map
        :center="[ customer.longitude, customer.latitude ]"
        :zoom="17"
        :add-fullscreen-control="true"
      >
        <mapbox-marker-simple :lngLat="[ customer.longitude, customer.latitude ]" />
      </mapbox-map>
    </div>
  </template>
</div>

<nxt-only>
  <ul>
    <li>How do we represent location? Customer location? Meter(s) location? Both?</li>
    <li>How to represent (actionable) issues?</li>
    <li>How much of (upcoming) FS state do we want to show here?</li>
  </ul>
</nxt-only>

<section
  v-for="({ id, external_reference }) in meters"
  :key="id"
  class="card card--with-table grid-3__3-columns mt-1"
>
  <header class="card-header">
    <h2 class="h2">Latest top-ups <template v-if="meters.length > 1">({{ external_reference }})</template></h2>
    <router-link
      :to="`${ currentPath }top-ups/${ id }/`"
      class="link-inline text-bold pull-right"
    >
      See all
    </router-link>
  </header>
  <topups-table
    :static-limit="3"
    :meter_id="id"
    :grid_id="gridId"
  />
</section>

<section
  v-for="({ id, external_reference }) in meters"
  :key="id"
  class="card card--with-table grid-3__3-columns mt-1"
>
  <header class="card-header">
    <h2 class="h2">Latest commands <template v-if="meters.length > 1">({{ external_reference }})</template></h2>
    <router-link
      :to="`${ currentPath }interactions/${ id }/`"
      class="link-inline text-bold pull-right"
    >
      See all
    </router-link>
  </header>
  <meter-interactions-table
    :static-limit="3"
    :meter_id="id"
    @first-static-fetch="data => sendTestMessageIfPrudentFor(id)(data)"
  />
</section>

<div v-if="isLoadingCustomer || isLoadingNotes" class="scc scc-card mt-1"></div>
<section v-else class="card card--with-table mt-1">
  <header class="card-header">
    <h2 class="h2">Notes</h2>
  </header>
  <note-form
    v-if="accountStore.trainingLevel > 0"
    :customer-id="customer.id"
    :on-success="fetchNotes"
  />
  <nxt-table
    provider="raw-data"
    :data-entries="notes"
    :columns="notesColumns"
    :on-edit-click="doEditNote"
    variant="in-card"
    :pagination="false"
  ></nxt-table>
</section>
</template>

<script>
import { ref, computed, onBeforeUnmount } from 'vue';
import { sort } from 'ramda';
import { useRoute } from 'vue-router';
import { useAccountStore, useRealtime } from '@nxt/libraries/api-connection';
import { useDashboardUiStore } from '@nxt/components/dashboard';
import { useMetadataStore } from '@/stores/metadata';
import { supabaseRepo } from '@/repo/supabaseRepo';
import { formatPhone } from '@nxt/libraries/phone-helpers';

import { NxtTable, NoteForm, NxtOnly, LatLong } from '@nxt/components';
import { useNxtModal } from '@nxt/components/NxtModal';
import { AddOrEditCustomerModal, TopUpModal, ReverseConnectionFeeModal } from '@nxt/components/modals';
import { MapboxMap } from '@nxt/components/maps';
import MapboxMarkerSimple from '@nxt/components/maps/markers/MapboxMarkerSimple.vue';
import { MeterCardBasic } from '@nxt/components';
import { TopupsTable, MeterInteractionsTable } from '@nxt/components/tables';
import { restRepo } from '@/repo/restRepo';

export default {
  setup() {
    const route = useRoute();
    const accountStore = useAccountStore();
    const uiStore = useDashboardUiStore();
    const nxtModal = useNxtModal();

    const { gridId, customerId } = route.params;
    const currentPath = computed(() => `/grid/${ gridId }/customer/${ customerId }/`);

    const customer = ref();
    const isLoadingCustomer = ref(true);
    const isDualMeterGrid = useMetadataStore().gridMeta.uses_dual_meter_setup;

    // Sort meters by HPS first as long as we have a dual meter grid (Belel)
    const meters = computed(() => {
      const meters = customer.value?.connection?.meters;
      if(!meters) return [];
      if(meters.length === 1) return meters;
      return sort(({ meter_type }) => meter_type === 'HPS' ? -1 : 1, meters);
    });

    const connectionFeePaymentStillOpen = computed(() => customer.value?.total_connection_fee - customer.value?.total_connection_paid);
    const canPayConnectionFees = computed(() => connectionFeePaymentStillOpen.value > 0 && customer.value?.connection);
    const canReverseConnectionFees = computed(() => meters.value.length < 1 && customer.value?.total_connection_paid > 0);

    // @TEMPORARY :: Asaba feature flag
    const isAsaba = gridId === '50';

    const fetchCustomerData = () => supabaseRepo
      .getCustomer(customerId)
      .then(({ connections, ...rest }) => {
        customer.value = { ...rest, connection: connections?.[0] }; // We have only one connection per customer
        uiStore.addBreadCrumbs([ {
          label: customer.value.account.full_name,
          refreshKey: 'customer.account.full_name',
        } ]);
        isLoadingCustomer.value = false;
      })
    ;

    const sendTestMessageIfPrudentFor = meter_id => fetchedInteractions => {
      const hasNonePending = !fetchedInteractions
        .map(({ meter_interaction_status }) => meter_interaction_status)
        .some(status => [ 'DEFERRED', 'SUSPENDED', 'QUEUED', 'PROCESSING' ].includes(status))
      ;
      if(hasNonePending) restRepo
        .createMeterInteraction({
          meter_id: parseInt(meter_id),
          meter_interaction_type: 'READ_CREDIT',
        })
      ;
    };


    /**
     * Realtime
    **/

    let channelUnsubscribe;

    const initRealtime = () => {
      channelUnsubscribe = useRealtime().addChannel(sbClient => {
        const channel = sbClient.channel('eos_customer_meter');
        channel.on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'customers',
          filter: `id=eq.${ customerId }`,
        }, fetchCustomerData);

        const meterIds = meters.value.map(({ id }) => id);
        if(meterIds.length) {
          channel.on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'meters',
            filter: `id=in.(${ meterIds.join(', ') })`,
          }, fetchCustomerData);
        }
        return channel;
      });
    };

    onBeforeUnmount(() => { channelUnsubscribe?.(); });

    fetchCustomerData().then(() => {
      uiStore.setPageTitle(`Customer ${ customer.value.account.full_name }`);
      initRealtime();
    });


    /**
     * Interaction
    **/

    const openCustomerEditModal = () => {
      nxtModal.open(AddOrEditCustomerModal, {
        props: {
          header: 'Edit customer',
          limited: true,
        },
        data: {
          customer: {
            id: customer.value.id,
            full_name: customer.value.account.full_name,
            phone: customer.value.account.phone,
            email: customer.value.account.email,
            // Needed even though we don't update them (backend doesn't do partial updates)
            latitude: customer.value.latitude,
            longitude: customer.value.longitude,
            is_hidden_from_reporting: customer.value.is_hidden_from_reporting,
          },
        },
      });
    };

    const openPayConnectionFeeModal = () => {
      nxtModal.open(TopUpModal, {
        props: {
          header: `Pay ${ customer.value.account.full_name }'s connection fee`,
          saveButtonText: 'Pay',
          amountStep: 'any',
        },
        data: {
          receiver: {
            type: 'connection',
            name: customer.value.account.full_name,
            walletId: customer.value.connection.wallet.id,
          },
          presetAmount: connectionFeePaymentStillOpen,
        },
      });
    };

    const openReverseConnectionFeeModal = () => {
      nxtModal.open(ReverseConnectionFeeModal, {
        props: {
          header: `Return ${ customer.value.total_connection_paid } ${ customer.value.connection.currency } to ${ customer.value.grid.organization.name }'s wallet`,
        },
        data: {
          sender_wallet_id: customer.value.connection.wallet.id,
          receiver_wallet_id: customer.value.grid.organization.wallet.id,
          amount: customer.value.total_connection_paid,
          currency: customer.value.connection.currency,
        },
      });
    };

    const openTopUpModal = () => {
      nxtModal.open(TopUpModal, {
        props: {
          header: `Top up ${ customer.value.account.full_name }'s wallet`,
        },
        data: {
          receiver: {
            type: 'customer',
            name: customer.value.account.full_name,
            walletId: customer.value.wallet.id,
          },
        },
      });
    };


    /**
     * Notes
    **/

    const isLoadingNotes = ref(true);
    const notes = ref([]);
    const fetchNotes = () => supabaseRepo.client
      .from('notes')
      .select(`
        id,
        created_at,
        message,
        author:accounts(
          full_name,
          member:members(
            id
          )
        ),
        connection:connections(
          id
        ),
        meter:meters(
          external_reference
        )
      `)
      .eq('customer_id', customerId)
      .limit(3)
      .then(supabaseRepo.handleResponse)
      .then(_notes => {
        notes.value = _notes;
        isLoadingNotes.value = false;
      })
    ;

    fetchNotes();

    const notesColumns = [
      {
        field: 'created_at',
        header: 'Date',
        component: 'DateTime',
      },
      {
        field: 'author.full_name',
        header: 'Author',
      },
      {
        field: 'message',
        header: 'Message',
        component: 'Note',
      },
      {
        hasEdit: true,
        allowEdit: data => data.author?.member?.id === accountStore.myProfile.member.id,
        editIcon: 'mdiTextBoxEditOutline',
      },
    ];

    const doEditNote = ({ id, message }) => {
      const newMessage = prompt('Update note', message);
      if(newMessage && newMessage !== message) {
        supabaseRepo.client
          .from('notes')
          .update({ message: newMessage })
          .eq('id', id)
          .then(supabaseRepo.handleResponse)
          .then(fetchNotes)
        ;
      }
    };

    return {
      gridId,
      accountStore,
      currentPath,
      isDualMeterGrid,
      isLoadingCustomer,
      customer,
      meters,
      connectionFeePaymentStillOpen,
      canPayConnectionFees,
      canReverseConnectionFees,
      fetchCustomerData,
      sendTestMessageIfPrudentFor,
      openCustomerEditModal,
      openPayConnectionFeeModal,
      openReverseConnectionFeeModal,
      openTopUpModal,
      isLoadingNotes,
      notes,
      fetchNotes,
      notesColumns,
      doEditNote,
      formatPhone,
      isAsaba,
    };
  },

  components: { NxtTable, TopupsTable, MeterInteractionsTable, NoteForm, NxtOnly, LatLong, MeterCardBasic, MapboxMap, MapboxMarkerSimple },
};
</script>

<style lang="scss">
.customer-map {
  height: 300px;
  margin-top: 1rem;
}

@media(min-width: $ipad-vertical) {
  .customer-map {
    height: auto;
    margin-top: 0;
  }

  .grid-2-1 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }
}
</style>
