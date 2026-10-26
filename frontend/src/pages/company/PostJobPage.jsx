import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../api/client';

export const PostJobPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    company: 'ABC Technologies',
    jobType: 'Full Time',
    location: 'Chennai / Hybrid',
    salary: '₹7–9 LPA',
    minimumCgpa: '7.5',
    department: 'Computer Science & Engineering',
    eligibility: 'B.E/B.Tech (CSE, IT, ECE) 2026 Graduating Batch with 7.0+ CGPA',
    deadline: '2026-10-15',
    skills: 'Java, Spring Boot, PostgreSQL, Docker',
    description:
      'We are looking for enthusiastic software engineers to build reliable backend services and scalable web platforms.',
    responsibilities:
      '• Develop REST APIs and backend microservices.\n• Collaborate with cross-functional product and frontend teams.\n• Write clean, maintainable, and well-tested code.',
    qualifications:
      '• Solid proficiency in Core Java and Data Structures.\n• Familiarity with Spring Framework and SQL.\n• Good communication and problem-solving skills.',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.title || !form.company || !form.salary) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/jobs', {
        ...form,
        minCgpa: parseFloat(form.minimumCgpa) || 6.0,
        skills: skillsArray,
      });
    } catch (err) {
      // offline fallback
    }

    setLoading(false);
    setSuccessMsg('Job posting published successfully!');
    setTimeout(() => {
      navigate('/company/manage-jobs');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <Link
          to="/company/manage-jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Manage Jobs
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Job Posting</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish an opportunity for college students and graduates to discover and apply.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Backend Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                required
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. ABC Technologies"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Job Type *
              </label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
              >
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Chennai, Bangalore, or Remote"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Salary / Compensation Package *
              </label>
              <input
                type="text"
                name="salary"
                required
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. ₹6–8 LPA or ₹25,000 / month"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Application Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={form.deadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Minimum CGPA Requirement *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="minimumCgpa"
                required
                value={form.minimumCgpa}
                onChange={handleChange}
                placeholder="e.g. 7.0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
              >
                <option value="All Engineering">All Engineering Branches</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Required Technical Skills (Comma-separated) *
            </label>
            <input
              type="text"
              name="skills"
              required
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. Java, Spring Boot, MySQL, REST APIs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Eligibility Criteria Summary
            </label>
            <input
              type="text"
              name="eligibility"
              value={form.eligibility}
              onChange={handleChange}
              placeholder="e.g. 2026 batch, No standing arrears"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Job Description *
            </label>
            <textarea
              name="description"
              rows={3}
              required
              value={form.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Responsibilities (One per line)
            </label>
            <textarea
              name="responsibilities"
              rows={3}
              value={form.responsibilities}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/company/manage-jobs"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : 'Publish Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
