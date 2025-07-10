
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Clock, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analytics({ tasks }) {
  const analytics = useMemo(() => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklyTasks = tasks.filter(task => new Date(task.createdAt) >= thisWeek);
    const monthlyTasks = tasks.filter(task => new Date(task.createdAt) >= thisMonth);

    const categoryStats = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    const priorityStats = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    const statusStats = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const totalTimeSpent = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
    const avgTimePerTask = tasks.length > 0 ? totalTimeSpent / tasks.length : 0;

    const completionRate = tasks.length > 0 ? (statusStats.completed || 0) / tasks.length * 100 : 0;

    return {
      weeklyTasks: weeklyTasks.length,
      monthlyTasks: monthlyTasks.length,
      categoryStats,
      priorityStats,
      statusStats,
      totalTimeSpent,
      avgTimePerTask,
      completionRate
    };
  }, [tasks]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, data, type = 'bar' }) => (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value], index) => {
            const percentage = Math.max((value / Math.max(...Object.values(data))) * 100, 5);
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 capitalize">{key.replace('-', ' ')}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate.toFixed(1)}%`}
          icon={Target}
          color="text-green-400"
          description="Tasks completed"
        />
        <StatCard
          title="Total Time"
          value={formatTime(analytics.totalTimeSpent)}
          icon={Clock}
          color="text-blue-400"
          description="Time tracked"
        />
        <StatCard
          title="This Week"
          value={analytics.weeklyTasks}
          icon={Calendar}
          color="text-purple-400"
          description="Tasks created"
        />
        <StatCard
          title="Avg Time/Task"
          value={formatTime(analytics.avgTimePerTask)}
          icon={TrendingUp}
          color="text-yellow-400"
          description="Average duration"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Tasks by Status" data={analytics.statusStats} />
        <ChartCard title="Tasks by Category" data={analytics.categoryStats} />
        <ChartCard title="Tasks by Priority" data={analytics.priorityStats} />
      </div>

      {/* Productivity Insights */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Productivity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Performance Summary</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  📊 You have completed <span className="text-green-400 font-semibold">{analytics.statusStats.completed || 0}</span> out of <span className="text-white font-semibold">{tasks.length}</span> tasks
                </p>
                <p className="text-gray-300">
                  ⏱️ Total time tracked: <span className="text-blue-400 font-semibold">{formatTime(analytics.totalTimeSpent)}</span>
                </p>
                <p className="text-gray-300">
                  📈 This week you created <span className="text-purple-400 font-semibold">{analytics.weeklyTasks}</span> new tasks
                </p>
                <p className="text-gray-300">
                  🎯 Your completion rate is <span className="text-green-400 font-semibold">{analytics.completionRate.toFixed(1)}%</span>
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Recommendations</h4>
              <div className="space-y-2 text-sm text-gray-300">
                {analytics.completionRate < 50 && (
                  <p>💡 Try breaking down large tasks into smaller, manageable chunks</p>
                )}
                {analytics.avgTimePerTask > 120 && (
                  <p>⚡ Consider setting time limits to improve focus and efficiency</p>
                )}
                {analytics.priorityStats.high > analytics.priorityStats.low && (
                  <p>🎯 Balance your workload with more low-priority tasks for variety</p>
                )}
                {analytics.weeklyTasks === 0 && (
                  <p>📝 Stay consistent by creating at least one task per week</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
