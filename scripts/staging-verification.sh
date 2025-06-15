#!/bin/bash

# 🧪 Staging Site Verification Script for TK Afro Kitchen
# Purpose: Comprehensive testing of staging.tkafrokitchen.com before promotion
# Usage: ./scripts/staging-verification.sh

set -e  # Exit on any error

# Configuration
STAGING_URL="https://staging.tkafrokitchen.com"
TIMEOUT=30
LOG_FILE="./logs/staging-verification-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Print colored output
print_test() {
    echo -e "${BLUE}[TEST]${NC} $1" | tee -a "$LOG_FILE"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1" | tee -a "$LOG_FILE"
    ((PASSED_TESTS++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1" | tee -a "$LOG_FILE"
    ((FAILED_TESTS++))
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Test function wrapper
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TOTAL_TESTS++))
    print_test "$test_name"
    
    if eval "$test_command"; then
        print_pass "$test_name - SUCCESS"
        return 0
    else
        print_fail "$test_name - FAILED"
        return 1
    fi
}

# HTTP response test
test_http_response() {
    local url="$1"
    local expected_code="$2"
    local description="$3"
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" || echo "000")
    
    if [[ "$response_code" =~ $expected_code ]]; then
        print_pass "$description - HTTP $response_code"
        return 0
    else
        print_fail "$description - HTTP $response_code (expected $expected_code)"
        return 1
    fi
}

# Content test
test_content_exists() {
    local url="$1"
    local search_text="$2"
    local description="$3"
    
    if curl -s --max-time $TIMEOUT "$url" | grep -i "$search_text" > /dev/null; then
        print_pass "$description - Content found"
        return 0
    else
        print_fail "$description - Content not found"
        return 1
    fi
}

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                🧪 STAGING VERIFICATION TESTS 🧪              ║"
echo "║                                                              ║"
echo "║  Comprehensive testing of staging.tkafrokitchen.com         ║"
echo "║  before promotion to production                              ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "Starting staging verification tests"
log "Target: $STAGING_URL"

echo "════════════════════════════════════════════════════════════════"
echo "🌐 BASIC CONNECTIVITY TESTS"
echo "════════════════════════════════════════════════════════════════"

# Basic connectivity tests
run_test "Homepage loads" "test_http_response '$STAGING_URL' '200|301|302' 'Homepage'"
run_test "SSL certificate valid" "curl -s --max-time $TIMEOUT '$STAGING_URL' > /dev/null"
run_test "DNS resolution" "dig +short staging.tkafrokitchen.com | grep -q '.'"

echo
echo "════════════════════════════════════════════════════════════════"
echo "📱 PAGE FUNCTIONALITY TESTS"
echo "════════════════════════════════════════════════════════════════"

# Page functionality tests
run_test "Menu page loads" "test_http_response '$STAGING_URL/menu' '200' 'Menu page'"
run_test "Checkout page loads" "test_http_response '$STAGING_URL/checkout' '200|302' 'Checkout page'"
run_test "About page loads" "test_http_response '$STAGING_URL/about' '200' 'About page'"
run_test "Contact page loads" "test_http_response '$STAGING_URL/contact' '200' 'Contact page'"

echo
echo "════════════════════════════════════════════════════════════════"
echo "🛒 E-COMMERCE FUNCTIONALITY TESTS"
echo "════════════════════════════════════════════════════════════════"

# E-commerce content tests
run_test "Menu items display" "test_content_exists '$STAGING_URL/menu' 'jollof\|rice\|chicken' 'Menu items'"
run_test "Pickup option available" "test_content_exists '$STAGING_URL/checkout' 'pickup\|collection' 'Pickup option'"
run_test "Nationwide delivery option" "test_content_exists '$STAGING_URL/checkout' 'nationwide\|delivery' 'Delivery option'"
run_test "Delivery fee £27.99" "test_content_exists '$STAGING_URL/checkout' '27.99\|£27' 'Delivery fee'"

echo
echo "════════════════════════════════════════════════════════════════"
echo "💳 PAYMENT INTEGRATION TESTS"
echo "════════════════════════════════════════════════════════════════"

# Payment integration tests
run_test "PayPal integration present" "test_content_exists '$STAGING_URL/checkout' 'paypal' 'PayPal integration'"
run_test "Payment form loads" "test_content_exists '$STAGING_URL/checkout' 'payment\|card\|checkout' 'Payment form'"

echo
echo "════════════════════════════════════════════════════════════════"
echo "🔒 SECURITY & SEO TESTS"
echo "════════════════════════════════════════════════════════════════"

# Security headers test
check_security_headers() {
    local headers=$(curl -s -I --max-time $TIMEOUT "$STAGING_URL")
    
    if echo "$headers" | grep -i "x-frame-options" > /dev/null; then
        print_pass "X-Frame-Options header present"
    else
        print_fail "X-Frame-Options header missing"
        return 1
    fi
    
    if echo "$headers" | grep -i "content-security-policy" > /dev/null; then
        print_pass "Content-Security-Policy header present"
    else
        print_fail "Content-Security-Policy header missing"  
        return 1
    fi
    
    return 0
}

run_test "Security headers" "check_security_headers"
run_test "Meta description present" "test_content_exists '$STAGING_URL' 'meta.*description' 'Meta description'"
run_test "Title tag present" "test_content_exists '$STAGING_URL' '<title>' 'Title tag'"

echo
echo "════════════════════════════════════════════════════════════════"
echo "📱 MOBILE & PERFORMANCE TESTS"
echo "════════════════════════════════════════════════════════════════"

# Mobile responsiveness test
run_test "Mobile viewport configured" "test_content_exists '$STAGING_URL' 'viewport.*width=device-width' 'Mobile viewport'"
run_test "Responsive design CSS" "test_content_exists '$STAGING_URL' 'responsive\|mobile\|@media' 'Responsive CSS'"

# Performance test (basic)
performance_test() {
    local start_time=$(date +%s.%3N)
    curl -s --max-time $TIMEOUT "$STAGING_URL" > /dev/null
    local end_time=$(date +%s.%3N)
    local load_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "unknown")
    
    if [[ "$load_time" != "unknown" ]] && (( $(echo "$load_time < 5.0" | bc -l) )); then
        print_pass "Page load time: ${load_time}s (< 5s target)"
        return 0
    else
        print_warning "Page load time: ${load_time}s (may be slow)"
        return 0  # Don't fail on this, just warn
    fi
}

run_test "Page load performance" "performance_test"

echo
echo "════════════════════════════════════════════════════════════════"
echo "🔍 CONTENT VERIFICATION TESTS"
echo "════════════════════════════════════════════════════════════════"

# Business information tests
run_test "Business name present" "test_content_exists '$STAGING_URL' 'TK.*Afro.*Kitchen\|Afro.*Kitchen' 'Business name'"
run_test "Contact information" "test_content_exists '$STAGING_URL/contact' 'email\|phone\|contact' 'Contact info'"
run_test "Menu pricing displayed" "test_content_exists '$STAGING_URL/menu' '£\|\\\$\|price' 'Menu pricing'"

echo
echo "════════════════════════════════════════════════════════════════"
echo "🎯 DELIVERY MODEL VERIFICATION"
echo "════════════════════════════════════════════════════════════════"

# New delivery model verification
verify_delivery_model() {
    local checkout_content=$(curl -s --max-time $TIMEOUT "$STAGING_URL/checkout")
    
    # Check for pickup option
    if echo "$checkout_content" | grep -i "pickup\|collection" > /dev/null; then
        print_pass "Pickup option found in checkout"
    else
        print_fail "Pickup option missing from checkout"
        return 1
    fi
    
    # Check for nationwide delivery
    if echo "$checkout_content" | grep -i "nationwide.*delivery" > /dev/null; then
        print_pass "Nationwide delivery option found"
    else
        print_fail "Nationwide delivery option missing"
        return 1
    fi
    
    # Check pricing
    if echo "$checkout_content" | grep "27\.99\|£27" > /dev/null; then
        print_pass "Correct delivery fee (£27.99) displayed"
    else
        print_fail "Incorrect or missing delivery fee"
        return 1
    fi
    
    # Check that estimated delivery is NOT present
    if echo "$checkout_content" | grep -i "estimated.*delivery" > /dev/null; then
        print_fail "Old estimated delivery text still present"
        return 1
    else
        print_pass "Old estimated delivery text removed"
    fi
    
    return 0
}

run_test "New delivery model verification" "verify_delivery_model"

echo
echo "════════════════════════════════════════════════════════════════"
echo "📊 TEST RESULTS SUMMARY"
echo "════════════════════════════════════════════════════════════════"

log "Test execution completed"
log "Total tests: $TOTAL_TESTS"
log "Passed: $PASSED_TESTS"
log "Failed: $FAILED_TESTS"

echo
echo "📊 Results:"
echo "   Total Tests: $TOTAL_TESTS"
echo -e "   ${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "   ${RED}Failed: $FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    ✅ ALL TESTS PASSED ✅                    ║${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}║  Staging site is ready for promotion to production!         ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    
    log "✅ All tests passed - staging ready for production"
    exit 0
else
    echo
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    ❌ TESTS FAILED ❌                        ║${NC}"
    echo -e "${RED}║                                                              ║${NC}"
    echo -e "${RED}║  Issues found - DO NOT promote to production yet!           ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    
    echo
    echo "🔧 Please fix the following issues before promotion:"
    echo "   - Review failed tests in log: $LOG_FILE"
    echo "   - Fix identified issues"
    echo "   - Re-run verification script"
    
    log "❌ Tests failed - staging not ready for production"
    exit 1
fi