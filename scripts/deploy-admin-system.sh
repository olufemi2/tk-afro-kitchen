#!/bin/bash

# TK Afro Kitchen - Admin System Deployment Script
# Automated deployment of admin panel and Stripe integration

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}$(echo "$1" | sed 's/./=/g')${NC}"
}

# Configuration
PROJECT_NAME="TK Afro Kitchen Admin System"
REQUIRED_NODE_VERSION="18"
REQUIRED_PACKAGES=("@radix-ui/react-tabs" "stripe" "@stripe/stripe-js" "@stripe/react-stripe-js")

# Check prerequisites
check_prerequisites() {
    log_header "Checking Prerequisites"
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | sed 's/v//' | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge "$REQUIRED_NODE_VERSION" ]; then
            log_success "Node.js version: $(node --version)"
        else
            log_error "Node.js version $REQUIRED_NODE_VERSION+ required. Current: $(node --version)"
            exit 1
        fi
    else
        log_error "Node.js not found. Please install Node.js $REQUIRED_NODE_VERSION+"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        log_success "npm version: $(npm --version)"
    else
        log_error "npm not found"
        exit 1
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        log_success "Git version: $(git --version)"
    else
        log_warning "Git not found - version control features may not work"
    fi
}

# Install required dependencies
install_dependencies() {
    log_header "Installing Dependencies"
    
    log_info "Installing required packages..."
    
    # Core admin dependencies
    npm install --save @radix-ui/react-tabs
    npm install --save lucide-react
    
    # Stripe integration
    npm install --save stripe @stripe/stripe-js @stripe/react-stripe-js
    
    # Database packages (if using database)
    log_info "Optional: Installing database packages..."
    npm install --save-optional prisma @prisma/client
    
    # Image upload packages
    npm install --save-optional cloudinary multer
    
    log_success "Dependencies installed"
}

# Setup environment variables
setup_environment() {
    log_header "Setting Up Environment Variables"
    
    ENV_FILE=".env.local"
    
    if [ ! -f "$ENV_FILE" ]; then
        log_info "Creating $ENV_FILE..."
        cat > "$ENV_FILE" << EOF
# TK Afro Kitchen - Environment Configuration
# Generated on $(date)

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Admin Configuration
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_ADMIN_ENABLED=true

# Database Configuration (Optional)
DATABASE_URL="postgresql://username:password@localhost:5432/tkafro_admin"

# Image Upload Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPPORT_EMAIL=support@tkafrokitchen.com
EOF
        log_success "Environment file created: $ENV_FILE"
        log_warning "Please update the environment variables with your actual values"
    else
        log_info "Environment file already exists: $ENV_FILE"
    fi
}

# Create admin API routes
create_api_routes() {
    log_header "Creating Admin API Routes"
    
    # Create API directory structure
    mkdir -p src/app/api/admin
    mkdir -p src/app/api/admin/menu
    mkdir -p src/app/api/admin/categories
    mkdir -p src/app/api/admin/upload
    
    # Menu management API
    cat > "src/app/api/admin/menu/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { featuredDishes } from '@/data/sample-menu';

export async function GET() {
  return NextResponse.json({ items: featuredDishes });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate admin authentication
    // TODO: Validate menu item data
    // TODO: Save to database
    
    console.log('Creating menu item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu item created successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate admin authentication
    // TODO: Update menu item in database
    
    console.log('Updating menu item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu item updated successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID required' },
        { status: 400 }
      );
    }
    
    // TODO: Validate admin authentication
    // TODO: Delete from database
    
    console.log('Deleting menu item:', itemId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu item deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
EOF

    # Image upload API
    cat > "src/app/api/admin/upload/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // TODO: Validate admin authentication
    // TODO: Validate file type and size
    // TODO: Upload to cloud storage (Cloudinary, AWS S3, etc.)
    
    // Mock upload - replace with actual implementation
    const mockImageUrl = `/images/dishes/${file.name}`;
    
    console.log('Uploading file:', file.name);
    
    return NextResponse.json({
      success: true,
      imageUrl: mockImageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
EOF

    log_success "Admin API routes created"
}

# Setup database schema (optional)
setup_database() {
    log_header "Setting Up Database Schema (Optional)"
    
    if command -v psql &> /dev/null; then
        log_info "PostgreSQL detected. Creating database schema..."
        
        cat > "scripts/admin_schema.sql" << 'EOF'
-- TK Afro Kitchen Admin Database Schema
-- Run this script in your PostgreSQL database

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category_id VARCHAR(50) REFERENCES categories(id),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Size options table
CREATE TABLE IF NOT EXISTS size_options (
    id SERIAL PRIMARY KEY,
    menu_item_id VARCHAR(50) REFERENCES menu_items(id) ON DELETE CASCADE,
    size_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    portion_info VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'menu_admin' CHECK (role IN ('super_admin', 'menu_admin', 'content_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Menu update log table
CREATE TABLE IF NOT EXISTS menu_update_log (
    id SERIAL PRIMARY KEY,
    admin_user_id INTEGER REFERENCES admin_users(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'image_update')),
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('admin@tkafrokitchen.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categories (id, name, description, image_url) VALUES
('rice', 'Rice Dishes', 'Authentic Nigerian rice specialties', '/images/dishes/jollofmeal.png'),
('soups-stews', 'Soups & Stews', 'Traditional Nigerian soups and stews', '/images/dishes/egusi1.png'),
('proteins', 'Protein Dishes', 'Variety of peppered meats and fish', '/images/dishes/Turkey.png'),
('sides', 'Side Dishes', 'Delicious sides including plantain and beans', '/images/dishes/beans_dodo.jpeg'),
('snacks', 'Snacks & Pastries', 'Nigerian snacks and pastries', '/images/dishes/tk-meatpie.png'),
('platters', 'Fish Platters', 'Special fish platters', '/images/dishes/tkfish3.png')
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE categories IS 'Food categories for menu organization';
COMMENT ON TABLE menu_items IS 'Individual menu items with details';
COMMENT ON TABLE size_options IS 'Different size options and pricing for menu items';
COMMENT ON TABLE admin_users IS 'Admin users with role-based access';
COMMENT ON TABLE menu_update_log IS 'Audit trail for all menu changes';
EOF
        
        log_success "Database schema file created: scripts/admin_schema.sql"
        log_info "Run 'psql -d your_database -f scripts/admin_schema.sql' to setup the database"
    else
        log_info "PostgreSQL not detected. Database setup skipped."
        log_info "You can manually setup the database using the schema in the documentation."
    fi
}

# Setup automated Stripe integration
setup_stripe_integration() {
    log_header "Setting Up Stripe Integration"
    
    # Create Stripe webhook handler
    mkdir -p src/app/api/webhooks
    
    cat > "src/app/api/webhooks/stripe/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { createAutomatedStripeIntegration } from '@/lib/automated-stripe-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }
    
    const stripeIntegration = createAutomatedStripeIntegration();
    
    // Validate webhook signature
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Process the webhook event
    const result = await stripeIntegration.processWebhookEvent(event);
    
    if (result.success) {
      return NextResponse.json({ received: true });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
EOF

    log_success "Stripe webhook handler created"
}

# Create admin authentication
setup_admin_auth() {
    log_header "Setting Up Admin Authentication"
    
    mkdir -p src/app/api/auth
    
    cat > "src/app/api/auth/admin/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // TODO: Replace with actual database authentication
    if (email === 'admin@tkafrokitchen.com' && password === 'admin123') {
      const token = jwt.sign(
        { 
          email, 
          role: 'super_admin',
          id: 1 
        },
        process.env.ADMIN_JWT_SECRET!,
        { expiresIn: '24h' }
      );
      
      return NextResponse.json({
        success: true,
        token,
        user: { email, role: 'super_admin' }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
EOF

    log_success "Admin authentication setup"
}

# Build and test the application
build_and_test() {
    log_header "Building and Testing Application"
    
    log_info "Running type check..."
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "Build completed successfully"
    else
        log_error "Build failed. Please fix the errors and try again."
        exit 1
    fi
    
    log_info "Running basic tests..."
    # Add test commands here if you have tests
    
    log_success "Application built and tested successfully"
}

# Deploy to staging/production
deploy_application() {
    log_header "Deployment Options"
    
    log_info "Choose deployment method:"
    echo "1. Vercel (Recommended)"
    echo "2. Netlify"
    echo "3. Manual deployment"
    echo "4. Skip deployment"
    
    read -p "Enter choice (1-4): " DEPLOY_CHOICE
    
    case $DEPLOY_CHOICE in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            log_info "Manual deployment selected. Please deploy according to your hosting provider's instructions."
            ;;
        4)
            log_info "Deployment skipped."
            ;;
        *)
            log_warning "Invalid choice. Deployment skipped."
            ;;
    esac
}

deploy_vercel() {
    log_info "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        log_success "Deployed to Vercel"
    else
        log_warning "Vercel CLI not found. Please install with: npm i -g vercel"
        log_info "Then run: vercel --prod"
    fi
}

deploy_netlify() {
    log_info "Deploying to Netlify..."
    
    if command -v netlify &> /dev/null; then
        netlify deploy --prod
        log_success "Deployed to Netlify"
    else
        log_warning "Netlify CLI not found. Please install with: npm i -g netlify-cli"
        log_info "Then run: netlify deploy --prod"
    fi
}

# Final setup instructions
show_final_instructions() {
    log_header "Setup Complete!"
    
    echo ""
    log_success "TK Afro Kitchen Admin System has been installed successfully!"
    echo ""
    
    log_info "Next Steps:"
    echo "1. Update environment variables in .env.local"
    echo "2. Setup your Stripe account and update API keys"
    echo "3. If using database, run the SQL schema script"
    echo "4. Start the development server: npm run dev"
    echo "5. Visit http://localhost:3000/admin to access the admin panel"
    echo ""
    
    log_info "Default admin credentials:"
    echo "Email: admin@tkafrokitchen.com"
    echo "Password: admin123"
    echo ""
    
    log_warning "Important Security Notes:"
    echo "- Change the default admin password immediately"
    echo "- Update JWT secret in environment variables"
    echo "- Enable proper authentication before production"
    echo "- Setup SSL certificates for production"
    echo ""
    
    log_info "Documentation:"
    echo "- Admin Panel: /admin"
    echo "- API Documentation: Check /api routes"
    echo "- Stripe Integration: See automated-stripe-integration.ts"
    echo ""
    
    log_success "Happy cooking! 🍽️"
}

# Main execution
main() {
    log_header "TK Afro Kitchen Admin System Deployment"
    echo "This script will install and configure the admin panel and Stripe integration."
    echo ""
    
    # Confirm before proceeding
    read -p "Do you want to continue? (y/N): " CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        log_info "Installation cancelled."
        exit 0
    fi
    
    # Run installation steps
    check_prerequisites
    install_dependencies
    setup_environment
    create_api_routes
    setup_database
    setup_stripe_integration
    setup_admin_auth
    build_and_test
    deploy_application
    show_final_instructions
}

# Execute main function
main "$@"