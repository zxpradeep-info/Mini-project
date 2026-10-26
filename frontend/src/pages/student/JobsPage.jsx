import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Briefcase,
  X,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/client';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Java Developer',
      company: 'ABC Technologies',
      location: 'Chennai',
      jobType: 'Full Time',
      salary: '₹6–8 LPA',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      minCgpa: 7.0,
      experience: 'Fresher (0-1 yr)',
      postedDate: '12 Sept 2026',
      deadline: '30 Sept 2026',
      description: 'Join our enterprise backend team building high-throughput microservices in Java and Spring Boot.',
    },
    {
      id: 2,
      title: 'Frontend Developer Intern',
      company: 'XYZ Technologies',
      location: 'Remote',
      jobType: 'Internship',
      salary: '₹25,000 / month',
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      minCgpa: 6.5,
      experience: 'Intern',
      postedDate: '15 Sept 2026',
      deadline: '28 Sept 2026',
      description: 'Looking for a passionate React enthusiast to craft responsive user interfaces and integrate modern REST APIs.',
    },
    {
      id: 3,
      title: 'Python Developer',
      company: 'ABC Solutions',
      location: 'Bengaluru',
      jobType: 'Full Time',
      salary: '₹7–9 LPA',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      minCgpa: 7.5,
      experience: 'Fresher (0-1 yr)',
      postedDate: '10 Sept 2026',
      deadline: '02 Oct 2026',
      description: 'Work on cutting-edge data pipelines, machine learning backends, and automated ETL workflows in Python.',
    },
    {
      id: 4,
      title: 'Cloud & DevOps Intern',
      company: 'CloudScale Systems',
      location: 'Hyderabad',
      jobType: 'Internship',
      salary: '₹30,000 / month',
      skills: ['Linux', 'Docker', 'AWS', 'Kubernetes'],
      minCgpa: 7.0,
      experience: 'Intern',
      postedDate: '16 Sept 2026',
      deadline: '05 Oct 2026',
      description: 'Support CI/CD pipelines, containerized deployments, and infrastructure provisioning on cloud environments.',
    },
    {
      id: 5,
      title: 'Associate Software Engineer',
      company: 'Global Infotech',
      location: 'Pune',
      jobType: 'Full Time',
      salary: '₹5.5–6.5 LPA',
      skills: ['Java', 'SQL', 'Git', 'Data Structures'],
      minCgpa: 6.0,
      experience: 'Fresher',
      postedDate: '14 Sept 2026',
      deadline: '10 Oct 2026',
      description: 'Ideal starting role for final-year students with solid algorithmic problem solving and database skills.',
    },
    {
      id: 6,
      title: 'Part-Time Web Developer',
      company: 'PixelCraft Digital',
      location: 'Remote',
      jobType: 'Part-time',
      salary: '₹15,000 / month',
      skills: ['JavaScript', 'HTML5', 'Tailwind CSS', 'React'],
      minCgpa: 6.0,
      experience: 'Student/Part-time',
      postedDate: '17 Sept 2026',
      deadline: '12 Oct 2026',
      description: 'Flexible part-time frontend role helping build web experiences for collegiate and corporate clients.',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.data && res.data.length > 0) {
          setJobs(res.data);
        }
      } catch (err) {
        // fallback
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q));

    const matchesType =
      selectedType === 'ALL' ||
      job.jobType.toLowerCase().replace(/\s+/g, '') === selectedType.toLowerCase().replace(/\s+/g, '');

    const matchesLocation =
      selectedLocation === 'ALL' ||
      (selectedLocation === 'REMOTE'
        ? job.location.toLowerCase().includes('remote')
        : !job.location.toLowerCase().includes('remote'));

    const matchesCgpa =
      !minCgpaFilter || (job.minCgpa ? job.minCgpa <= parseFloat(minCgpaFilter) : true);

    return matchesSearch && matchesType && matchesLocation && matchesCgpa;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedLocation('ALL');
    setMinCgpaFilter('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Jobs & Internships</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Browse active placement drives, internships, and entry-level software opportunities.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredJobs.length}</strong> of{' '}
          <strong className="text-slate-900">{jobs.length}</strong> positions
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, skill (e.g. Java, React), or city..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
            >
              <option value="ALL">All Job Types</option>
              <option value="Full Time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
            >
              <option value="ALL">All Locations</option>
              <option value="REMOTE">Remote Only</option>
              <option value="ON_SITE">On-site / Campus</option>
            </select>
          </div>

          {(searchQuery || selectedType !== 'ALL' || selectedLocation !== 'ALL') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50 text-xs text-slate-500">
          <span className="font-medium mr-1">Quick Picks:</span>
          {['Full Time', 'Internship', 'Remote', 'Java', 'React', 'Python'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (tag === 'Full Time' || tag === 'Internship') setSelectedType(tag);
                else if (tag === 'Remote') setSelectedLocation('REMOTE');
                else setSearchQuery(tag);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-100 font-medium transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching jobs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing filters to see all available placement opportunities.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
          >
            Show All Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{job.company}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      job.jobType.includes('Intern')
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : job.jobType.includes('Part')
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {job.jobType}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold justify-end">
                    <span>{job.salary}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Skills:</span>
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-50 text-slate-700 text-[11px] font-medium rounded-md border border-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Deadline: <strong className="text-slate-700">{job.deadline}</strong>
                </span>

                <Link
                  to={`/jobs/${job.id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
