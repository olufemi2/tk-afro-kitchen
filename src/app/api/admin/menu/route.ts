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
