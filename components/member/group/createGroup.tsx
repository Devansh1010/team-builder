'use client'

import { groupSchema } from '@/lib/schemas/group/CreateGroup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useMutation, useQuery } from '@tanstack/react-query'
import { createGroup } from '@/lib/api/group.api'

const CreateGroup = () => {
  const [open, setOpen] = useState<boolean>(false)

  const {
    mutate: createGroupMutate,
    data: createdGroup,
    isPending,
  } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      setOpen(false)
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
        <Button>Create Group</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Set up your group by adding a name, description and tech stack.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Bug Hunter" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Descibe what you are doing in your Group" {...field} />
                    </FormControl>
                    <FormDescription>
                      Other User can decide based on you Group Description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Type tech and press Enter"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTechStack(techInput)
                          }
                        }}
                      />
                    </FormControl>

                    {/* Tags Preview */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-muted rounded-full flex items-center gap-2"
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
                            className="text-red-500 font-bold"
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

              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroup
