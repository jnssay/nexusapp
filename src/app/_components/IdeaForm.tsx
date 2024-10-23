"use client";

import React from 'react';
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
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    ideaName: z.string().min(2, {
        message: "Idea name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
});

interface IdeaFormProps {
    eventId: string;
    eventName: string;
}

export default function IdeaForm({ eventId, eventName }: IdeaFormProps) {
    const { user } = useInitData();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ideaName: "",
            description: "",
        },
    });

    const { handleSubmit, formState } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            alert('User not authenticated.');
            return;
        }

        try {
            const response = await fetch(`/api/idea/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.ideaName,
                    description: values.description,
                    eventId,
                    userId: user.id,
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
            <h1 className="font-bold w-72 md:w-full text-lg mb-10 line-clamp-2 overflow-hidden">
                Create New Idea for {eventName}!
            </h1>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Idea Name Field */}
                    <FormField
                        control={form.control}
                        name="ideaName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Idea Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-accent text-accent-foreground placeholder:text-accent-foreground w-72 md:w-96"
                                        placeholder="Amazing Idea"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-foreground">
                                    The name of your idea for the event.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Description Field */}
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
                                <FormDescription className="text-foreground">
                                    Briefly describe your idea for the event.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Action Buttons */}
                    <div className="justify-between flex">
                        <Link href={`/event/${eventId}`}>
                            <Button variant="muted">Back</Button>
                        </Link>
                        <Button
                            variant="default"
                            type="submit"
                            disabled={formState.isSubmitting}
                        >
                            {formState.isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
