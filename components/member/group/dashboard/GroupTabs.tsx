import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IGroup } from '@/models/user_models/group.model'
import TabOverview from './TabOverview'
import TaskList from '../../task/_components/taskList/TaskTable'
import CreateTask from '../../task/_components/CreateTask'

const GroupTabs = ({ group }: { group: IGroup }) => {
  return (
    <div>
      <Tabs defaultValue="tasks" className="w-full">
        {/* Tab Headers */}
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="Discussion">Discussion</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Tab 1 */}
        <TabsContent value="overview" className="mt-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <TabOverview group={group} />
          </div>
        </TabsContent>

        {/* Tab 2 */}
        <TabsContent value="tasks" className="mt-6">
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <CreateTask group={group} />
            <TaskList group={group} />
          </div>
        </TabsContent>

        {/* Tab 3 */}
        <TabsContent value="settings" className="mt-6">
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Members</h3>
            <p className="text-sm text-muted-foreground">
              Members management content will go here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="Discussion" className="mt-6">
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Members</h3>
            <p className="text-sm text-muted-foreground">Discussion</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GroupTabs
