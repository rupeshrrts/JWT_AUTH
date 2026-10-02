import app from './app.js';
import { ENV } from './config/env.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(ENV.PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Production Auth Server listening on port ${ENV.PORT}`);
  console.log(`🌐 Environment: ${ENV.NODE_ENV}`);
  console.log(`🏥 Health Check: http://localhost:${ENV.PORT}/api/health`);
  console.log(`=================================================`);
});

// Graceful Shutdown Handler
const handleGracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Closing HTTP server and disconnecting DB...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('✅ Database connection closed gracefully.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during database disconnect:', err);
      process.exit(1);
    }
  });

  // Force close after 10s if graceful shutdown fails
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
