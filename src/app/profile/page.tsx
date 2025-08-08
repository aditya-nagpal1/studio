
"use client";

import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/auth/with-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function ProfilePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // This case happens right after signup before the profile is created in firestore
  if (!userData) {
      router.push('/create-profile');
      return (
           <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
           </div>
      );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
                    <AvatarImage src={userData.photoURL} alt={userData.displayName} />
                    <AvatarFallback className="text-4xl">{userData.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-3xl">{userData.displayName}</CardTitle>
                <CardDescription>@{userData.username}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">{userData.bio || 'No bio yet.'}</p>
                 <Button onClick={() => router.push('/create-profile')} className="mt-6">Edit Profile</Button>
            </CardContent>
        </Card>
    </div>
  );
}

export default withAuth(ProfilePage);
