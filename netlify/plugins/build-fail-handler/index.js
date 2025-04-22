module.exports = {
    onPreBuild: ({ utils }) => {
      console.log('Build fail handler plugin initialized');
    },
    onBuildFailed: ({ error, utils }) => {
      console.log('Build failed, running error handler...');
      const { execSync } = require('child_process');
      
      try {
        execSync('npx ts-node scripts/netlify-error-handler.ts', { stdio: 'inherit' });
        console.log('Error handler completed');
      } catch (e) {
        console.error('Error handler failed:', e);
      }
    }
  };