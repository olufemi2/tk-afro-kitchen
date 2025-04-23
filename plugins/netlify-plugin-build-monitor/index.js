module.exports = {
    onPreBuild: () => {
      console.log('Starting build process...');
    },
    onError: () => {
      console.log('Build failed - running error handler');
    },
    onSuccess: () => {
      console.log('Build completed successfully');
    }
  };