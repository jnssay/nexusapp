"use client"

import React, { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "~/components/ui/card"
import { TbThumbUpFilled, TbThumbDownFilled } from "react-icons/tb";

// Define the type for an idea
interface Idea {
    id: number
    title: string
    author: string
    description: string
    likes: number
    dislikes: number
    userVote: "like" | "dislike" | null
}

// Sample data for ideas with initial likes and dislikes
const initialIdeas: Omit<Idea, "userVote">[] = [
    {
        id: 1,
        title: "Classic Literature Night",
        author: "Emily",
        description:
            "An evening dedicated to discussing classics like 'Pride and Prejudice' and 'Moby Dick'.",
        likes: 15,
        dislikes: 2,
    },
    {
        id: 2,
        title: "Meet the Author: John Smith",
        author: "Michael",
        description:
            "A Q&A session with John Smith, author of the bestselling 'Mystery of the Old Manor'.",
        likes: 20,
        dislikes: 1,
    },
    {
        id: 3,
        title: "Poetry Slam",
        author: "Sarah",
        description:
            "An open mic night where members can share their favorite poems or original works.",
        likes: 10,
        dislikes: 0,
    },
    {
        id: 4,
        title: "Book Swap Event",
        author: "David",
        description:
            "Bring a book, take a book! A casual event for exchanging books among members.",
        likes: 18,
        dislikes: 3,
    },
    {
        id: 5,
        title: "Genre Exploration: Science Fiction",
        author: "Laura",
        description:
            "A deep dive into classic and modern science fiction novels and short stories.",
        likes: 12,
        dislikes: 2,
    },
    {
        id: 6,
        title: "Reading Marathon for Charity",
        author: "James",
        description:
            "A 24-hour reading marathon to raise funds for local literacy programs.",
        likes: 22,
        dislikes: 1,
    },
]

const IdeaBoard: React.FC = () => {
    // Use state to manage the list of ideas
    const [ideas, setIdeas] = useState<Idea[]>(
        initialIdeas.map((idea) => ({ ...idea, userVote: null }))
    )
    const [heading, setHeading] = useState<string>("Book Club Event Ideas")
    const [author, setAuthor] = useState<string>("Janessa Yang")


    // Handler for upvoting an idea
    const handleUpvote = (id: number): void => {
        setIdeas(
            ideas.map((idea) => {
                if (idea.id === id) {
                    let { likes, dislikes, userVote } = idea
                    if (userVote === "like") {
                        // Remove like
                        likes -= 1
                        userVote = null
                    } else if (userVote === "dislike") {
                        // Remove dislike, add like
                        dislikes -= 1
                        likes += 1
                        userVote = "like"
                    } else {
                        // Add like
                        likes += 1
                        userVote = "like"
                    }
                    return { ...idea, likes, dislikes, userVote }
                } else {
                    return idea
                }
            })
        )
    }

    // Handler for downvoting an idea
    const handleDownvote = (id: number): void => {
        setIdeas(
            ideas.map((idea) => {
                if (idea.id === id) {
                    let { likes, dislikes, userVote } = idea
                    if (userVote === "dislike") {
                        // Remove dislike
                        dislikes -= 1
                        userVote = null
                    } else if (userVote === "like") {
                        // Remove like, add dislike
                        likes -= 1
                        dislikes += 1
                        userVote = "dislike"
                    } else {
                        // Add dislike
                        dislikes += 1
                        userVote = "dislike"
                    }
                    return { ...idea, likes, dislikes, userVote }
                } else {
                    return idea
                }
            })
        )
    }

    return (
        <div className="container mx-auto p-4">
            <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="text-4xl font-bold mb-6 text-center w-full focus:outline-none"
            />
            <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="text-xl mb-20 text-center w-full focus:outline-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ideas.map((idea) => (
                    <Card
                        key={idea.id}
                        className="hover:shadow-lg transition-shadow duration-300 bg-secondary"
                    >
                        <CardHeader>
                            <CardTitle>{idea.title}</CardTitle>
                            <CardDescription>By {idea.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {idea.description}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <div className="flex items-center justify-between w-full">
                                <button
                                    onClick={() => handleUpvote(idea.id)}
                                    className={`flex items-center ${idea.userVote === "like"
                                        ? "text-green-600"
                                        : "text-gray-500 hover:text-green-600"
                                        }`}
                                >
                                    <TbThumbUpFilled className="mr-1" />
                                    {idea.likes}
                                </button>
                                <button
                                    onClick={() => handleDownvote(idea.id)}
                                    className={`flex items-center ${idea.userVote === "dislike"
                                        ? "text-red-600"
                                        : "text-gray-500 hover:text-red-600"
                                        }`}
                                >
                                    <TbThumbDownFilled className="mr-1" />
                                    {idea.dislikes}
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default IdeaBoard
