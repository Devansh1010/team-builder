import CreateBatch from '@/components/batch/createBatch'


const page = () => {
    return (
        <div className='w-full px-10 py-6'>
            <div className='flex justify-between items-center px-10'>
                <h1>All Batchs</h1>
                <CreateBatch />
            </div>
            <div>

            </div>
        </div>
    )
}

export default page