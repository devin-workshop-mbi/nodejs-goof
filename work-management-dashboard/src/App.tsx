import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Truck, 
  Brain, 
  BookOpen, 
  Newspaper, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Terminal,
  X,
  Link as LinkIcon,
  File,
  ListTodo,
  StickyNote,
  Kanban,
  BookMarked,
  Sparkles,
  Cpu,
  GraduationCap,
  Youtube,
  Rss,
  FolderOpen,
  Database,
  Globe,
  MessageSquare,
  Lightbulb,
  Rocket,
  Bot,
  Zap
} from 'lucide-react'

// Types
interface WorkItem {
  id: string
  title: string
  type: 'task' | 'document' | 'link' | 'update' | 'news' | 'learning'
  summary: string
  status: 'open' | 'in-progress' | 'completed'
  subtasks: string[]
  priority: 'low' | 'medium' | 'high' | 'none'
  owner: string
  deadline: string
  source: 'text' | 'link' | 'file-path' | 'endpoint'
  path_or_link: string
  section: Section
  createdAt: string
}

type Section = 'vans-operations' | 'ai-department' | 'ai-learning' | 'ai-news' | 'ai-documents'

const SECTIONS: { id: Section; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'vans-operations', label: 'VANS OPERATIONS', icon: <Truck className="h-5 w-5" />, color: 'bg-blue-500' },
  { id: 'ai-department', label: 'AI@DEPARTMENT', icon: <Brain className="h-5 w-5" />, color: 'bg-purple-500' },
  { id: 'ai-learning', label: 'AI LEARNING', icon: <BookOpen className="h-5 w-5" />, color: 'bg-green-500' },
  { id: 'ai-news', label: 'AI NEWS', icon: <Newspaper className="h-5 w-5" />, color: 'bg-orange-500' },
  { id: 'ai-documents', label: 'AI DOCUMENTS', icon: <FileText className="h-5 w-5" />, color: 'bg-red-500' },
]

const ITEM_TYPES = [
  { value: 'task', label: 'Task', icon: <ListTodo className="h-4 w-4" /> },
  { value: 'document', label: 'Document', icon: <File className="h-4 w-4" /> },
  { value: 'link', label: 'Link', icon: <LinkIcon className="h-4 w-4" /> },
  { value: 'update', label: 'Update', icon: <AlertCircle className="h-4 w-4" /> },
  { value: 'news', label: 'News', icon: <Newspaper className="h-4 w-4" /> },
  { value: 'learning', label: 'Learning', icon: <BookOpen className="h-4 w-4" /> },
]

const STATUS_CONFIG = {
  'open': { label: 'Open', icon: <AlertCircle className="h-4 w-4" />, color: 'bg-yellow-500' },
  'in-progress': { label: 'In Progress', icon: <Clock className="h-4 w-4" />, color: 'bg-blue-500' },
  'completed': { label: 'Completed', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-500' },
}

const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: 'bg-gray-400' },
  'medium': { label: 'Medium', color: 'bg-yellow-500' },
  'high': { label: 'High', color: 'bg-red-500' },
  'none': { label: 'None', color: 'bg-gray-300' },
}

// Quick Links for each section
interface QuickLink {
  id: string
  title: string
  description: string
  url: string
  icon: React.ReactNode
  color: string
}

const QUICK_LINKS: Record<Section, QuickLink[]> = {
  'vans-operations': [
    { id: 'jira', title: 'JIRA', description: 'Project & Issue Tracking', url: 'https://jira.atlassian.com', icon: <Kanban className="h-6 w-6" />, color: 'bg-blue-500' },
    { id: 'confluence', title: 'Confluence', description: 'Documentation & Wiki', url: 'https://confluence.atlassian.com', icon: <BookMarked className="h-6 w-6" />, color: 'bg-blue-600' },
    { id: 'slack', title: 'Slack', description: 'Team Communication', url: 'https://slack.com', icon: <MessageSquare className="h-6 w-6" />, color: 'bg-purple-500' },
    { id: 'github', title: 'GitHub', description: 'Code Repository', url: 'https://github.com', icon: <Database className="h-6 w-6" />, color: 'bg-gray-800' },
    { id: 'sharepoint', title: 'SharePoint', description: 'Document Management', url: 'https://sharepoint.com', icon: <FolderOpen className="h-6 w-6" />, color: 'bg-teal-500' },
    { id: 'teams', title: 'MS Teams', description: 'Video & Chat', url: 'https://teams.microsoft.com', icon: <Globe className="h-6 w-6" />, color: 'bg-indigo-500' },
  ],
  'ai-department': [
    { id: 'ai-portal', title: 'AI Portal', description: 'Internal AI Dashboard', url: '#', icon: <Brain className="h-6 w-6" />, color: 'bg-purple-500' },
    { id: 'ml-platform', title: 'ML Platform', description: 'Machine Learning Tools', url: '#', icon: <Cpu className="h-6 w-6" />, color: 'bg-pink-500' },
    { id: 'ai-usecases', title: 'AI Use Cases', description: 'Department Projects', url: '#', icon: <Lightbulb className="h-6 w-6" />, color: 'bg-yellow-500' },
    { id: 'model-registry', title: 'Model Registry', description: 'AI Model Catalog', url: '#', icon: <Database className="h-6 w-6" />, color: 'bg-green-500' },
    { id: 'ai-docs', title: 'AI Documentation', description: 'Guidelines & Standards', url: '#', icon: <BookMarked className="h-6 w-6" />, color: 'bg-blue-500' },
    { id: 'ai-support', title: 'AI Support', description: 'Help & Resources', url: '#', icon: <MessageSquare className="h-6 w-6" />, color: 'bg-orange-500' },
  ],
  'ai-learning': [
    { id: 'coursera', title: 'Coursera', description: 'Online Courses', url: 'https://www.coursera.org/browse/data-science/machine-learning', icon: <GraduationCap className="h-6 w-6" />, color: 'bg-blue-600' },
    { id: 'deeplearning', title: 'DeepLearning.AI', description: 'AI Specializations', url: 'https://www.deeplearning.ai', icon: <Brain className="h-6 w-6" />, color: 'bg-red-500' },
    { id: 'huggingface', title: 'Hugging Face', description: 'ML Models & Datasets', url: 'https://huggingface.co/learn', icon: <Bot className="h-6 w-6" />, color: 'bg-yellow-500' },
    { id: 'kaggle', title: 'Kaggle', description: 'Competitions & Notebooks', url: 'https://www.kaggle.com/learn', icon: <Rocket className="h-6 w-6" />, color: 'bg-cyan-500' },
    { id: 'fastai', title: 'Fast.ai', description: 'Practical Deep Learning', url: 'https://www.fast.ai', icon: <Zap className="h-6 w-6" />, color: 'bg-purple-600' },
    { id: 'youtube-ai', title: 'AI YouTube', description: 'Video Tutorials', url: 'https://www.youtube.com/results?search_query=machine+learning+tutorial', icon: <Youtube className="h-6 w-6" />, color: 'bg-red-600' },
  ],
  'ai-news': [
    { id: 'openai', title: 'OpenAI Blog', description: 'GPT & DALL-E Updates', url: 'https://openai.com/blog', icon: <Sparkles className="h-6 w-6" />, color: 'bg-green-500' },
    { id: 'anthropic', title: 'Anthropic', description: 'Claude AI News', url: 'https://www.anthropic.com/news', icon: <Bot className="h-6 w-6" />, color: 'bg-orange-500' },
    { id: 'google-ai', title: 'Google AI Blog', description: 'Gemini & Research', url: 'https://blog.google/technology/ai/', icon: <Brain className="h-6 w-6" />, color: 'bg-blue-500' },
    { id: 'mit-news', title: 'MIT AI News', description: 'Research & Innovation', url: 'https://news.mit.edu/topic/artificial-intelligence2', icon: <GraduationCap className="h-6 w-6" />, color: 'bg-red-600' },
    { id: 'arxiv', title: 'arXiv AI', description: 'Latest Papers', url: 'https://arxiv.org/list/cs.AI/recent', icon: <FileText className="h-6 w-6" />, color: 'bg-gray-700' },
    { id: 'techcrunch', title: 'TechCrunch AI', description: 'Industry News', url: 'https://techcrunch.com/category/artificial-intelligence/', icon: <Rss className="h-6 w-6" />, color: 'bg-green-600' },
  ],
  'ai-documents': [
    { id: 'gdrive', title: 'Google Drive', description: 'Cloud Documents', url: 'https://drive.google.com', icon: <FolderOpen className="h-6 w-6" />, color: 'bg-yellow-500' },
    { id: 'notion', title: 'Notion', description: 'Notes & Wikis', url: 'https://www.notion.so', icon: <BookMarked className="h-6 w-6" />, color: 'bg-gray-800' },
    { id: 'dropbox', title: 'Dropbox', description: 'File Storage', url: 'https://www.dropbox.com', icon: <Database className="h-6 w-6" />, color: 'bg-blue-500' },
    { id: 'onedrive', title: 'OneDrive', description: 'Microsoft Storage', url: 'https://onedrive.live.com', icon: <Globe className="h-6 w-6" />, color: 'bg-blue-600' },
    { id: 'sharepoint-docs', title: 'SharePoint', description: 'Enterprise Docs', url: 'https://sharepoint.com', icon: <FolderOpen className="h-6 w-6" />, color: 'bg-teal-500' },
    { id: 'confluence-docs', title: 'Confluence', description: 'Team Documentation', url: 'https://confluence.atlassian.com', icon: <BookMarked className="h-6 w-6" />, color: 'bg-blue-700' },
  ],
}

// Local Storage Key
const STORAGE_KEY = 'work-management-data'

function App() {
  const [items, setItems] = useState<WorkItem[]>([])
  const [activeSection, setActiveSection] = useState<Section>('vans-operations')
  const [searchQuery, setSearchQuery] = useState('')
  const [commandInput, setCommandInput] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [commandOutput, setCommandOutput] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState<Partial<WorkItem>>({
    title: '',
    type: 'task',
    summary: '',
    status: 'open',
    subtasks: [],
    priority: 'medium',
    owner: 'Me',
    deadline: '',
    source: 'text',
    path_or_link: '',
    section: 'vans-operations',
  })
  const [subtaskInput, setSubtaskInput] = useState('')

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored data:', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Generate unique ID
  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Add new item
  const addItem = () => {
    const newItem: WorkItem = {
      id: generateId(),
      title: formData.title || 'Untitled',
      type: formData.type as WorkItem['type'] || 'task',
      summary: formData.summary || '',
      status: formData.status as WorkItem['status'] || 'open',
      subtasks: formData.subtasks || [],
      priority: formData.priority as WorkItem['priority'] || 'none',
      owner: formData.owner || 'Me',
      deadline: formData.deadline || '',
      source: formData.source as WorkItem['source'] || 'text',
      path_or_link: formData.path_or_link || '',
      section: formData.section as Section || activeSection,
      createdAt: new Date().toISOString(),
    }
    setItems([...items, newItem])
    resetForm()
    setIsAddDialogOpen(false)
  }

  // Update item
  const updateItem = () => {
    if (!editingItem) return
    setItems(items.map(item => 
      item.id === editingItem.id 
        ? { ...item, ...formData, id: item.id, createdAt: item.createdAt }
        : item
    ))
    resetForm()
    setEditingItem(null)
    setIsEditDialogOpen(false)
  }

  // Delete item
  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      type: 'task',
      summary: '',
      status: 'open',
      subtasks: [],
      priority: 'medium',
      owner: 'Me',
      deadline: '',
      source: 'text',
      path_or_link: '',
      section: activeSection,
    })
    setSubtaskInput('')
  }

  // Start editing
  const startEditing = (item: WorkItem) => {
    setEditingItem(item)
    setFormData({ ...item })
    setIsEditDialogOpen(true)
  }

  // Add subtask
  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setFormData({
        ...formData,
        subtasks: [...(formData.subtasks || []), subtaskInput.trim()]
      })
      setSubtaskInput('')
    }
  }

  // Remove subtask
  const removeSubtask = (index: number) => {
    setFormData({
      ...formData,
      subtasks: (formData.subtasks || []).filter((_, i) => i !== index)
    })
  }

  // Process command
  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim()
    
    // /add command
    const addMatch = trimmed.match(/^\/add\s+(\w+[-\w]*):?\s*(.*)$/i)
    if (addMatch) {
      const sectionKey = addMatch[1].toLowerCase().replace(/\s+/g, '-')
      const content = addMatch[2]
      
      const section = SECTIONS.find(s => 
        s.id.includes(sectionKey) || s.label.toLowerCase().includes(sectionKey.replace(/-/g, ' '))
      )
      
      if (section) {
        const newItem: WorkItem = {
          id: generateId(),
          title: content || 'New Item',
          type: 'task',
          summary: '',
          status: 'open',
          subtasks: [],
          priority: 'medium',
          owner: 'Me',
          deadline: '',
          source: 'text',
          path_or_link: '',
          section: section.id,
          createdAt: new Date().toISOString(),
        }
        setItems(prev => [...prev, newItem])
        setCommandOutput(`Added "${content}" to ${section.label}`)
        return
      }
    }

    // /fetch command
    const fetchMatch = trimmed.match(/^\/fetch\s+(\w+[-\w]*)$/i)
    if (fetchMatch) {
      const sectionKey = fetchMatch[1].toLowerCase().replace(/\s+/g, '-')
      const section = SECTIONS.find(s => 
        s.id.includes(sectionKey) || s.label.toLowerCase().includes(sectionKey.replace(/-/g, ' '))
      )
      
      if (section) {
        const sectionItems = items.filter(item => item.section === section.id)
        setActiveSection(section.id)
        setCommandOutput(`Found ${sectionItems.length} items in ${section.label}`)
        return
      }
    }

    // /store command
    const storeMatch = trimmed.match(/^\/store\s+(\w+[-\w]*):?\s*(.*)$/i)
    if (storeMatch) {
      const sectionKey = storeMatch[1].toLowerCase().replace(/\s+/g, '-')
      const path = storeMatch[2]
      
      const section = SECTIONS.find(s => 
        s.id.includes(sectionKey) || s.label.toLowerCase().includes(sectionKey.replace(/-/g, ' '))
      )
      
      if (section && path) {
        const newItem: WorkItem = {
          id: generateId(),
          title: path.split('/').pop() || path,
          type: 'document',
          summary: `Stored document: ${path}`,
          status: 'open',
          subtasks: [],
          priority: 'none',
          owner: 'Me',
          deadline: '',
          source: 'file-path',
          path_or_link: path,
          section: section.id,
          createdAt: new Date().toISOString(),
        }
        setItems(prev => [...prev, newItem])
        setCommandOutput(`Stored document "${path}" in ${section.label}`)
        return
      }
    }

    // /clear command
    if (trimmed === '/clear') {
      setCommandOutput('')
      return
    }

    // /help command
    if (trimmed === '/help') {
      setCommandOutput(`Available commands:
/add <section>: <content> - Add item to section
/fetch <section> - View section items
/store <section>: <path> - Store document
/clear - Clear command output
/help - Show this help`)
      return
    }

    setCommandOutput(`Unknown command. Type /help for available commands.`)
  }, [items])

  // Handle command submit
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (commandInput.trim()) {
      processCommand(commandInput)
      setCommandInput('')
    }
  }

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSection = item.section === activeSection
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSection && matchesSearch
  })

  // Get section stats
  const getSectionStats = (sectionId: Section) => {
    const sectionItems = items.filter(item => item.section === sectionId)
    return {
      total: sectionItems.length,
      open: sectionItems.filter(item => item.status === 'open').length,
      inProgress: sectionItems.filter(item => item.status === 'in-progress').length,
      completed: sectionItems.filter(item => item.status === 'completed').length,
    }
  }

  // Form fields component
  const FormFields = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter title..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Section</label>
          <Select
            value={formData.section}
            onValueChange={(value) => setFormData({ ...formData, section: value as Section })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTIONS.map(section => (
                <SelectItem key={section.id} value={section.id}>
                  <div className="flex items-center gap-2">
                    {section.icon}
                    {section.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as WorkItem['type'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEM_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as WorkItem['status'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select
            value={formData.priority || 'none'}
            onValueChange={(value) => setFormData({ ...formData, priority: value as WorkItem['priority'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Summary</label>
        <Textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="Enter summary or description..."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Owner</label>
          <Input
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            placeholder="Owner name..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Deadline</label>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source Type</label>
          <Select
            value={formData.source}
            onValueChange={(value) => setFormData({ ...formData, source: value as WorkItem['source'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="link">Link</SelectItem>
              <SelectItem value="file-path">File Path</SelectItem>
              <SelectItem value="endpoint">Endpoint</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Path / Link</label>
          <Input
            value={formData.path_or_link}
            onChange={(e) => setFormData({ ...formData, path_or_link: e.target.value })}
            placeholder="URL or file path..."
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Subtasks</label>
        <div className="flex gap-2">
          <Input
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            placeholder="Add subtask..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
          />
          <Button type="button" variant="outline" onClick={addSubtask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.subtasks && formData.subtasks.length > 0 && (
          <div className="mt-2 space-y-1">
            {formData.subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
                <span className="flex-1 text-sm">{subtask}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubtask(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Work Management Dashboard</h1>
                <p className="text-sm text-gray-500">Day-to-Day Work Management Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setFormData(prev => ({ ...prev, section: activeSection })); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                      Add a new task, document, link, or note to your workboard.
                    </DialogDescription>
                  </DialogHeader>
                  <FormFields />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addItem}>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the item details.
            </DialogDescription>
          </DialogHeader>
          <FormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingItem(null); }}>
              Cancel
            </Button>
            <Button onClick={updateItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Command Input */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Enter command (e.g., /add vans: Issue with delivery 45, /fetch ai-learning, /help)"
                  className="pl-10 font-mono"
                />
              </div>
              <Button type="submit">Execute</Button>
            </form>
            {commandOutput && (
              <div className="mt-3 p-3 bg-gray-900 text-green-400 rounded-md font-mono text-sm whitespace-pre-wrap">
                {commandOutput}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section Navigation */}
        <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as Section)} className="mb-6">
          <TabsList className="grid grid-cols-5 w-full">
            {SECTIONS.map(section => {
              const stats = getSectionStats(section.id)
              return (
                <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                  {section.icon}
                  <span className="hidden md:inline">{section.label}</span>
                  <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {SECTIONS.map(section => (
            <TabsContent key={section.id} value={section.id}>
              {/* Section Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {(() => {
                  const stats = getSectionStats(section.id)
                  return (
                    <>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Total Items</p>
                              <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div className={`p-3 rounded-full ${section.color} bg-opacity-20`}>
                              {section.icon}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Open</p>
                              <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-yellow-500" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">In Progress</p>
                              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Completed</p>
                              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )
                })()}
              </div>

              {/* Quick Links */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Quick Links
                  </CardTitle>
                  <CardDescription>Quick access to your tools and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {QUICK_LINKS[section.id].map(link => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className={`p-3 rounded-full ${link.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                          {link.icon}
                        </div>
                        <span className="font-medium text-gray-900 text-center text-sm">{link.title}</span>
                        <span className="text-xs text-gray-500 text-center mt-1">{link.description}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Items List */}
              <ScrollArea className="h-[calc(100vh-650px)]">
                {filteredItems.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className={`p-4 rounded-full ${section.color} bg-opacity-20`}>
                          {section.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">No items yet</h3>
                          <p className="text-gray-500">Add your first item to {section.label}</p>
                        </div>
                        <Button onClick={() => { resetForm(); setFormData(prev => ({ ...prev, section: section.id })); setIsAddDialogOpen(true); }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map(item => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${STATUS_CONFIG[item.status].color} bg-opacity-20`}>
                                {ITEM_TYPES.find(t => t.value === item.type)?.icon || <StickyNote className="h-4 w-4" />}
                              </div>
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {item.title}
                                  {item.path_or_link && item.source === 'link' && (
                                    <a href={item.path_or_link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                                    </a>
                                  )}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {ITEM_TYPES.find(t => t.value === item.type)?.label}
                                  </Badge>
                                  <Badge className={`${STATUS_CONFIG[item.status].color} text-white text-xs`}>
                                    {STATUS_CONFIG[item.status].label}
                                  </Badge>
                                  {item.priority && item.priority !== 'none' && (
                                    <Badge className={`${PRIORITY_CONFIG[item.priority].color} text-white text-xs`}>
                                      {PRIORITY_CONFIG[item.priority].label}
                                    </Badge>
                                  )}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => startEditing(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {item.summary && (
                            <p className="text-gray-600 text-sm mb-3">{item.summary}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {item.owner && (
                              <span>Owner: <strong>{item.owner}</strong></span>
                            )}
                            {item.deadline && (
                              <span>Deadline: <strong>{new Date(item.deadline).toLocaleDateString()}</strong></span>
                            )}
                            {item.path_or_link && item.source !== 'link' && (
                              <span>Path: <code className="bg-gray-100 px-1 rounded">{item.path_or_link}</code></span>
                            )}
                          </div>
                          {item.subtasks && item.subtasks.length > 0 && (
                            <div className="mt-3">
                              <Separator className="mb-3" />
                              <p className="text-sm font-medium mb-2">Subtasks ({item.subtasks.length})</p>
                              <div className="space-y-1">
                                {item.subtasks.map((subtask, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                    {subtask}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default App
