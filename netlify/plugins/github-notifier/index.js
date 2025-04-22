const https = require('https');

module.exports = {
  onError: async ({ error, utils }) => {
    console.log('Build failed, notifying GitHub workflow...');

    const options = {
      hostname: 'api.github.com',
      path: '/repos/tkafro/tkafro/dispatches',  // Using your repository name
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Build-Monitor'
      }
    };

    const data = JSON.stringify({
      event_type: 'netlify-build-failed',
      client_payload: {
        error: error.message
      }
    });

    const req = https.request(options, (res) => {
      console.log(`GitHub API Response Status: ${res.statusCode}`);
    });

    req.on('error', (e) => {
      console.error('Failed to notify GitHub:', e);
    });

    req.write(data);
    req.end();
  }
};