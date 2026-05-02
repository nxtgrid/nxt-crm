import { pick } from 'ramda';
import { defineStore } from 'pinia';
import { useDraftDesignStore } from '@nxt/components/maps';
import { supabaseRepo } from '@/repo/supabaseRepo';
import { restRepo } from '@/repo/restRepo';

export const useSiteSubmissionStore = defineStore('site-submission', {
  state: () => ({
    submissions: [],
  }),

  actions: {
    addSubmission(submission) {
      this.submissions = [ submission, ...this.submissions ];
    },
  },

  persist: true,
});

export const useSiteSubmissionFormStore = defineStore('site-submission-form', {
  state: () => ({
    author_full_name: null,
    author_email: null,
    author_organization_name: null,
    author_organization_id: null,

    site_name: null,
    state: null,

    is_nep_prequalified: undefined,
    has_signed_exclusivity_agreement: undefined,
    has_startup_capital: undefined,
    startup_capital_amount: null,
    has_community_genset: undefined,
    has_preexisting_distribution_network: undefined,
    distribution_network_owner: null,
    distribution_network_coverage: null,
  }),

  actions: {
    setValue(key, val) {
      this[key] = val;
    },

    doSave() {
      const ddStore = useDraftDesignStore();
      const submission = {
        ...pick([
          'author_full_name',
          'author_email',
          'author_organization_name',
          'author_organization_id',
          'site_name',
        ], this),

        location_geom: ddStore.gridLocation,
        outline_geom: ddStore.outline.geometry,
        buildings_geo_flat: ddStore.buildings,
        poles_geo_flat: ddStore.poles,
        distribution_geo_flat: ddStore.distributionLines,
        meta_geo_flat: ddStore.meta,

        site_details: pick([
          'state',
          'is_nep_prequalified',
          'has_signed_exclusivity_agreement',
          'has_startup_capital',
          'startup_capital_amount',
          'has_community_genset',
          'has_preexisting_distribution_network',
          'distribution_network_owner',
          'distribution_network_coverage',
        ], this),
      };

      return supabaseRepo.client
        .from('pd_site_submissions')
        .insert(submission)
        .select().maybeSingle()
        .then(supabaseRepo.handleResponse)
        .then(res => {
          if(import.meta.env.VITE_CONTEXT === 'production') {
            // @TEMPORARY :: POSTING TO MAKE
            fetch('https://hook.eu2.make.com/0wkqyjg4j4nuzb09d22lt42crp7fio2d', {
              method: 'POST',
              body: JSON.stringify(res),
              headers: { 'Content-Type': 'application/json' },
            }).catch(err => {
              console.error('ERROR SUBMITTING TO MAKE', err);
            });
            // @TEMPORARY :: SENDING EMAIL
            restRepo.sendSiteSubmissionEmail({
              message: `A new site "${ submission.site_name }" was submitted by ${ submission.author_full_name } of ${ submission.author_organization_name }.`,
            });
          }
        })
        .then(() => {
          useSiteSubmissionStore().addSubmission(submission);
          this.$reset();
          ddStore.$reset();
        })
      ;
    },
  },

  persist: true,
});
