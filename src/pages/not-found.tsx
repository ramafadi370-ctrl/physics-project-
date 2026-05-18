import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
      <Link href="/">
        <Button className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
