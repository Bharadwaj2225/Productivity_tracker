
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, LogOut, Clock, BarChart3, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import TimeTracker from '@/components/TimeTracker';
import Analytics from '@/components/Analytics';
import ExportModal from '@/components/ExportModal';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem(`tasks_${user.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [user.id]);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      description: '',
      category: 'work',
      priority: 'medium',
      status: 'todo',
      timeSpent: 0,
      createdAt: new Date().toISOString(),
      dueDate: null
    };
    
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    
    toast({
      title: "Task created!",
      description: "New task added to your list.",
    });
  };

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
    
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(null);
    }
    
    toast({
      title: "Task deleted",
      description: "Task removed from your list.",
    });
  };

  const startTimer = (task) => {
    setActiveTask(task);
    toast({
      title: "Timer started",
      description: `Started tracking time for "${task.title}"`,
    });
  };

  const stopTimer = () => {
    if (activeTask) {
      toast({
        title: "Timer stopped",
        description: `Stopped tracking time for "${activeTask.title}"`,
      });
    }
    setActiveTask(null);
  };

  const updateTimeSpent = (taskId, timeSpent) => {
    updateTask(taskId, { timeSpent });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    totalTime: tasks.reduce((acc, task) => acc + task.timeSpent, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TaskFlow Pro</h1>
                <p className="text-sm text-gray-300">Welcome back, {user.name}!</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowExportModal(true)}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Tasks', value: stats.total, color: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: stats.completed, color: 'from-green-500 to-emerald-500' },
            { label: 'In Progress', value: stats.inProgress, color: 'from-yellow-500 to-orange-500' },
            { label: 'Time Tracked', value: `${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m`, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${stat.color} p-6 rounded-xl text-white`}
            >
              <h3 className="text-sm font-medium opacity-90">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Time Tracker */}
        {activeTask && (
          <TimeTracker
            task={activeTask}
            onStop={stopTimer}
            onUpdateTime={updateTimeSpent}
          />
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white/20">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Task Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Tasks</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onStartTimer={startTimer}
                    isActive={activeTask && activeTask.id === task.id}
                  />
                </motion.div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                <p className="text-gray-400">
                  {filter === 'all' ? 'Create your first task to get started!' : `No ${filter} tasks found.`}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics tasks={tasks} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          tasks={tasks}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
