'use client'
import { Button } from '@/components/ui/button';
import { useGroupStore } from '@/store/group.store';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Separator } from '@radix-ui/react-separator';
import axios from 'axios';
import { Badge, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { joinGroupSchema, JoinGroupSchema } from '@/lib/schemas/group/SendRequest'
// Dialoge

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const page = ({ params }: { params: { groupId: string } }) => {

    const [resolvedId, setResolvedId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);


    async function getId() {
        const { groupId } = await params;
        setResolvedId(groupId);
    }

    const {
        selectedGroup,
        isGettingActiveGroup,
        message,
        setActiveGroup,
    } = useGroupStore()

    useEffect(() => {
        getId();
    }, []);

    useEffect(() => {
        if (!resolvedId) return;
        setActiveGroup(resolvedId)
    }, [resolvedId])

    useEffect(() => {
        if (message) toast.info(message)
    }, [message])

    const form = useForm<JoinGroupSchema>({
        resolver: zodResolver(joinGroupSchema),
        defaultValues: {
            message: "",
        },
    })

    const sendRequest = async (data: JoinGroupSchema) => {
        try {
            setIsSubmitting(true);

            const res = await axios.post(
                `/api/member/group/joinGroup?groupId=${resolvedId}`,
                data
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setOpen(false);
                form.reset();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Error occurred while sending request");
        } finally {
            setIsSubmitting(false);
        }
    };



    if (isGettingActiveGroup) {
        return (
            <div className="w-full flex justify-center items-center">
                <Loader2 className='size-3 animate-spin' />
            </div>
        )
    }

    if (!resolvedId) {
        return (
            <div className="w-full flex justify-center items-center">
                <Loader2 className='size-3 animate-spin' />
            </div>
        )
    }

    if (!selectedGroup.length) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Group Not Found
            </div>
        )
    }

    const group = selectedGroup[0]

    return (
        <div className="mx-auto max-w-5xl px-6 py-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">

                {/* Title */}
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    {group.name.toUpperCase()}
                </h1>

                {/* Right Actions */}
                <div className="flex items-center gap-4">

                    {/* Members */}
                    <div className="flex -space-x-2">
                        {group.accessTo?.map((user) => (
                            <Avatar
                                key={user.userId.toString()}
                                className="h-8 w-8 border border-white dark:border-gray-900"
                            >
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>

                    {/* Join Button */}
                    <Dialog open={open} onOpenChange={setOpen}>

                        {/* Open dialog */}
                        <DialogTrigger asChild>
                            <Button size="sm" className="rounded-full px-4 cursor-pointer">
                                Send Join Request
                            </Button>
                        </DialogTrigger>

                        {/* Dialog Content */}
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Join Group</DialogTitle>
                                <DialogDescription>
                                    Send a short message explaining why you want to join.
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(sendRequest)}
                                    className="space-y-6"
                                >

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="I would love to contribute to backend or schema design"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isSubmitting}
                                                className='cursor-pointer'
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button type="submit" disabled={isSubmitting} className='cursor-pointer'>
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                "Submit"
                                            )}
                                        </Button>

                                    </DialogFooter>

                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>


                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

            {/* Content */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                {/* Description */}
                <p className="max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {group.desc}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                    {group.techStack?.map((tech) => (
                        <Badge
                            key={tech}
                            // variant="secondary"
                            className="rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700
                       dark:bg-gray-800 dark:text-gray-300"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>

            </div>
        </div>


    )
}

export default page