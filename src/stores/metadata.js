import { defineStore } from 'pinia';
import { useGlobalStore } from '@nxt/nxt-vue';
import { supabaseRepo } from '@/repo/supabaseRepo';

export const useMetadataStore = defineStore('metadata', {
  state: () => ({
    _gridMeta: null,
    _firstLoaded: false,
  }),

  getters: {
    gridMeta: state => state._gridMeta,
    firstLoaded: state => state._firstLoaded,
  },

  actions: {
    async fetchGridMeta(gridId) {
      if(this._gridMeta?.id === gridId) return;
      await supabaseRepo
        .getGridMeta(gridId)
        .then(this.setGridMeta)
      ;
    },

    setGridMeta(gridMeta) {
      this._gridMeta = gridMeta;
      useGlobalStore().setTimezone(gridMeta?.timezone);
    },

    setFirstLoaded(bool) {
      this._firstLoaded = bool;
    },
  },
});
