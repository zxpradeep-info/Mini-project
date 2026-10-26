import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Award,
  PlusCircle,
  ArrowRight,
  Building2,
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../api/client';

export const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 6,
    totalApplicants: 42,
    shortlisted: 14,
    interviews: 8,
    selected: 3,
  });

  const [recentApplicants, setRecentApplicants] = useState([
    {
      id: 1,
      studentName: 'Pradeep Kumar',
      email: 'pradeep@college.edu',
      jobTitle: 'Java Developer',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      cgpa: 8.75,
      status: 'SHORTLISTED',
      appliedAt: '18 Sept 2026',
    },
    {
      id: 2,
      studentName: 'Arun V.',
      email: 'arun@college.edu',
      jobTitle: 'Java Developer',
      skills: ['Java', 'Spring Boot', 'Hibernate'],
      cgpa: 8.5,
      status: 'INTERVIEW_SCHEDULED',
      appliedAt: '18 Sept 2026',
    },
    {
      id: 3,
      studentName: 'Sneha Rao',
      email: 'sneha@college.edu',
      jobTitle: 'Frontend Developer Intern',
      skills: ['React', 'JavaScript', 'Tailwind'],
      cgpa: 8.9,
      status: 'SHORTLISTED',
      appliedAt: '17 Sept 2026',
    },
    {
      id: 4,
      studentName: 'Rahul M.',
      email: 'rahul@college.edu',
      jobTitle: 'Java Developer',
      skills: ['Java', 'SQL'],
      cgpa: 7.8,
      status: 'UNDER_REVIEW',
      appliedAt: '17 Sept 2026',
    },
  ]);

  useEffect(() => {
    const loadCompanyStats = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.data) {
          setStats((prev) => ({ ...prev, activeJobs: res.data.length }));
        }
      } catch (e) {
        // fallback
      }
    };
    loadCompanyStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" /> Recruiter & Placement Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Company Placement Dashboard
          </h1>
          <p className="text-sm text-slate-500 max-w-lg">
            Manage hiring drives, evaluate candidate resumes, shortlist students, and update application milestones.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/company/post-job"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Post New Job
          </Link>
          <Link
            to="/company/applicants"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition inline-flex items-center gap-2"
          >
            Manage Applicants
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Hiring Funnel Analytics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={Briefcase}
            color="blue"
            subtitle="Published listings"
          />
          <StatsCard
            title="Total Applicants"
            value={stats.totalApplicants}
            icon={Users}
            color="indigo"
            change="+12 this wk"
            subtitle="Student profiles"
          />
          <StatsCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={CheckCircle2}
            color="purple"
            subtitle="Cleared screening"
          />
          <StatsCard
            title="Interviews"
            value={stats.interviews}
            icon={Calendar}
            color="amber"
            subtitle="Scheduled rounds"
          />
          <StatsCard
            title="Selected"
            value={stats.selected}
            icon={Award}
            color="emerald"
            change="Offer Made"
            subtitle="Offers extended"
          />
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Candidate Submissions</h2>
            <p className="text-xs text-slate-400">Incoming applications awaiting review</p>
          </div>
          <Link
            to="/company/applicants"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            Review all applicants <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Applied Job</th>
                <th className="py-3 px-3">CGPA</th>
                <th className="py-3 px-3">Key Skills</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">{applicant.studentName}</p>
                    <p className="text-[11px] text-slate-400">{applicant.email}</p>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700">{applicant.jobTitle}</td>
                  <td className="py-3.5 px-3 font-bold text-blue-600">{applicant.cgpa}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {applicant.skills.map((s, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={applicant.status} />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      to="/company/applicants"
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
