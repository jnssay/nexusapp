"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link';

import { Button } from "~/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

const formSchema = z.object({
    eventName: z.string().min(2, {
        message: "Event name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
})

export default function IdeaForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eventName: "",
            description: "",
            attendees: 1,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        // Here you would typically send the form data to your backend
        alert("Form submitted successfully!")
    }

    return (
        <div className="flex-col max-w-md mx-auto mt-10 md:mt-0 h-screen justify-center items-center md:flex">
            <h1 className="font-bold text-xl mb-10">Create New Idea!</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="eventName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Idea Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Amazing Idea" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The name of your event idea.
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
                                        placeholder="Tell us about your event idea..."
                                        className="resize-none h-48 w-72 md:w-96"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Briefly describe your event idea.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-between flex">
                        <Button type="submit">Submit</Button>
                        <Link href={`/eventId`}><Button variant="outline">Back</Button></Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}