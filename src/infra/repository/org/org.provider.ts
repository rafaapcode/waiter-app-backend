import { Connection } from 'mongoose';
import { OrgSchema } from 'src/infra/schemas/org.schema';
import { CONSTANTS } from '../../../constants';

export const orgProvider = [
  {
    provide: CONSTANTS.ORG_PROVIDER,
    useFactory: (connection: Connection) => connection.model('Org', OrgSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
