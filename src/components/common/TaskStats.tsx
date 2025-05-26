import React from 'react';

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
}

const TaskStats: React.FC<TaskStatsProps> = ({ totalTasks, completedTasks }) => {
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <div className="
        flex items-center gap-4 p-3 
        bg-white/90
        backdrop-blur-md 
        rounded-xl 
        border border-grays-200
        shadow-lg
        w-96
      ">
        {/* Large Progress Bar - Takes up most of the space */}
        <div className="flex-1">
          <div className="w-full bg-grays-200 rounded-full h-4">
            <div 
              className="bg-apptheme-green-flowchart h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Compact Stats */}
        <div className="flex items-center gap-2 text-sm font-medium text-grays-700 whitespace-nowrap">
          <span>{completedTasks}/{totalTasks}</span>
          <span className="text-grays-500">({Math.round(completionPercentage)}%)</span>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;