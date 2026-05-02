<template>
<section class="card card--with-table grid-3__3-columns">
  <header class="card-header">
    <h2 class="h2">Members</h2>
  </header>
  <nxt-table
    provider="raw-data"
    :data-entries="members"
    :columns="membersColumns"
    :pagination="false"
    variant="in-card"
  />
</section>
</template>

<script>
import { ref } from 'vue';
import { useAccountStore } from '@nxt/libraries/api-connection';
import { supabaseRepo } from '@/repo/supabaseRepo';
import NxtTable from '@nxt/components/table/NxtTable.vue';

export default {
  setup() {
    const accountStore = useAccountStore();

    const members = ref([]);

    const fetchMembers = () => supabaseRepo.client
      .from('accounts')
      .select(`
        id,
        full_name,
        email,
        telegram_id,
        telegram_link_token,
        member:members(
          id,
          member_type,
          training_level,
          subscribed_to_telegram_revenue_notifications,
          busy_commissioning:grids!busy_commissioning_id(
            id,
            name
          )
        )
      `)
      .eq('organization_id', accountStore.myProfile.organization.id)
      .is('deleted_at', null)
      .not('member', 'is', null)
      .is('member.hidden', false)
      .order('full_name')
      .then(supabaseRepo.handleResponse)
      .then(_accounts => {
        // We fetch account with member, then swap it to member with account
        members.value = _accounts.map(({ member, ...rest }) => ({
          ...member,
          account: rest,
        }));
      })
    ;
    fetchMembers();

    const membersColumns = [
      {
        field: 'account.full_name',
        header: 'Full name',
      },
      {
        field: 'account.email',
        header: 'Email',
        style: 'word-break: break-word;',
      },
      {
        field: 'member_type',
        header: 'Role',
        component: 'FormatText',
      },
      {
        field: 'busy_commissioning.name',
        header: 'Using Sphinx for',
      },
    ];

    return { members, membersColumns };
  },

  components: { NxtTable },
};
</script>
