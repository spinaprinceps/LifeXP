function TodoStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <div className="bg-white border-2 border-primary rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-primary-dark font-mono">
          {stats.total || 0}
        </div>
        <div className="text-xs text-gray-600 font-mono mt-1 font-bold">TOTAL TASKS</div>
      </div>

      <div className="bg-white border-2 border-blue-400 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-blue-600 font-mono">
          {stats.pending || 0}
        </div>
        <div className="text-xs text-gray-600 font-mono mt-1 font-bold">PENDING</div>
      </div>

      <div className="bg-white border-2 border-green-400 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-green-600 font-mono">
          {stats.completed || 0}
        </div>
        <div className="text-xs text-gray-600 font-mono mt-1 font-bold">COMPLETED</div>
      </div>

      <div className="bg-white border-2 border-red-400 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-red-600 font-mono">
          {stats.overdue || 0}
        </div>
        <div className="text-xs text-gray-600 font-mono mt-1 font-bold">OVERDUE</div>
      </div>
    </div>
  );
}

export default TodoStats;
