'use client'

import { useForm } from 'react-hook-form'

import Papa from 'papaparse'
import axios from 'axios'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

//dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

//Form
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
import { formSchema, FormValues } from '@/lib/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { redirect } from 'next/navigation'

const CreateBatch = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', // empty string by default
      limit: 4,
      file: undefined as unknown as FileList, // file input starts empty
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmittingForm(true)
    const file = data.file[0]
    try {
      if (file) {
        Papa.parse(file, {
          header: true, // Parse first row as header
          skipEmptyLines: true,
          complete: async (result) => {
            const res = await axios.post('/api/v1/batch/createBatch', {
              data: result.data,
              name: data.name,
              limit: Number(data.limit),
            })

            console.log(res)
            if (res.data.success) {
              toast.success('All users are saved in database')
              redirect('/admin/batches')
            } else {
              toast.error(res.data.message)
            }
          },
        })
      }
    } catch (error: any) {
      toast.error('Error Parsing File', { description: error })
    } finally {
      setIsSubmittingForm(false)
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="flex gap-2">
            <Plus />
            Create New Batch
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="">
              <div className=" flex items-center justify-center">
                <div className="shadow-lg rounded-xl p-8 w-full max-w-md">
                  {/* Heading */}
                  <h1 className="text-3xl font-bold mb-6 text-center ">Create New Batch</h1>

                  {/* Form */}
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Batch name" {...field} />
                            </FormControl>
                            <FormDescription>Name of your Batch or User lits</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="limit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group Limit</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter Group Limit"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of user in group for this batch
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CSV File</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept=".csv"
                                placeholder="Choose File"
                                onChange={(e) => {
                                  const files = e.target.files
                                  field.onChange(files) // store FileList in RHF state
                                }}
                              />
                            </FormControl>
                            <FormDescription>Select your CSV file</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isSubmittingForm} className="cursor-pointer">
                        Submit
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateBatch
