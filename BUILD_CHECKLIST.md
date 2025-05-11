# Build Process Checklist

## Pre-Build
- [ ] All dependencies are listed in package.json with exact versions
- [ ] Node version is set to 18.17.0
- [ ] All required Radix UI components are installed
- [ ] All required UI components are properly imported
- [ ] All form components are properly configured

## Build
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run lint` to check for any linting issues
- [ ] Run `npm run build` to verify the build process
- [ ] Check for any build errors or warnings

## Post-Build
- [ ] Verify the .next directory is generated
- [ ] Check that all static assets are properly included
- [ ] Verify that all routes are properly generated
- [ ] Test the build locally using `npm run start`

## Deployment
- [ ] Ensure netlify.toml is properly configured
- [ ] Verify build command and publish directory
- [ ] Check environment variables are set
- [ ] Verify plugin configurations
- [ ] Test the deployment on a preview branch first 