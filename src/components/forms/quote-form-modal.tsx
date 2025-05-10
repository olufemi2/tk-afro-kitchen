import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";

export function QuoteFormModal({ trigger }: { trigger: ReactNode }) {
}
<form onSubmit={handleSubmit}>
  <div>
    <label>Name</label>
    <input
      name="name"
      className="w-full border rounded px-2 py-1 text-black bg-white"
      value={formData.name}
      onChange={handleChange}
      required
    />
  </div>
  <div>
    <label>Email</label>
    <input
      name="email"
      type="email"
      className="w-full border rounded px-2 py-1 text-black bg-white"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>
  <div>
    <label>Message</label>
    <textarea
      name="message"
      className="w-full border rounded px-2 py-1 text-black bg-white"
      value={formData.message}
      onChange={handleChange}
      required
    />
  </div>
  <Button type="submit">Submit</Button>
</form>