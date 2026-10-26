import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../api/client';

export const ApplicantsPage = () => {
  const { addNotification } = useNotifications();

  const [applicants, setApplicants] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: 'Pradeep Kumar',
      email: 'pradeep.kumar@college.edu',
      phone: '+91 98765 43210',
      college: 'College of Engineering & Technology',
      department: 'Computer Science & Engineering',
      jobTitle: 'Java Developer',
      company: 'ABC Technologies',
      skills: ['Java', 'Spring Boot', 'MySQL', 'React.js'],
      cgpa: 8.75,
      status: 'SHORTLISTED',
      resumeUrl: 'https://example.com/resume/pradeep.pdf',
      coverLetter:
        'I am excited to apply for the Java Developer position. I have strong foundational experience in Spring Boot REST APIs and relational database query optimization.',
      appliedAt: '18 Sept 2026',
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Arun Venkatesh',
      email: 'arun.v@college.edu',
      phone: '+91 98123 45678',
      college: 'College of Engineering & Technology',
      department: 'Computer Science & Engineering',
      jobTitle: 'Java Developer',
      company: 'ABC Technologies',
      skills: ['Java', 'Spring', 'Hibernate'],
      cgpa: 8.5,
      status: 'INTERVIEW_SCHEDULED',
      resumeUrl: 'https://example.com/resume/arun.pdf',
      coverLetter:
        'Passionate about Java Enterprise architecture. Developed 3 full stack projects with Spring Data JPA and MySQL.',
      appliedAt: '18 Sept 2026',
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'Rahul Mohan',
      email: 'rahul.m@college.edu',
      phone: '+91 97234 56789',
      college: 'Institute of Technology',
      department: 'Information Technology',
      jobTitle: 'Java Developer',
      company: 'ABC Technologies',
      skills: ['Java', 'SQL'],
      cgpa: 7.8,
      status: 'UNDER_REVIEW',
      resumeUrl: 'https://example.com/resume/rahul.pdf',
      coverLetter: 'Seeking an entry-level software engineering role to apply my core Java knowledge.',
      appliedAt: '17 Sept 2026',
    },
    {
      id: 4,
      studentId: 4,
      studentName: 'Sneha Rao',
      email: 'sneha.rao@college.edu',
      phone: '+91 98345 67890',
      college: 'College of Engineering & Technology',
      department: 'Computer Science & Engineering',
      jobTitle: 'Frontend Developer Intern',
      company: 'XYZ Technologies',
      skills: ['React', 'JavaScript', 'HTML5', 'Tailwind CSS'],
      cgpa: 8.9,
      status: 'APPLIED',
      resumeUrl: 'https://example.com/resume/sneha.pdf',
      coverLetter: 'Eager to build modern, responsive interfaces in React. Experienced with Tailwind CSS.',
      appliedAt: '17 Sept 2026',
    },
    {
      id: 5,
      studentId: 5,
      studentName: 'Vikas Sharma',
      email: 'vikas.s@college.edu',
      phone: '+91 99456 78901',
      college: 'National Engineering College',
      department: 'Electronics & Communication',
      jobTitle: 'Python Developer',
      company: 'ABC Solutions',
      skills: ['Python', 'Django', 'PostgreSQL'],
      cgpa: 8.1,
      status: 'APPLIED',
      resumeUrl: 'https://example.com/resume/vikas.pdf',
      coverLetter: 'Interested in backend development with Python and relational data modeling.',
      appliedAt: '16 Sept 2026',
    },
  ]);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filterJob, setFilterJob] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const updateStatus = async (id, newStatus, reason = '') => {
    const applicant = applicants.find((a) => a.id === id);
    if (!applicant) return;

    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    try {
      await api.put(`/applications/${id}/status`, { status: newStatus, note: reason });
    } catch (e) {
      // offline simulation
    }

    let notifTitle = 'Application Status Update';
    let notifMsg = `Your application status for ${applicant.jobTitle} at ${applicant.company} was updated to ${newStatus}.`;

    if (newStatus === 'SHORTLISTED') {
      notifTitle = 'Congratulations! Shortlisted';
      notifMsg = `Congratulations! You have been shortlisted for the ${applicant.jobTitle} position at ${applicant.company}.`;
    } else if (newStatus === 'INTERVIEW_SCHEDULED') {
      notifTitle = 'Interview Scheduled';
      notifMsg = `An interview round for ${applicant.jobTitle} at ${applicant.company} has been scheduled.`;
    } else if (newStatus === 'SELECTED') {
      notifTitle = 'Congratulations! Job Offer Extended';
      notifMsg = `Congratulations! You have been selected for the ${applicant.jobTitle} position at ${applicant.company}!`;
    } else if (newStatus === 'REJECTED') {
      notifTitle = 'Application Status Update';
      notifMsg = `Thank you for interviewing for ${applicant.jobTitle} at ${applicant.company}. The position has been filled.`;
    }

    addNotification({
      userId: applicant.studentId,
      title: notifTitle,
      message: notifMsg,
      type: newStatus,
      jobTitle: applicant.jobTitle,
      companyName: applicant.company,
    });

    setActionNotice(
      `Status for ${applicant.studentName} updated to "${newStatus}". Notification dispatched to student.`
    );
    setTimeout(() => setActionNotice(''), 4000);
  };

  const filteredApplicants = applicants.filter((a) => {
    const matchesJob = filterJob === 'ALL' || a.jobTitle === filterJob;
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchesSearch =
      !search ||
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesJob && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Applicant Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review student resumes, shortlist candidates, schedule interviews, and trigger automatic status notifications.
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, skill, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
          >
            <option value="ALL">All Positions</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Frontend Developer Intern">Frontend Developer Intern</option>
            <option value="Python Developer">Python Developer</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Candidates List ({filteredApplicants.length})
          </h2>
          <span className="text-xs text-slate-400">
            Click Shortlist or Reject to instantly notify student
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">Key Skills</th>
                <th className="py-3 px-3">CGPA</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Placement Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() => setSelectedApplicant(applicant)}
                      className="font-bold text-slate-900 hover:text-blue-600 text-left transition"
                    >
                      {applicant.studentName}
                    </button>
                    <p className="text-[11px] text-slate-400">{applicant.college}</p>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-700">
                    {applicant.jobTitle}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {applicant.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-extrabold text-blue-600">
                    {applicant.cgpa} / 10
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={applicant.status} />
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedApplicant(applicant)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                        title="View Profile Details"
                      >
                        Profile
                      </button>

                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition inline-flex items-center gap-1"
                        title="View Resume"
                      >
                        <FileText className="w-3 h-3" /> Resume
                      </a>

                      <button
                        type="button"
                        onClick={() => updateStatus(applicant.id, 'SHORTLISTED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-semibold border border-emerald-200 hover:border-transparent transition"
                        title="Shortlist Applicant (Triggers Notification)"
                      >
                        Shortlist
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(applicant.id, 'INTERVIEW_SCHEDULED')}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-semibold border border-purple-200 hover:border-transparent transition"
                        title="Schedule Interview Round"
                      >
                        Interview
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(applicant.id, 'REJECTED')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-semibold border border-rose-200 hover:border-transparent transition"
                        title="Reject Applicant (Triggers Notification)"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                  Candidate Dossier
                </span>
                <h3 className="text-xl font-bold text-slate-900">{selectedApplicant.studentName}</h3>
                <p className="text-xs text-slate-500">{selectedApplicant.email}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Applied Job</span>
                  <span className="font-bold text-slate-900">{selectedApplicant.jobTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">CGPA</span>
                  <span className="font-extrabold text-blue-600 text-sm">{selectedApplicant.cgpa} / 10</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Department</span>
                  <span className="font-medium text-slate-800">{selectedApplicant.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Current Status</span>
                  <StatusBadge status={selectedApplicant.status} />
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1.5">Candidate Cover Letter:</span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed text-xs">
                  {selectedApplicant.coverLetter}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1.5">Verified Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApplicant.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg border border-blue-100 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  updateStatus(selectedApplicant.id, 'SHORTLISTED');
                  setSelectedApplicant(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
              >
                Shortlist Candidate
              </button>
              <button
                type="button"
                onClick={() => {
                  updateStatus(selectedApplicant.id, 'SELECTED');
                  setSelectedApplicant(null);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition"
              >
                Extend Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
