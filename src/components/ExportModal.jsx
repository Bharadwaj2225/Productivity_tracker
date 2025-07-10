import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportModal({ tasks, onClose }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportType, setExportType] = useState('all');
  const { toast } = useToast();

  const handleExport = () => {
    let filteredTasks = tasks;
    
    if (exportType === 'completed') {
      filteredTasks = tasks.filter(task => task.status === 'completed');
    } else if (exportType === 'pending') {
      filteredTasks = tasks.filter(task => task.status !== 'completed');
    }

    if (filteredTasks.length === 0) {
      toast({
        title: "No tasks to export",
        description: "There are no tasks matching your filter criteria.",
        variant: "destructive",
      });
      return;
    }

    if (exportFormat === 'csv') {
      exportToCSV(filteredTasks);
    } else {
      exportToPDF(filteredTasks);
    }
  };

  const exportToCSV = (data) => {
    const headers = ['Title', 'Description', 'Category', 'Priority', 'Status', 'Time Spent (minutes)', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...data.map(task => [
        `"${task.title}"`,
        `"${task.description || ''}"`,
        task.category,
        task.priority,
        task.status,
        task.timeSpent,
        new Date(task.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful!",
      description: "Your tasks have been exported to CSV.",
    });
    onClose();
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();
    const totalTime = data.reduce((acc, task) => acc + task.timeSpent, 0);

    // Title
    doc.setFontSize(20);
    doc.text("TaskFlow Pro - Task Report", 14, 22);

    // Sub-header
    doc.setFontSize(12);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Summary
    doc.setFontSize(10);
    doc.text(`Total Tasks: ${data.length}`, 14, 40);
    doc.text(`Total Time Tracked: ${formatTime(totalTime)}`, 14, 45);

    // Table
    const tableColumn = ["Title", "Category", "Priority", "Status", "Time Spent"];
    const tableRows = [];

    data.forEach(task => {
      const taskData = [
        task.title,
        task.category,
        task.priority,
        task.status,
        formatTime(task.timeSpent),
      ];
      tableRows.push(taskData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [148, 106, 222] }, // Purple color
    });

    doc.save(`taskflow-export-${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "Export successful!",
      description: "Your tasks have been exported to PDF.",
    });
    onClose();
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getFilteredCount = () => {
    if (exportType === 'completed') {
      return tasks.filter(task => task.status === 'completed').length;
    } else if (exportType === 'pending') {
      return tasks.filter(task => task.status !== 'completed').length;
    }
    return tasks.length;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Export Tasks
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Export Type */}
            <div>
              <h4 className="text-white font-medium mb-3">What to export</h4>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Tasks', count: tasks.length },
                  { value: 'completed', label: 'Completed Tasks', count: tasks.filter(t => t.status === 'completed').length },
                  { value: 'pending', label: 'Pending Tasks', count: tasks.filter(t => t.status !== 'completed').length }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="exportType"
                      value={option.value}
                      checked={exportType === option.value}
                      onChange={(e) => setExportType(e.target.value)}
                      className="text-purple-500"
                    />
                    <span className="text-white">{option.label}</span>
                    <span className="text-gray-400 text-sm">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div>
              <h4 className="text-white font-medium mb-3">Export format</h4>
              <div className="space-y-2">
                {[
                  { value: 'csv', label: 'CSV File', icon: Table, description: 'Spreadsheet compatible' },
                  { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Formatted document' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="exportFormat"
                      value={option.value}
                      checked={exportFormat === option.value}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-purple-500"
                    />
                    <option.icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-white">{option.label}</div>
                      <div className="text-gray-400 text-sm">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Export Summary</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Tasks to export: <span className="text-white font-semibold">{getFilteredCount()}</span></p>
                <p>Format: <span className="text-white font-semibold">{exportFormat.toUpperCase()}</span></p>
                <p>Total time tracked: <span className="text-white font-semibold">
                  {formatTime(tasks.reduce((acc, task) => acc + task.timeSpent, 0))}
                </span></p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                onClick={handleExport}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}