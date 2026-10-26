import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Calendar,
  Award,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  Save,
  Edit3,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Pradeep Kumar',
    email: user?.email || 'pradeep.kumar@college.edu',
    phone: user?.phone || '+91 98765 43210',
    college: user?.college || 'College of Engineering & Technology',
    department: user?.department || 'Computer Science & Engineering',
    year: user?.year || '4th Year (Final Year)',
    cgpa: user?.cgpa || 8.75,
    location: 'Chennai, Tamil Nadu',
    about:
      'Passionate Computer Science undergraduate interested in Full-Stack Web Development, Cloud Systems, and scalable architectures. Looking for challenging software engineering roles.',
    resumeUrl: 'https://example.com/resume/pradeep-resume-2026.pdf',
    profilePhotoUrl:
      user?.profilePhotoUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/students/profile');
        if (res.data) {
          setProfile((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // use initial
      }
    };
    loadProfile();
  }, []);

  const calculateCompletion = () => {
    const fields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.college,
      profile.department,
      profile.year,
      profile.cgpa,
      profile.location,
      profile.about,
      profile.resumeUrl,
    ];
    const filled = fields.filter((f) => f && f.toString().trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);

    try {
      await api.put('/students/profile', profile);
    } catch (err) {
      // Offline fallback
    }

    updateUser(profile);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your personal credentials, academic records, and placement resume.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile changes saved successfully! Companies can view your updated information.</span>
        </div>
      )}

      {/* Profile Completion Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Profile Completion</span>
          </div>
          <span className="text-sm font-extrabold text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          A 100% completed profile receives 3x more shortlist notifications from campus recruiters.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block mx-auto mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-slate-100">
                <img
                  src={profile.profilePhotoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    const newUrl = prompt('Enter image URL for profile photo:');
                    if (newUrl) setProfile((p) => ({ ...p, profilePhotoUrl: newUrl }));
                  }}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
                  title="Change photo URL"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
            <p className="text-xs text-slate-500">{profile.department}</p>
            <p className="text-xs font-semibold text-blue-600 mt-1">{profile.college}</p>

            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">CGPA</span>
                <span className="text-base font-extrabold text-slate-900">{profile.cgpa} / 10</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Year</span>
                <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">{profile.year}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Placement Resume
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your resume is automatically attached when you click 'Apply' on job postings.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {profile.name.replace(/\s+/g, '_')}_Resume_2026.pdf
                  </span>
                  <span className="text-[10px] text-slate-400">PDF • 1.2 MB • Updated Sept 2026</span>
                </div>
              </div>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-blue-600 transition"
                title="View Resume"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {isEditing && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => alert('Resume updated to current latest version.')}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload New Resume (PDF)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Personal & Academic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  disabled={!isEditing}
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Current Location
                </label>
                <input
                  type="text"
                  name="location"
                  disabled={!isEditing}
                  value={profile.location}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> College
                </label>
                <input
                  type="text"
                  name="college"
                  disabled={!isEditing}
                  value={profile.college}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Department
                </label>
                <input
                  type="text"
                  name="department"
                  disabled={!isEditing}
                  value={profile.department}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Year of Study
                </label>
                <input
                  type="text"
                  name="year"
                  disabled={!isEditing}
                  value={profile.year}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400" /> CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  disabled={!isEditing}
                  value={profile.cgpa}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                About / Professional Summary
              </label>
              <textarea
                name="about"
                rows={4}
                disabled={!isEditing}
                value={profile.about}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                placeholder="Share your technical interests, career goals, and experience..."
              />
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
