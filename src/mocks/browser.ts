import { setupWorker } from 'msw/browser'
import { authHandlers }            from './handlers/auth'
import { kpiHandlers }             from './handlers/kpi'
import { alertHandlers }           from './handlers/alerts'
import { taskHandlers }            from './handlers/tasks'
import { driveAuditHandlers }      from './handlers/drive-audit'
import { assetRegisterHandlers }   from './handlers/asset-register'
import { trainingLogHandlers }     from './handlers/training-log'
import { translateLogHandlers }    from './handlers/translate-log'
import { improvementItemHandlers } from './handlers/improvement-items'
import { teamMembersHandlers }     from './handlers/team-members'

export const worker = setupWorker(
  ...authHandlers,
  ...kpiHandlers,
  ...alertHandlers,
  ...taskHandlers,
  ...driveAuditHandlers,
  ...assetRegisterHandlers,
  ...trainingLogHandlers,
  ...translateLogHandlers,
  ...improvementItemHandlers,
  ...teamMembersHandlers,
)
