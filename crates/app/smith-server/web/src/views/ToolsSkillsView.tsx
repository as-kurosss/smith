import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ToolsPanel } from '../components/ToolsPanel'
import { SkillsPanel } from '../components/SkillsPanel'
import type { ToolBinding } from '../types'

interface Props {
  tools: ToolBinding[]
  onToolsChange: (tools: ToolBinding[]) => void
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function ToolsSkillsView({ tools, onToolsChange, addToast }: Props) {
  return (
    <div className="p-6">
      <Tabs defaultValue="tools">
        <TabsList>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="tools" className="mt-4">
          <ToolsPanel tools={tools} onToolsChange={onToolsChange} />
        </TabsContent>
        <TabsContent value="skills" className="mt-4">
          <SkillsPanel addToast={addToast} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
