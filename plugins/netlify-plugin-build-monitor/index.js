module.exports = {
    onPreBuild: ({ utils }) => {
      console.log('Starting build process...');
    },
    onError: ({ utils }) => {
      console.log('Build failed - running error handler');
    },
    onSuccess: ({ utils }) => {
      console.log('Build completed successfully');
    }
  };