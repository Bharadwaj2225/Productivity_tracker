
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Play, Pause, Clock, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function TaskCard({ task, onUpdate, onDelete, onStartTimer, isActive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    category: task.category,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate
  });
  const { toast } = useToast();

  const handleSave = () => {
    onUpdate(task.id, editData);
    setIsEditing(false);
    toast({
      title: "Task updated",
      description: "Your changes have been saved.",
    });
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    });
    setIsEditing(false);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'todo': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className={`${isActive ? 'ring-2 ring-purple-500' : ''}`}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white text-lg font-semibold"
                />
              ) : (
                <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
              )}
              
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </span>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)}`}></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-400 hover:bg-white/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <Label className="text-white text-sm">Description</Label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-md text-white text-sm resize-none"
                  rows="3"
                  placeholder="Task description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white text-sm">Category</Label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="study">Study</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-white text-sm">Priority</Label>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label className="text-white text-sm">Status</Label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {task.description && (
                <p className="text-gray-300 text-sm">{task.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(task.timeSpent)}</span>
                  </div>
                  
                  {task.dueDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Flag className="w-4 h-4" />
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>
              
              <Button
                onClick={() => onStartTimer(task)}
                disabled={isActive || task.status === 'completed'}
                className={`w-full ${
                  isActive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Timer Active
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Timer
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
