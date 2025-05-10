'use client';

import { Header } from "@/components/layout/header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CateringPage() {
  return (
    <div>
      <Header />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Request a Quote</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Modal</DialogTitle>
          </DialogHeader>
          <div>This is a test modal. If you see this, Dialog works!</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}