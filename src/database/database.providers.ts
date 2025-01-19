import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://rafaapcode:fDpLsH6Gdr6VpiPO@cluster0.6k11s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      ),
  },
];
