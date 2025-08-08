
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground relative">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go back home</span>
        </Link>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4">
          <h1 className="text-4xl font-bold tracking-tighter">404</h1>
          <div className="h-10 w-px bg-border" />
          <p className="text-muted-foreground">This page could not be found.</p>
        </div>
      </div>
    </div>
  );
}
