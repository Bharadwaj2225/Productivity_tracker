import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TimeTracker({ task, onStop, onUpdateTime }) {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTime, setSessionTime] = useState(0); // Time in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    // Automatically start the timer when the component mounts
    handleStart();

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000); // Update every second
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    // Convert session time from seconds to minutes for storage
    const sessionMinutes = Math.floor(sessionTime / 60);
    if (sessionMinutes > 0) {
      onUpdateTime(task.id, task.timeSpent + sessionMinutes);
    } else if (sessionTime > 0) { // If less than a minute, count as 1 minute
      onUpdateTime(task.id, task.timeSpent + 1);
    }
    setSessionTime(0);
    onStop();
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Convert stored minutes to seconds for display
  const totalTimeInSeconds = (task.timeSpent * 60) + sessionTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Time Tracker - {task.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-1">Current Session</p>
              <p className="text-3xl font-mono font-bold text-white">
                {formatTime(sessionTime)}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-1">Total Time</p>
              <p className="text-xl font-mono font-semibold text-purple-300">
                {formatTime(totalTimeInSeconds)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={handleStop}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
          
          {isRunning && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 text-center"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Timer Running
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}