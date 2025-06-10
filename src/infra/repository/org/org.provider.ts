import { OrgSchema } from '@infra/schemas/org.schema';
import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';

export const orgProvider = [
  {
    provide: CONSTANTS.ORG_PROVIDER,
    useFactory: (connection: Connection) => connection.model('Org', OrgSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
