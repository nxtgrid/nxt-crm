import { baseSupabaseRepo } from '@nxt/libraries/api-connection';

export const supabaseRepo = {
  ...baseSupabaseRepo,

  getCustomer(id) {
    return this.client
      .from('customers')
      .select(`
        id,
        lives_primarily_in_the_community,
        latitude,
        longitude,
        total_connection_fee,
        total_connection_paid,
        account:accounts!inner(
          full_name,
          phone,
          email
        ),
        grid:grids(
          organization:organizations(
            name,
            wallet:wallets!organization_id(
              id
            )
          )
        ),
        connections(
          id,
          currency,
          wallet:wallets(
            id
          ),
          meters(
            id,
            external_reference,
            meter_type,
            meter_phase,
            communication_protocol,
            balance,
            balance_updated_at,
            is_on,
            is_on_updated_at,
            power_limit,
            kwh_credit_available,
            kwh_credit_available_updated_at,
            pole:poles(
              external_reference
            ),
            wallet:wallets(
              id
            ),
            issue:last_encountered_issue_id(
              issue_type,
              issue_status,
              started_at
            ),

            last_install_session:last_metering_hardware_install_session_id(
              id,
              import:last_metering_hardware_import_id(
                status:metering_hardware_import_status
              ),
              commissioning:last_meter_commissioning_id(
                id,
                status:meter_commissioning_status
              )
            )
          )
        ),
        wallet:wallets(
          id,
          balance
        )
      `)
      .eq('id', id)
      .is('accounts.deleted_at', null)
      .is('connections.deleted_at', null)
      .is('connections.meters.deleted_at', null)
      .maybeSingle()
      .then(this.handleResponse)
    ;
  },
};
