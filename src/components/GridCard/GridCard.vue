<template>
<li>
  <router-link
    class="card grid-card"
    :to="`/grid/${ grid.id }`"
  >
    <p class="h5 grid-card__title">
      {{ grid.name }}
    </p>
    <div class="mt-1 flex-horizontal">
      <div
        class="status-light status-light--large"
        :class="`status-light--${ status.color }`"
      ></div>
      <p
        class="grid-card__status"
        :class="`grid-card__status--${ status.color }`"
      >{{ status.text }}</p>
    </div>
    <!-- <div class="mt-1 flex-horizontal">
      <mdi-icon name="mdiMeterElectricOutline"/>
      <p>Good metering connectivity</p>
    </div> -->
  </router-link>
</li>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    grid: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const status = computed(() => {
      if(props.grid.is_fs_on) return {
        color: 'green',
        text: 'Full service available',
      };
      if(props.grid.is_hps_on) return {
        color: 'yellow',
        text: 'High priority service only',
      };
      return {
        color: 'red',
        text: 'Grid is not powered',
      };
    });

    return { status };
  },
};
</script>

<style lang="scss">
.grid-card {
  display: block;
  color: $nxt-color-blue;
  text-decoration: none;

  @media (hover: hover) {
    transition: 250ms $ease--out-expo;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $sh2;
    }
  }

  &__title {
    text-decoration: underline;
  }

  &__status {
    font-weight: 700;

    &--green {
      color: $nxt-color-success;
      text-shadow: 0 0 2px rgba($nxt-color-success, 0.5);
    }

    &--yellow {
      color: $nxt-color-warn;
      text-shadow: 0 0 2px rgba($nxt-color-warn, 0.5);
    }

    &--red {
      color: $nxt-color-error;
      text-shadow: 0 0 2px rgba($nxt-color-error, 0.5);
    }
  }
}
</style>
