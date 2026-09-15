import { createApp } from './app';
import { checkSupabaseConnection } from './config/supabase';
import { ENV } from './config/env';
import { seedDatabase } from './utils/seeder';

const startServer = async () => {
  await checkSupabaseConnection();
  await seedDatabase();

  const app = createApp();
  const PORT = parseInt(ENV.PORT);

  app.listen(PORT, () => {
    console.log(`[Naagrik API] Supabase-powered backend running on http://localhost:${PORT}`);
  });
};

startServer();
