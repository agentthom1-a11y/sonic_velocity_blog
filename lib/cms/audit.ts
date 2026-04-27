/**
 * lib/cms/audit.ts
 * Write audit log entries.
 */
import { db, initDB } from '../db';
import { auditLogs } from '../schema';

type ActorType = 'admin_user' | 'ai_agent' | 'system';

export async function writeAuditLog(opts: {
  entityType: string;
  entityId?: string | number;
  action: string;
  actorType?: ActorType;
  actorId?: string;
  before?: unknown;
  after?: unknown;
}) {
  initDB();
  const { entityType, entityId, action, actorType = 'system', actorId, before, after } = opts;

  db.insert(auditLogs).values({
    entityType,
    entityId:   entityId != null ? String(entityId) : undefined,
    action,
    actorType,
    actorId,
    beforeJson: before != null ? JSON.stringify(before) : undefined,
    afterJson:  after  != null ? JSON.stringify(after)  : undefined,
  }).run();
}
