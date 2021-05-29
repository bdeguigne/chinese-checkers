import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from 'src/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        `mongodb+srv://${process.env.MONGODB}?retryWrites=true&w=majority`,
        {
          useFindAndModify: false,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
      ),
  },
];
