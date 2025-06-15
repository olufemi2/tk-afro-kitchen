'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Save, 
  Eye, 
  BarChart3,
  Settings,
  Users,
  DollarSign
} from "lucide-react";
import Image from "next/image";
import { featuredDishes, categories } from "@/data/sample-menu";

interface AdminUser {
  id: number;
  email: string;
  role: 'super_admin' | 'menu_admin' | 'content_admin';
  lastLogin: string;
}

interface MenuItemForm {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  sizeOptions: {
    size: string;
    price: number;
    portionInfo: string;
  }[];
  isActive: boolean;
  isFeatured: boolean;
}

// Mock admin authentication (replace with real auth)
const mockAdminUser: AdminUser = {
  id: 1,
  email: 'admin@tkafrokitchen.com',
  role: 'super_admin',
  lastLogin: new Date().toISOString()
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuItems, setMenuItems] = useState(featuredDishes);
  const [selectedItem, setSelectedItem] = useState<MenuItemForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock analytics data
  const analytics = {
    totalOrders: 1247,
    totalRevenue: 52890,
    popularItems: [
      { name: 'Jollof Rice', orders: 324 },
      { name: 'Peppered Fried Rice', orders: 298 },
      { name: 'Egusi Soup', orders: 267 }
    ],
    recentActivity: [
      { action: 'Menu item updated', item: 'Jollof Rice', time: '2 minutes ago' },
      { action: 'New item added', item: 'Pepper Soup', time: '1 hour ago' },
      { action: 'Price updated', item: 'Fried Rice', time: '3 hours ago' }
    ]
  };

  const handleEditItem = (item: any) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
      sizeOptions: item.sizeOptions,
      isActive: true,
      isFeatured: false
    });
    setIsEditing(true);
  };

  const handleSaveItem = async () => {
    if (!selectedItem) return;

    // Mock API call - replace with real implementation
    console.log('Saving item:', selectedItem);
    
    // Update local state
    setMenuItems(prev => 
      prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...selectedItem }
          : item
      )
    );

    setIsEditing(false);
    setSelectedItem(null);
    
    // Show success message
    alert('Menu item updated successfully!');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedItem) return;

    // Mock image upload - replace with real implementation
    const mockImageUrl = `/images/dishes/${file.name}`;
    setSelectedItem(prev => prev ? { ...prev, imageUrl: mockImageUrl } : null);
    
    console.log('Uploading image:', file.name);
    // Simulate upload delay
    setTimeout(() => {
      alert('Image uploaded successfully!');
    }, 1000);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1e1e1e] pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 mt-2">
                  Welcome back, {mockAdminUser.email}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">
                  Last login: {new Date(mockAdminUser.lastLogin).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-[#2a2a2a]">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Menu Management
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-[#2a2a2a] border-orange-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-400" />
                  </div>
                </Card>
                <Card className="p-6 bg-[#2a2a2a] border-orange-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">£{analytics.totalRevenue.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-400" />
                  </div>
                </Card>
                <Card className="p-6 bg-[#2a2a2a] border-orange-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Menu Items</p>
                      <p className="text-2xl font-bold text-white">{menuItems.length}</p>
                    </div>
                    <Edit3 className="w-8 h-8 text-blue-400" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-[#2a2a2a] border-orange-900/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Popular Items</h3>
                  <div className="space-y-3">
                    {analytics.popularItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-slate-300">{item.name}</span>
                        <span className="text-orange-400 font-medium">{item.orders} orders</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-[#2a2a2a] border-orange-900/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="border-l-2 border-orange-400 pl-3">
                        <p className="text-slate-300 text-sm">{activity.action}</p>
                        <p className="text-orange-400 text-xs">{activity.item} • {activity.time}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Menu Management Tab */}
            <TabsContent value="menu" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Menu Items</h2>
                  <p className="text-slate-400">Manage your menu items and pricing</p>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedItem({
                      id: `new-${Date.now()}`,
                      name: '',
                      description: '',
                      category: categories[0].name,
                      imageUrl: '',
                      sizeOptions: [{ size: '2L', price: 30, portionInfo: '2 Litres' }],
                      isActive: true,
                      isFeatured: false
                    });
                    setIsEditing(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md bg-[#2a2a2a] border-orange-900/20 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map((item) => (
                  <Card key={item.id} className="p-4 bg-[#2a2a2a] border-orange-900/20">
                    <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-400 font-medium">
                          £{item.sizeOptions[0].price}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Categories</h2>
                  <p className="text-slate-400">Manage menu categories and organization</p>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id} className="p-4 bg-[#2a2a2a] border-orange-900/20">
                    <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <p className="text-slate-400 text-sm">{category.description}</p>
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Analytics & Reports</h2>
                <p className="text-slate-400">Detailed insights into menu performance</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-[#2a2a2a] border-orange-900/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue by Category</h3>
                  <div className="space-y-4">
                    {categories.slice(0, 4).map((category, index) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">{category.name}</span>
                          <span className="text-orange-400">£{(2000 - index * 300).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full"
                            style={{ width: `${90 - index * 15}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-[#2a2a2a] border-orange-900/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Trends</h3>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Chart visualization coming soon</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Modal */}
          {isEditing && selectedItem && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#2a2a2a] border-orange-900/20">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {selectedItem.id.startsWith('new-') ? 'Add New Item' : 'Edit Menu Item'}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedItem(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input
                          id="name"
                          value={selectedItem.name}
                          onChange={(e) => setSelectedItem(prev => 
                            prev ? { ...prev, name: e.target.value } : null
                          )}
                          className="bg-[#1e1e1e] border-orange-900/20 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <textarea
                          id="description"
                          value={selectedItem.description}
                          onChange={(e) => setSelectedItem(prev => 
                            prev ? { ...prev, description: e.target.value } : null
                          )}
                          className="w-full p-3 bg-[#1e1e1e] border border-orange-900/20 rounded-lg text-white"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="category" className="text-white">Category</Label>
                        <select
                          id="category"
                          value={selectedItem.category}
                          onChange={(e) => setSelectedItem(prev => 
                            prev ? { ...prev, category: e.target.value } : null
                          )}
                          className="w-full p-3 bg-[#1e1e1e] border border-orange-900/20 rounded-lg text-white"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">Current Image</Label>
                        {selectedItem.imageUrl && (
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                            <Image
                              src={selectedItem.imageUrl}
                              alt={selectedItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="mt-2">
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex items-center justify-center p-4 border-2 border-dashed border-orange-900/20 rounded-lg hover:border-orange-500 transition-colors">
                              <Upload className="w-6 h-6 mr-2 text-orange-400" />
                              <span className="text-orange-400">Upload New Image</span>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Size Options</Label>
                    <div className="space-y-3">
                      {selectedItem.sizeOptions.map((option, index) => (
                        <div key={index} className="grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Size"
                            value={option.size}
                            onChange={(e) => {
                              const newSizeOptions = [...selectedItem.sizeOptions];
                              newSizeOptions[index] = { ...option, size: e.target.value };
                              setSelectedItem(prev => 
                                prev ? { ...prev, sizeOptions: newSizeOptions } : null
                              );
                            }}
                            className="bg-[#1e1e1e] border-orange-900/20 text-white"
                          />
                          <Input
                            type="number"
                            placeholder="Price"
                            value={option.price}
                            onChange={(e) => {
                              const newSizeOptions = [...selectedItem.sizeOptions];
                              newSizeOptions[index] = { ...option, price: parseFloat(e.target.value) || 0 };
                              setSelectedItem(prev => 
                                prev ? { ...prev, sizeOptions: newSizeOptions } : null
                              );
                            }}
                            className="bg-[#1e1e1e] border-orange-900/20 text-white"
                          />
                          <Input
                            placeholder="Portion Info"
                            value={option.portionInfo}
                            onChange={(e) => {
                              const newSizeOptions = [...selectedItem.sizeOptions];
                              newSizeOptions[index] = { ...option, portionInfo: e.target.value };
                              setSelectedItem(prev => 
                                prev ? { ...prev, sizeOptions: newSizeOptions } : null
                              );
                            }}
                            className="bg-[#1e1e1e] border-orange-900/20 text-white"
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        const newSizeOptions = [...selectedItem.sizeOptions, { size: '', price: 0, portionInfo: '' }];
                        setSelectedItem(prev => 
                          prev ? { ...prev, sizeOptions: newSizeOptions } : null
                        );
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Size Option
                    </Button>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedItem(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveItem}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}