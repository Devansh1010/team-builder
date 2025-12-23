import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IGroup } from '@/models/user_models/group.model'
import TabOverview from './overview/TabOverview'
import TaskList from '../../task/_components/taskList/TaskTable'
import CreateTask from '../../task/_components/CreateTask'

const GroupTabs = ({ group }: { group: IGroup }) => {
  return (
    <div>
      <Tabs defaultValue="tasks" className="w-full">
        {/* Tab Headers */}
        <TabsList className="grid w-full grid-cols-4 h-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all">Overview</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all">Tasks</TabsTrigger>
          <TabsTrigger value="Discussion" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all">Discussion</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#161616] dark:data-[state=active]:text-white transition-all">Settings</TabsTrigger>
        </TabsList>

        {/* Tab 1 */}
        <TabsContent value="overview" className="mt-6 outline-none">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#161616] transition-colors">
            <TabOverview group={group} />
          </div>
        </TabsContent>

        {/* Tab 2 */}
        <TabsContent value="tasks" className="mt-6 outline-none">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#161616] transition-colors">
            <TaskList group={group} />
          </div>
        </TabsContent>

        {/* Tab 3 */}
        <TabsContent value="settings" className="mt-6 outline-none">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#161616] transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Members</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Members management content will go here.
            </p>
          </div>
        </TabsContent>

        {/* Tab 4 */}
        <TabsContent value="Discussion" className="mt-6 outline-none">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#161616] transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Discussion</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">Join the conversation below.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GroupTabs
