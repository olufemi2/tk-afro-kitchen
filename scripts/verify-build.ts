import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function verifyBuild() {
  try {
    // Check if .next directory exists
    if (!fs.existsSync(path.join(process.cwd(), '.next'))) {
      throw new Error('.next directory not found');
    }

    // Check if all required components exist
    const requiredComponents = [
      'src/components/ui/dialog.tsx',
      'src/components/forms/quote-form-modal.tsx',
      'src/app/catering/page.tsx'
    ];

    for (const component of requiredComponents) {
      if (!fs.existsSync(path.join(process.cwd(), component))) {
        throw new Error(`Required component not found: ${component}`);
      }
    }

    // Check if all required dependencies are installed
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    );

    const requiredDependencies = [
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-radio-group'
    ];

    for (const dep of requiredDependencies) {
      if (!packageJson.dependencies[dep]) {
        throw new Error(`Required dependency not found: ${dep}`);
      }
    }

    console.log('Build verification passed successfully!');
  } catch (error) {
    console.error('Build verification failed:', error);
    process.exit(1);
  }
}

verifyBuild(); 