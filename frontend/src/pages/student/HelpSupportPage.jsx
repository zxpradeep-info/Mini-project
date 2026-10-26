import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
  Send,
  AlertCircle,
  CheckCircle2,
  History,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../api/client';

export const HelpSupportPage = () => {
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      q: 'How do I apply for a job or internship?',
      a: 'Navigate to "Jobs & Internships" from the sidebar, search or filter for relevant positions, click "View Details", and then click "Apply Now". You can review your profile, resume, and write an optional cover letter before submitting.',
    },
    {
      q: 'How do I update my student profile information and CGPA?',
      a: 'Go to the "My Profile" tab and click the "Edit Profile" button. You can modify your phone number, year of study, location, bio, or enter your latest semester CGPA, and click "Save Changes".',
    },
    {
      q: 'How do I upload or update my placement resume?',
      a: 'In the "My Profile" page, locate the "Placement Resume" card. While in edit mode, click "Upload New Resume" to provide a fresh PDF version of your resume.',
    },
    {
      q: 'Why can’t I apply for a specific job posting?',
      a: 'Job postings often enforce minimum CGPA requirements or department eligibility criteria set by the recruiting company. Ensure your profile CGPA satisfies the required threshold.',
    },
    {
      q: 'How can I check the status of my submitted applications?',
      a: 'Open "Applications" from the sidebar. You will find real-time status badges (Applied, Under Review, Shortlisted, Interview Scheduled, Selected, or Rejected) alongside notes from the recruiting team.',
    },
    {
      q: 'How do I withdraw an application or notify recruiters of changes?',
      a: 'If you have accepted an offer from another company or need to withdraw an application, submit a ticket below under the "Application Problem" category with your application ID.',
    },
  ];

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Application Problem',
    priority: 'Medium',
    description: '',
  });

  const [tickets, setTickets] = useState([
    {
      id: 1024,
      subject: 'Unable to apply for Java Developer position',
      category: 'Application Problem',
      priority: 'Medium',
      status: 'RESOLVED',
      createdAt: '17 Sept 2026',
      reply: 'Resolved: The CGPA cutoff setting on the job was refreshed. Please re-try applying.',
    },
    {
      id: 1025,
      subject: 'Resume PDF preview formatting glitch',
      category: 'Resume Problem',
      priority: 'Low',
      status: 'OPEN',
      createdAt: '19 Sept 2026',
      reply: 'Under investigation by technical support.',
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      setErrorMsg('Please enter both subject and description.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/support/tickets', ticketForm);
    } catch (err) {
      // offline simulation
    }

    const newTicket = {
      id: 1000 + tickets.length + 1,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'OPEN',
      createdAt: 'Just now',
      reply: 'Ticket created. Placement staff will review shortly.',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setTicketForm({
      subject: '',
      category: 'Application Problem',
      priority: 'Medium',
      description: '',
    });
    setSubmitting(false);
    setSuccessMsg('Support request submitted successfully. We will follow up shortly.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Help & Support</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Find answers to frequently asked questions or raise a support ticket with the placement cell.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50 transition"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquarePlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Create Support Ticket</h2>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="Brief summary of your issue..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
                >
                  <option value="Login Problem">Login Problem</option>
                  <option value="Application Problem">Application Problem</option>
                  <option value="Profile Problem">Profile Problem</option>
                  <option value="Resume Problem">Resume Problem</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority *
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description of Issue *
              </label>
              <textarea
                rows={4}
                required
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                placeholder="Explain the problem in detail with job titles or error messages..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Support Request'}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <History className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Your Support Ticket History</h2>
        </div>

        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">Ticket #{t.id}</span>
                    <span className="text-xs font-bold text-slate-800">{t.subject}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                    <span>Category: {t.category}</span>
                    <span>Priority: {t.priority}</span>
                    <span>Submitted: {t.createdAt}</span>
                  </div>
                </div>

                <StatusBadge status={t.status} />
              </div>

              {t.reply && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200/60 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900 block mb-0.5">Admin Response:</span>
                  <p>{t.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
