"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useInitData } from "~/telegram/InitDataContext";
import { useRouter } from 'next/navigation'; // Import useRouter

// Validation schema
const formSchema = z.object({
    ideaName: z.string().min(2, {
        message: "Idea name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
});

interface IdeaFormProps {
    eventId: string; // Pass event ID as prop
    eventName: string; // Pass event name as prop (optional)
}

export default function IdeaForm({ eventId, eventName }: IdeaFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ideaName: "",
            description: "",
        },
    });

    // Use the custom hook to get the user data
    const { user } = useInitData();
    const router = useRouter(); // Initialize router

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            alert('User not authenticated.');
            return;
        }

        try {
            // Submit the idea with the event ID and user ID in the request
            const response = await fetch(`/api/idea/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.ideaName,
                    description: values.description,
                    eventId,
                    userId: user.id, // Include user ID from the context
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create idea');
            }

            const data = await response.json();
            console.log('Idea created successfully:', data);
            // Redirect to the event page
            router.push(`/event/${eventId}`);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to create idea.');
        }
    }

    return (
        <div className="flex-col max-w-md mx-auto mt-10 md:mt-0 h-screen justify-center items-center md:flex text-foreground">
            <h1 className="font-bold max-w-72 md:max-w-full text-xl mb-10">Create New Idea for {eventName}!</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="ideaName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Idea Name</FormLabel>
                                <FormControl>
                                    <Input className="bg-accent text-accent-foreground placeholder:text-accent-foreground" placeholder="Amazing Idea" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The name of your idea for the event.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your idea..."
                                        className="bg-accent text-accent-foreground placeholder:text-accent-foreground resize-none h-48 w-72 md:w-96"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Briefly describe your idea for the event.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-between flex">
                        <Button className="hover:bg-secondary hover:text-secondary-foreground" type="submit">Submit</Button>
                        <Link href={`/event/${eventId}`}>
                            <Button className="hover:bg-accent hover:text-accent-foreground" variant="outline">Back</Button>
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}
