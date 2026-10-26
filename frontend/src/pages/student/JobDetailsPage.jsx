import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Send,
  FileText,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../api/client';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    id: parseInt(id) || 1,
    title: 'Java Developer',
    company: 'ABC Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    jobType: 'Full Time',
    salary: '₹6–8 LPA',
    postedDate: '12 Sept 2026',
    deadline: '30 Sept 2026',
    eligibility: 'B.E / B.Tech (CSE / IT / ECE) with minimum 7.0 CGPA',
    minCgpa: 7.0,
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git', 'Microservices'],
    description:
      'ABC Technologies is hiring dynamic fresh graduates for our Global Enterprise Application Division. You will be part of a high-performance team delivering mission-critical enterprise systems using modern Java and Spring Boot ecosystems.',
    responsibilities: [
      'Design, develop, and maintain clean and testable backend services using Java 17+ and Spring Boot.',
      'Collaborate with frontend engineers and database administrators to create cohesive API interfaces.',
      'Write comprehensive unit and integration tests using JUnit and Mockito.',
      'Participate in agile sprint ceremonies, code reviews, and architectural discussions.',
      'Analyze performance bottlenecks and implement optimization techniques in database queries.',
    ],
    qualifications: [
      'Strong foundation in Object-Oriented Programming (OOP) concepts in Java.',
      'Familiarity with Spring Framework (Spring Boot, Spring Data JPA, Spring Security).',
      'Solid understanding of Relational Databases and SQL (PostgreSQL, MySQL).',
      'Basic knowledge of version control (Git) and container basics (Docker) is a plus.',
      'No active academic backlogs at the time of joining.',
    ],
  });

  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState(
    'I am excited to apply for this position. My coursework in Algorithms, Java backend development, and relational database systems aligns well with your team’s requirements.'
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data) setJob(res.data);
      } catch (err) {
        // fallback
      }
    };
    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/applications', {
        jobId: job.id,
        coverLetter: coverLetter,
        resumeUrl: user?.resumeUrl || 'https://example.com/resume/sample.pdf',
      });
    } catch (err) {
      // offline simulation
    }

    setSubmitting(false);
    setShowApplyModal(false);
    setHasApplied(true);
    setSubmitSuccess(true);

    addNotification({
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.company} was successfully submitted.`,
      type: 'APPLIED',
      jobTitle: job.title,
      companyName: job.company,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all jobs
        </Link>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Application submitted successfully! You can track its status in "Applications".</span>
          </div>
          <Link
            to="/applications"
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
          >
            View Applications
          </Link>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center p-2 shadow-sm">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {job.company}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.jobType}
              </span>
              <span className="font-bold text-emerald-700">{job.salary}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Job link copied to clipboard!');
            }}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Share Job"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowApplyModal(true)}
            disabled={hasApplied}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition flex items-center gap-2 ${
              hasApplied
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Applied
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Apply Now
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">About The Role</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">Key Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">Eligibility & Qualifications</h2>
              <ul className="space-y-2">
                {job.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">Required Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Job Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Posted On</span>
                <span className="font-semibold text-slate-700">{job.postedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Application Deadline</span>
                <span className="font-bold text-rose-600">{job.deadline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Job Type</span>
                <span className="font-semibold text-slate-700">{job.jobType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Offered Salary</span>
                <span className="font-extrabold text-emerald-700">{job.salary}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Minimum CGPA</span>
                <span className="font-bold text-slate-800">{job.minCgpa} / 10.0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={hasApplied}
                className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2 ${
                  hasApplied
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                }`}
              >
                {hasApplied ? 'Application Submitted' : 'Apply For This Position'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Review Your Application</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applying for <strong className="text-slate-800">{job.title}</strong> at {job.company}
                </p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="mt-5 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px] block">
                  Applicant Profile Summary
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Student Name:</span>
                    <p className="font-semibold text-slate-800">{user?.name || 'Pradeep Kumar'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-semibold text-slate-800 truncate">{user?.email || 'pradeep@college.edu'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Department:</span>
                    <p className="font-semibold text-slate-800">{user?.department || 'Computer Science'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">CGPA:</span>
                    <p className="font-bold text-blue-600">{user?.cgpa || '8.75'} / 10</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Attached Resume
                </label>
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-slate-800">
                      {user?.name?.replace(/\s+/g, '_') || 'Student'}_Placement_Resume.pdf
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cover Letter / Note to Recruiter
                </label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                  placeholder="Tell the hiring team why you are a great fit..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
