'use client';

import { useState } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Building2, Cake, Heart } from "lucide-react";

interface QuoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteFormModal({ isOpen, onClose }: QuoteFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    guestCount: '',
    location: '',
    contactName: '',
    email: '',
    phone: '',
    budget: '',
    additionalDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      // Show success message
      onClose();
    } catch (error) {
      // Show error message
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gradient mb-6">Request a Quote</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Type Selection */}
            <div className="space-y-4">
              <Label>Event Type</Label>
              <RadioGroup 
                value={formData.eventType}
                onValueChange={(value) => setFormData({...formData, eventType: value})}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporate" id="corporate" />
                  <Label htmlFor="corporate" className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Corporate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex items-center">
                    <Cake className="w-4 h-4 mr-2" />
                    Private Party
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wedding" id="wedding" />
                  <Label htmlFor="wedding" className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Wedding
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.eventDate || "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.eventDate ? new Date(formData.eventDate) : undefined}
                      onSelect={(date) => setFormData({...formData, eventDate: date?.toISOString() || ''})}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Number of Guests</Label>
                <Input
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                  placeholder="Enter guest count"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Enter event location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Your phone number"
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full bg-[#2a2a2a] border border-orange-900/20 rounded-md p-2 text-slate-300"
              >
                <option value="">Select budget range</option>
                <option value="1000-2000">£1,000 - £2,000</option>
                <option value="2000-5000">£2,000 - £5,000</option>
                <option value="5000-10000">£5,000 - £10,000</option>
                <option value="10000+">£10,000+</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Additional Details</Label>
              <Textarea
                value={formData.additionalDetails}
                onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
                placeholder="Tell us about your event requirements..."
                className="min-h-[100px]"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
} 