import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Briefcase,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../api/client';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    skillsCount: 8,
    availableJobsCount: 24,
    applicationsCount: 5,
    shortlistedCount: 2,
  });

  const [recentApplications, setRecentApplications] = useState([
    {
      id: 101,
      jobTitle: 'Java Developer',
      company: 'ABC Technologies',
      location: 'Chennai',
      salary: '₹6–8 LPA',
      type: 'Full Time',
      appliedAt: '18 Sept 2026',
      status: 'SHORTLISTED',
    },
    {
      id: 102,
      jobTitle: 'Frontend Developer Intern',
      company: 'XYZ Technologies',
      location: 'Remote',
      salary: '₹25,000 / month',
      type: 'Internship',
      appliedAt: '17 Sept 2026',
      status: 'UNDER_REVIEW',
    },
    {
      id: 103,
      jobTitle: 'Python Developer',
      company: 'ABC Solutions',
      location: 'Bengaluru',
      salary: '₹7 LPA',
      type: 'Full Time',
      appliedAt: '15 Sept 2026',
      status: 'APPLIED',
    },
  ]);

  const [recommendedJobs, setRecommendedJobs] = useState([
    {
      id: 1,
      title: 'Full Stack Java Engineer',
      company: 'Infosys Limited',
      location: 'Bengaluru / Hybrid',
      type: 'Full Time',
      salary: '₹7.5–9.5 LPA',
      deadline: '28 Sept 2026',
      skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
      minCgpa: 7.5,
    },
    {
      id: 2,
      title: 'React & UI/UX Specialist',
      company: 'TCS Digital',
      location: 'Hyderabad',
      type: 'Full Time',
      salary: '₹8.2 LPA',
      deadline: '30 Sept 2026',
      skills: ['React', 'JavaScript', 'Tailwind CSS'],
      minCgpa: 8.0,
    },
    {
      id: 3,
      title: 'Backend Cloud Intern',
      company: 'Cognizant',
      location: 'Remote',
      type: 'Internship',
      salary: '₹30,000 / month',
      deadline: '05 Oct 2026',
      skills: ['Java', 'Docker', 'REST APIs'],
      minCgpa: 7.0,
    },
  ]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [jobsRes, appsRes, skillsRes] = await Promise.allSettled([
          api.get('/jobs'),
          api.get('/applications/my'),
          api.get('/students/skills'),
        ]);

        if (jobsRes.status === 'fulfilled' && jobsRes.value.data) {
          setStats((prev) => ({ ...prev, availableJobsCount: jobsRes.value.data.length }));
          if (jobsRes.value.data.length > 0) {
            setRecommendedJobs(jobsRes.value.data.slice(0, 3));
          }
        }
        if (appsRes.status === 'fulfilled' && appsRes.value.data) {
          const apps = appsRes.value.data;
          setStats((prev) => ({
            ...prev,
            applicationsCount: apps.length,
            shortlistedCount: apps.filter((a) => a.status === 'SHORTLISTED').length,
          }));
          if (apps.length > 0) {
            setRecentApplications(apps.slice(0, 3));
          }
        }
        if (skillsRes.status === 'fulfilled' && skillsRes.value.data) {
          setStats((prev) => ({ ...prev, skillsCount: skillsRes.value.data.length }));
        }
      } catch (err) {
        // use default state
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50/70 to-transparent pointer-events-none rounded-r-3xl" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Placement Season 2026 Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Pradeep'}
          </h1>
          <p className="text-sm text-slate-500 max-w-lg">
            "Find your next opportunity." Explore active hiring drives and track your status in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/jobs"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition inline-flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Browse Jobs
          </Link>
          <Link
            to="/profile"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition inline-flex items-center gap-2"
          >
            Update Profile
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Placement Overview</h2>
          <span className="text-xs text-slate-400 font-medium">Updated just now</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Skills Added"
            value={stats.skillsCount}
            icon={Wrench}
            color="blue"
            subtitle="Verified technical proficiencies"
          />
          <StatsCard
            title="Available Jobs"
            value={stats.availableJobsCount}
            icon={Briefcase}
            color="indigo"
            change="+4 new"
            subtitle="Matching hiring drives"
          />
          <StatsCard
            title="Applications"
            value={stats.applicationsCount}
            icon={FileCheck2}
            color="purple"
            subtitle="Submitted across companies"
          />
          <StatsCard
            title="Shortlisted"
            value={stats.shortlistedCount}
            icon={CheckCircle2}
            color="emerald"
            change="Active"
            subtitle="Interviews scheduled/pending"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recommended Opportunities</h2>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              View all ({stats.availableJobsCount}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition">
                        {job.title}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="text-emerald-700 font-semibold">{job.salary}</span>
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="self-start sm:self-center px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-semibold border border-blue-200/60 hover:border-transparent transition"
                  >
                    View Details
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 mr-1">Skills:</span>
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-medium rounded-md border border-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.minCgpa && (
                    <span className="ml-auto text-[11px] text-slate-400 font-medium">
                      Min CGPA: <strong className="text-slate-700">{job.minCgpa}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Application Status</h2>
            <Link
              to="/applications"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {app.jobTitle}
                    </h4>
                    <p className="text-xs text-slate-500">{app.company}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Applied: {app.appliedAt}</span>
                  <Link
                    to="/applications"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                to="/applications"
                className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition block text-center border border-slate-100"
              >
                Track All Applications
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl text-white shadow-md shadow-blue-500/15">
            <h3 className="font-bold text-sm">Need Placement Assistance?</h3>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              Facing issues with applications or need resume approval? Contact placement coordinators anytime.
            </p>
            <Link
              to="/support"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold text-white transition backdrop-blur-sm"
            >
              Open Help & Support <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
