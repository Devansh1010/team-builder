import { useState } from 'react'
import { joinGroupSchema, JoinGroupSchema } from '@/lib/schemas/group/SendRequest'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchActiveGroups, handleLeaveGroup } from '@/lib/api/group.api'
import { Loader2, LogOut } from 'lucide-react'

const LeaveGroupDialog = () => {
    // 1. Manage the open state of the Dialog
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const { data: groupOverview, isLoading: isQueryLoading } = useQuery({
        queryKey: ['activeGroups'],
        queryFn: fetchActiveGroups,
        select: (groups) => ({
            id: groups[0]?._id,
        }),
        enabled: open, // Only fetch when the dialog is actually opened
        refetchOnWindowFocus: false,
    })

    const groupId = groupOverview?.id

    const leaveGroup = useMutation({
        mutationFn: handleLeaveGroup,
        onSuccess: () => {
            toast.success('Group Left Successfully')
            queryClient.invalidateQueries({ queryKey: ['activeGroups'] })
            // 2. Close the dialog on success
            setOpen(false)
        },
        onError: () => {
            toast.error('Failed to Leave Group')
        },
    })

    const form = useForm<JoinGroupSchema>({
        resolver: zodResolver(joinGroupSchema),
        defaultValues: { message: '' },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger Button */}
            <DialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Leave Group
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Leave Group</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {!groupId && isQueryLoading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : !groupId ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                        No active group found to leave.
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((data) =>
                                leaveGroup.mutate({ groupId: groupId.toString(), data })
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason to Leave the Group</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                placeholder="Why are you leaving?" 
                                                disabled={leaveGroup.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="gap-2 pt-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" disabled={leaveGroup.isPending}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button 
                                    type="submit" 
                                    variant="destructive" 
                                    disabled={leaveGroup.isPending}
                                >
                                    {leaveGroup.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Confirm Leave'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default LeaveGroupDialog