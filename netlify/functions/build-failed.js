exports.handler = async (event, context) => {
    if (event.body) {
      const buildInfo = JSON.parse(event.body);
      
      // Log the build failure
      console.log('Build failed:', buildInfo);
      
      // Run the error handler directly
      const { execSync } = require('child_process');
      try {
        execSync('npx ts-node scripts/netlify-error-handler.ts', { stdio: 'inherit' });
        
        // Trigger a new build
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Error handler executed, rebuilding...' })
        };
      } catch (error) {
        console.error('Error handler failed:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to handle build error' })
        };
      }
    }
    
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No build info provided' })
    };
  };