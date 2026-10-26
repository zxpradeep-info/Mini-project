import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Users,
  Trash2,
  Edit,
} from 'lucide-react';

export const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Java Developer',
      location: 'Chennai',
      jobType: 'Full Time',
      salary: '₹6–8 LPA',
      deadline: '30 Sept 2026',
      applicantCount: 24,
      status: 'ACTIVE',
    },
    {
      id: 2,
      title: 'Frontend Developer Intern',
      location: 'Remote',
      jobType: 'Internship',
      salary: '₹25,000 / month',
      deadline: '28 Sept 2026',
      applicantCount: 18,
      status: 'ACTIVE',
    },
    {
      id: 3,
      title: 'Python Developer',
      location: 'Bengaluru',
      jobType: 'Full Time',
      salary: '₹7–9 LPA',
      deadline: '02 Oct 2026',
      applicantCount: 12,
      status: 'ACTIVE',
    },
  ]);

  const [search, setSearch] = useState('');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this job posting?')) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  };

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Job Postings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review active listings, track candidate submissions, and edit details.
          </p>
        </div>

        <Link
          to="/company/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition"
        >
          <PlusCircle className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4 pb-2">
          <input
            type="text"
            placeholder="Search job title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filtered.length} listings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Salary</th>
                <th className="py-3 px-3">Applicants</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{j.title}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {j.jobType}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{j.location}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-700">{j.salary}</td>
                  <td className="py-3.5 px-3">
                    <Link
                      to="/company/applicants"
                      className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" /> {j.applicantCount} candidates
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{j.deadline}</td>
                  <td className="py-3.5 px-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => alert(`Edit mode for ${j.title}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(j.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default ManageJobsPage;
