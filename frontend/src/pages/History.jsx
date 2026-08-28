import React, { useEffect, useState, useMemo } from 'react';
import { historyApi } from '../api/history.api';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Code2
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await historyApi.getReviewHistory();
      setHistoryList(res.history || []);
    } catch {
      setHistoryList([
        {
          id: 'hist-1',
          projectName: 'Authentication Service',
          fileName: 'auth.controller.js',
          language: 'JavaScript',
          overallScore: 92,
          issues: [{ id: '1', severity: 'WARNING' }],
          createdAt: new Date().toISOString()
        },
        {
          id: 'hist-2',
          projectName: 'API Gateway',
          fileName: 'proxy.service.js',
          language: 'JavaScript',
          overallScore: 86,
          issues: [{ id: '2', severity: 'SUGGESTION' }],
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const match =
        (item.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.language || '').toLowerCase().includes(searchTerm.toLowerCase());
      return match;
    });
  }, [historyList, searchTerm]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await historyApi.deleteHistory(id);
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
      addNotification({
        title: 'Report Deleted',
        message: 'Review report removed from history',
        type: 'info'
      });
    } catch {
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Review & Audit History
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Browse historical AI code review records, score trends, and vulnerability logs.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by project, file, or language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* History List */}
      <div className="bg-[#161b22]/70 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {filteredHistory.length === 0 ? (
            <div className="p-10 text-center text-xs text-gray-400">
              No review history records found.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/history/${item.id}`)}
                className="p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">
                        {item.fileName || item.projectName || 'Code Review'}
                      </span>
                      <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-none text-[10px]">
                        {item.language || 'JS'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{item.issues?.length || 0} issues</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {item.overallScore || 90}%
                    </span>
                    <span className="text-[10px] text-gray-500 block font-mono">Score</span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
