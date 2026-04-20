import { http, HttpResponse } from 'msw'
import {
  getCurrentMockUserId, getCurrentMockPerson,
  unauthorized, forbidden,
} from '../config'
import { MOCK_TEAM_MEMBERS } from '../data/team-members'

export const teamMembersHandlers = [
  http.get('*/api/academy/team-members', async () => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => ['leader', 'co_leader'].includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    return HttpResponse.json({ data: MOCK_TEAM_MEMBERS })
  }),
]
