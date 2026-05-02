<template>
<transactions-table :organization_id="accountStore.myProfile.organization.id" />
</template>

<script>
import { useAccountStore } from '@nxt/libraries/api-connection';
import { TransactionsTable } from '@nxt/components/tables';

export default {
  setup() {
    const accountStore = useAccountStore();

    return { accountStore };
  },

  components: { TransactionsTable },
};
</script>
