import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { Divide, Loader2, Trash2 } from 'lucide-react'

const DeleteBatch = ({ id }: { id: string }) => {
  const [isDeletingBatch, setIsDeletingBatch] = useState(false)
  const [error, setError] = useState('')

  const deleteBatch = async () => {
    setIsDeletingBatch(true)
    try {
      const res = await axios.delete(`/api/v1/batch/deleteBatch?batchId=${id}`)

      if (res.data.success) {
        toast.success('Batch Deleted Successfully')
        redirect('/admin/batches')
      }
    } catch (error: any) {
      setError('Error Occured!')
      toast.error('Error Deleting Batch', { description: error })
    } finally {
      setIsDeletingBatch(false)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your Batch and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteBatch}>
            {isDeletingBatch ? <Loader2 className="animate-spin" /> : 'Continue'}

            {error && <div className="text-red-700 ml-2">{error}</div>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteBatch
