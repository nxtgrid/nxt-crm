import { baseOpsRestRepo } from '@nxt/libraries/api-connection';

export const restRepo = {
  ...baseOpsRestRepo,

  getDashboardForGrid(gridId) {
    return this.fetcher
      .get(`dashboards/${ gridId }/`)
      .json()
      .catch(this.unwrapError)
    ;
  },

  sendSiteSubmissionEmail(json) {
    return this.fetcher
      .post('notifications/site-submission', { json })
      .json()
      .catch(this.unwrapError)
    ;
  },
};
