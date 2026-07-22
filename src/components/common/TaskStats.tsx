interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
}

export function TaskStats({ totalTasks, completedTasks }: TaskStatsProps) {
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const roundedPercentage = Math.round(completionPercentage);

  return (
    <div>
      <div className="flex w-96 items-center gap-4 rounded-xl border border-grays-200 bg-white/90 p-3 shadow-lg backdrop-blur-md">
        <div
          role="progressbar"
          aria-label="Task completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={roundedPercentage}
          className="h-4 flex-1 rounded-full bg-grays-200"
        >
          <div
            className="h-4 rounded-full bg-apptheme-green-flowchart shadow-sm transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-grays-700">
          <span>
            {completedTasks}/{totalTasks}
          </span>
          <span className="text-grays-500">({roundedPercentage}%)</span>
        </div>
      </div>
    </div>
  );
}
