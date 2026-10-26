import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  MapPin,
  ChevronRight,
  Search,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../api/client';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([
    {
      id: 101,
      jobId: 1,
      jobTitle: 'Java Developer',
      company: 'ABC Technologies',
      location: 'Chennai, Tamil Nadu',
      appliedAt: '18 Sept 2026',
      updatedAt: '19 Sept 2026',
      salary: '₹6–8 LPA',
      jobType: 'Full Time',
      status: 'SHORTLISTED',
      note: 'Selected for technical interview round scheduled for next week.',
    },
    {
      id: 102,
      jobId: 2,
      jobTitle: 'Frontend Developer Intern',
      company: 'XYZ Technologies',
      location: 'Remote',
      appliedAt: '17 Sept 2026',
      updatedAt: '18 Sept 2026',
      salary: '₹25,000 / month',
      jobType: 'Internship',
      status: 'UNDER_REVIEW',
      note: 'Profile forwarded to the engineering manager for evaluation.',
    },
    {
      id: 103,
      jobId: 3,
      jobTitle: 'Python Developer',
      company: 'ABC Solutions',
      location: 'Bengaluru',
      appliedAt: '15 Sept 2026',
      updatedAt: '16 Sept 2026',
      salary: '₹7 LPA',
      jobType: 'Full Time',
      status: 'REJECTED',
      note: 'Thank you for applying. Currently seeking candidates with 1+ years experience.',
    },
    {
      id: 104,
      jobId: 4,
      jobTitle: 'Cloud & DevOps Intern',
      company: 'CloudScale Systems',
      location: 'Hyderabad',
      appliedAt: '16 Sept 2026',
      updatedAt: '16 Sept 2026',
      salary: '₹30,000 / month',
      jobType: 'Internship',
      status: 'APPLIED',
      note: 'Application received and queued for initial screening.',
    },
    {
      id: 105,
      jobId: 5,
      jobTitle: 'Associate Software Engineer',
      company: 'Global Infotech',
      location: 'Pune',
      appliedAt: '10 Sept 2026',
      updatedAt: '18 Sept 2026',
      salary: '₹5.5–6.5 LPA',
      jobType: 'Full Time',
      status: 'INTERVIEW_SCHEDULED',
      note: 'Round 1 technical discussion scheduled on 24th Sept 2026 via Microsoft Teams.',
    },
  ]);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my');
        if (res.data && res.data.length > 0) {
          setApplications(res.data);
        }
      } catch (err) {
        // fallback
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesFilter =
      statusFilter === 'ALL' ||
      app.status.toUpperCase().replace(/\s+/g, '_') === statusFilter;
    const matchesSearch =
      !searchQuery ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track and monitor the status of your submitted job and internship applications.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Applications: <strong className="text-slate-900">{applications.length}</strong>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or title..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Applied', value: 'APPLIED' },
            { label: 'Under Review', value: 'UNDER_REVIEW' },
            { label: 'Shortlisted', value: 'SHORTLISTED' },
            { label: 'Interviews', value: 'INTERVIEW_SCHEDULED' },
            { label: 'Rejected', value: 'REJECTED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No applications match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing a different status filter or browse new openings.
          </p>
          <Link
            to="/jobs"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition">
                      {app.jobTitle}
                    </h3>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700">{app.company}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.location}
                    </span>
                    <span className="text-emerald-700 font-semibold">{app.salary}</span>
                    <span>Applied: {app.appliedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition"
                    title="View Job Details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {app.note && (
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/80 text-xs text-slate-600 flex items-start gap-2">
                  <span className="font-bold text-slate-800 shrink-0">Recruiter Update:</span>
                  <p className="leading-relaxed">{app.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
