
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { createUserProfile } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import withAuth from '@/components/auth/with-auth';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, "Username can't be longer than 20 characters."),
  displayName: z.string().min(1, 'Display name is required.'),
  bio: z.string().max(160, 'Bio cannot be longer than 160 characters.').optional(),
  photoFile: z.instanceof(File).optional(),
});

function CreateProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', displayName: '', bio: '', photoFile: undefined },
  });

  useEffect(() => {
    if (user) {
        form.setValue('displayName', user.displayName || '');
        setPhotoPreview(user.photoURL || '');
    }
    if (userData) {
        form.setValue('username', userData.username || '');
        form.setValue('displayName', userData.displayName || user?.displayName || '');
        form.setValue('bio', userData.bio || '');
        setPhotoPreview(userData.photoURL || user?.photoURL || '');
    }
  }, [user, userData, form]);
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          form.setValue('photoFile', file);
          setPhotoPreview(URL.createObjectURL(file));
      }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (!user) {
        toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to create a profile.' });
        setIsLoading(false);
        return;
    }
    try {
      await createUserProfile(user, values);
      toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully.' });
      router.push('/profile');
    } catch (error) {
        let message = 'An unknown error occurred.';
        if (error instanceof Error) {
            message = error.message;
        }
      toast({ variant: 'destructive', title: 'Error', description: message });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
          <CardDescription>Tell us a bit more about yourself.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={photoPreview} alt="Profile Picture" />
                        <AvatarFallback>{form.watch('displayName')?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <FormField
                        control={form.control}
                        name="photoFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Picture</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A little about yourself..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CreateProfilePage);
