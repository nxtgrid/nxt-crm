<template>
<form
  class="nxt-form--full-page mb-4"
  @submit.prevent="goNext"
>
  <div class="card mt-1">
    <div class="nxt-form-column">
      <p class="p mb-1 text-as-label">
        Is your company NEP pre-qualified ie. for the performance base grant?
      </p>
      <nxt-radio-buttons
        v-model="is_nep_prequalified"
        :options="yesNoNull"
        required
      />
    </div>
    <div class="nxt-form-column nxt-form-column--border-top pt-1 mt-2 mb-1">
      <p class="p mb-1 text-as-label">
        Is the exclusivity agreement signed?
      </p>
      <nxt-radio-buttons
        v-model="has_signed_exclusivity_agreement"
        :options="yesNoNull"
        required
      />
    </div>
  </div>

  <div class="card mt-1">
    <div class="nxt-form-column pb-1">
      <p class="p mb-1 text-as-label">
        Do you already have startup capital (you will be asked to show bank statement)?
      </p>
      <nxt-radio-buttons
        v-model="has_startup_capital"
        :options="yesNo"
        required
      />
    </div>

    <awesome-accordion :is-open="has_startup_capital === true">
      <div class="nxt-form-column nxt-form-column--border-top mt-1 py-1">
        <label for="startup_capital_amount" style="margin-bottom: 1rem;">
          How much startup capital have you allocated for this project?
        </label>
        <div class="nxt-input-with-prefix">
          <span class="nxt-input-prefix text-bold">₦</span>
          <input
            id="startup_capital_amount"
            type="number"
            class="nxt-input nxt-input--hide-spinner"
            style="max-width: 160px"
            v-model="startup_capital_amount"
            min="0"
            required
          />
        </div>
      </div>
    </awesome-accordion>
  </div>

  <div class="card mt-1">
    <div class="nxt-form-column mb-1">
      <p class="p mb-1 text-as-label">
        Is there a community wide genset?
      </p>
      <nxt-radio-buttons
        v-model="has_community_genset"
        :options="yesNoNull"
        required
      />
    </div>
  </div>

  <div class="card mt-1">
    <div class="nxt-form-column">
      <p class="p mb-1 text-as-label">
        Does a pre-existing distribution network exist?
      </p>
      <nxt-radio-buttons
        v-model="has_preexisting_distribution_network"
        :options="yesNoNull"
        required
      />
    </div>

    <awesome-accordion
      :is-open="has_preexisting_distribution_network === true"
      style="margin-inline: -4px; padding-inline: 4px;"
    >
      <div class="nxt-form-column nxt-form-column--border-top mt-2 py-1">
        <label for="distribution_network_owner" style="margin-bottom: 1rem;">
          Who owns the distribution network eg. community, DisCo?
        </label>
        <input
          id="distribution_network_owner"
          class="nxt-input"
          v-model="distribution_network_owner"
          required
        />
      </div>
      <div class="nxt-form-column pb-0-half">
        <label for="distribution_network_coverage" style="margin-bottom: 1rem;">
          Choose the % of distribution existing in the community (eg. 50% means half the poles and wires are present only)?
        </label>
        <nxt-select
          id="distribution_network_coverage"
          v-model="distribution_network_coverage"
          :options="coverageOptions"
          required
          placeholder="Please choose"
        />
      </div>
    </awesome-accordion>

    <footer class="card-footer">
      <nxt-button
        size="small"
        to="/site-submission/outline"
      >
        Back
      </nxt-button>
      <nxt-button
        type="submit"
        size="small"
        class="pull-right"
        :disabled="isSubmitting"
      >
        Submit
      </nxt-button>
    </footer>
  </div>
</form>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useSiteSubmissionFormStore } from '@/stores/site-submission';

import { NxtRadioButtons, NxtSelect } from '@nxt/components/form';
import { AwesomeAccordion } from '@nxt/components';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();
    const siteStore = useSiteSubmissionFormStore();
    const isSubmitting = ref(false);

    const is_nep_prequalified = computed({
      get: () => siteStore.is_nep_prequalified,
      set: val => siteStore.setValue('is_nep_prequalified', val),
    });

    const has_signed_exclusivity_agreement = computed({
      get: () => siteStore.has_signed_exclusivity_agreement,
      set: val => siteStore.setValue('has_signed_exclusivity_agreement', val),
    });

    const has_startup_capital = computed({
      get: () => siteStore.has_startup_capital,
      set: val => siteStore.setValue('has_startup_capital', val),
    });

    const startup_capital_amount = computed({
      get: () => siteStore.startup_capital_amount,
      set: val => siteStore.setValue('startup_capital_amount', val),
    });

    const has_community_genset = computed({
      get: () => siteStore.has_community_genset,
      set: val => siteStore.setValue('has_community_genset', val),
    });

    const has_preexisting_distribution_network = computed({
      get: () => siteStore.has_preexisting_distribution_network,
      set: val => siteStore.setValue('has_preexisting_distribution_network', val),
    });

    const distribution_network_owner = computed({
      get: () => siteStore.distribution_network_owner,
      set: val => siteStore.setValue('distribution_network_owner', val),
    });

    const distribution_network_coverage = computed({
      get: () => siteStore.distribution_network_coverage,
      set: val => siteStore.setValue('distribution_network_coverage', val),
    });

    const yesNo = [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];

    const yesNoNull = [ ...yesNo,
      { label: 'I don\'t know what this is', value: null },
    ];

    const coverageOptions = [ '<25%', '50%', '75%', '100%', 'I don\'t know' ];

    const goNext = () => {
      isSubmitting.value = true;
      siteStore
        .doSave()
        .then(() => {
          router.push('/site-submission/done');
        })
        .catch(err => {
          const title = 'Error submitting site';
          console.error(title, err);
          toast.error(`${ title }: ${ err.message }`);
        })
        .finally(() => {
          isSubmitting.value = false;
        })
      ;
    };

    return {
      isSubmitting,
      is_nep_prequalified,
      has_signed_exclusivity_agreement,
      has_startup_capital,
      startup_capital_amount,
      has_community_genset,
      has_preexisting_distribution_network,
      distribution_network_owner,
      distribution_network_coverage,
      yesNo,
      yesNoNull,
      coverageOptions,
      goNext,
    };
  },

  components: { NxtRadioButtons, NxtSelect, AwesomeAccordion },
};
</script>

<style lang="scss">
.nxt-form-column--border-top {
  border-top: thin solid $nxt-color-blue-light;
}
</style>
