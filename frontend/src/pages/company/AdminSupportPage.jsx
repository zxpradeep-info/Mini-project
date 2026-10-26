import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Send,
  User,
  AlertCircle,
  X,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../api/client';

export const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1024,
      studentName: 'Pradeep Kumar',
      email: 'pradeep@college.edu',
      subject: 'Unable to apply for Java Developer position',
      category: 'Application Problem',
      priority: 'Medium',
      status: 'RESOLVED',
      createdAt: '17 Sept 2026',
      description:
        'When I click Submit Application on ABC Technologies Java Developer, the form showed an eligibility check alert even though my CGPA is 8.75.',
      reply: 'Resolved: The CGPA cutoff setting on the job was refreshed. Please re-try applying.',
    },
    {
      id: 1025,
      studentName: 'Sneha Rao',
      email: 'sneha@college.edu',
      subject: 'Resume PDF preview formatting glitch',
      category: 'Resume Problem',
      priority: 'Low',
      status: 'OPEN',
      createdAt: '19 Sept 2026',
      description: 'The uploaded PDF thumbnail appears skewed in the modal preview.',
      reply: '',
    },
    {
      id: 1026,
      studentName: 'Rahul Mohan',
      email: 'rahul@college.edu',
      subject: 'Withdraw application request for Python Developer',
      category: 'Application Problem',
      priority: 'High',
      status: 'IN_PROGRESS',
      createdAt: '19 Sept 2026',
      description: 'I accepted an off-campus offer and would like to formally withdraw my application.',
      reply: 'Under review by placement director.',
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [feedback, setFeedback] = useState('');

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: newStatus,
          reply: replyText || t.reply,
        };
      }
      return t;
    });

    setTickets(updated);

    try {
      await api.put(`/support/tickets/${selectedTicket.id}/status`, {
        status: newStatus,
        reply: replyText,
      });
    } catch (err) {
      // offline fallback
    }

    setFeedback(`Ticket #${selectedTicket.id} updated to ${newStatus}`);
    setSelectedTicket(null);
    setReplyText('');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Requests & Help Tickets</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review, respond to, and resolve tickets submitted by students regarding applications and technical issues.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">All Support Tickets ({tickets.length})</h2>
          <span className="text-xs text-slate-400">Click a ticket to reply and change status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3 font-bold text-blue-600">#{t.id}</td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">{t.studentName}</p>
                    <p className="text-[11px] text-slate-400">{t.email}</p>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800 max-w-xs truncate">
                    {t.subject}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{t.category}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : t.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTicket(t);
                        setNewStatus(t.status);
                        setReplyText(t.reply || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                  Support Ticket #{selectedTicket.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-500">From: {selectedTicket.studentName} ({selectedTicket.email})</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">Student Description:</span>
              <p>{selectedTicket.description}</p>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change Ticket Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reply / Resolution Message to Student
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Explain resolution steps..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
                >
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage;
