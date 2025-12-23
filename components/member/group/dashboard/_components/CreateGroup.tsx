'use client'

import { groupSchema } from '@/lib/schemas/group/CreateGroup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGroup } from '@/lib/api/group.api'
import { toast } from 'sonner'

const CreateGroup = () => {
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const {
    mutate: createGroupMutate,
    data: createdGroup,
    isPending,
  } = useMutation({
    mutationFn: createGroup,

    onSuccess: () => {
      setOpen(false)
      toast.success('Group Created Successfully')
      queryClient.invalidateQueries({ queryKey: ['activeGroups'] })
    },

    onError: () => {
      toast.error(createdGroup.message)
    },
  })

  const [techInput, setTechInput] = useState('')

  const addTechStack = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return

    const current = form.getValues('techStack')

    if (current.includes(trimmed)) return // prevent duplicates

    form.setValue('techStack', [...current, trimmed], {
      shouldValidate: true,
    })

    setTechInput('')
  }

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      desc: '',
      techStack: [],
    },
  })

  const onSubmit = (values: z.infer<typeof groupSchema>) => {
    createGroupMutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-600 hover:bg-sky-700 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full font-semibold transition-all">
          Create Group
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg dark:bg-[#161616] dark:border-white/10 transition-colors">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Create Group
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-gray-400">
            Set up your group by adding a name, description and tech stack.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Group Title */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-gray-300">Group Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bug Hunter"
                        {...field}
                        className="dark:bg-black/20 dark:border-white/10 focus-visible:ring-sky-500"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400 dark:text-gray-500">
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Group Description */}
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-gray-300">Group Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe what you are doing in your Group"
                        {...field}
                        className="dark:bg-black/20 dark:border-white/10 focus-visible:ring-sky-500"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400 dark:text-gray-500">
                      Other users can decide based on your description.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tech Stack */}
              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-gray-300">Tech Stack</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type tech and press Enter"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        className="dark:bg-black/20 dark:border-white/10 focus-visible:ring-sky-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTechStack(techInput)
                          }
                        }}
                      />
                    </FormControl>

                    {/* Tags Preview */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {field.value.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-sky-500/10 text-slate-700 dark:text-sky-400 border border-slate-200 dark:border-sky-500/20 rounded-full flex items-center gap-2"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() =>
                              form.setValue(
                                'techStack',
                                field.value.filter((_, i) => i !== index),
                                { shouldValidate: true }
                              )
                            }
                            className="text-red-500 hover:text-red-600 transition-colors font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-bold"
              >
                {isPending ? 'Creating...' : 'Create Group'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroup
