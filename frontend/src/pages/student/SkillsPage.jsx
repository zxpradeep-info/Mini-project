import React, { useState, useEffect } from 'react';
import { Plus, Wrench, Sparkles, CheckCircle2, Trash2, Edit2, AlertCircle } from 'lucide-react';
import SkillBadge from '../../components/common/SkillBadge';
import api from '../../api/client';

export const SkillsPage = () => {
  const [skills, setSkills] = useState([
    { id: 1, name: 'Java', level: 'ADVANCED' },
    { id: 2, name: 'HTML', level: 'ADVANCED' },
    { id: 3, name: 'CSS', level: 'INTERMEDIATE' },
    { id: 4, name: 'JavaScript', level: 'INTERMEDIATE' },
    { id: 5, name: 'MySQL', level: 'INTERMEDIATE' },
    { id: 6, name: 'Spring Boot', level: 'INTERMEDIATE' },
    { id: 7, name: 'React.js', level: 'INTERMEDIATE' },
    { id: 8, name: 'Git & GitHub', level: 'ADVANCED' },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('INTERMEDIATE');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const suggestedSkills = [
    'Python',
    'PostgreSQL',
    'Docker',
    'Tailwind CSS',
    'Node.js',
    'TypeScript',
    'AWS',
    'C++',
    'REST APIs',
    'Data Structures',
  ];

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await api.get('/students/skills');
        if (res.data && res.data.length > 0) {
          setSkills(res.data);
        }
      } catch (err) {
        // fallback
      }
    };
    loadSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newSkillName.trim()) {
      setErrorMsg('Please enter a skill name.');
      return;
    }

    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setErrorMsg(`"${newSkillName}" has already been added.`);
      return;
    }

    const newSkill = {
      id: Date.now(),
      name: newSkillName.trim(),
      level: newSkillLevel,
    };

    try {
      await api.post('/students/skills', newSkill);
    } catch (err) {
      // offline fallback
    }

    setSkills((prev) => [...prev, newSkill]);
    setNewSkillName('');
    setSuccessMsg(`"${newSkill.name}" added successfully!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRemoveSkill = async (id, name) => {
    try {
      await api.delete(`/students/skills/${id}`);
    } catch (err) {
      // fallback
    }
    setSkills((prev) => prev.filter((s) => s.id !== id));
    setSuccessMsg(`"${name}" removed.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleUpdateLevel = (id, newLevel) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, level: newLevel } : s))
    );
    setSuccessMsg('Skill proficiency level updated.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Skills</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Showcase your technical competencies and proficiency levels to match job requirements.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" /> Add New Skill
        </h2>

        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Docker, Python, PostgreSQL, React Native..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-white"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-medium mr-2">Suggested:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-2 sm:mt-0">
            {suggestedSkills.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => {
                  setNewSkillName(sug);
                }}
                className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-medium rounded-lg border border-slate-200/80 transition"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Current Skills ({skills.length})</h2>
          </div>
          <span className="text-xs text-slate-400">Click level to adjust proficiency</span>
        </div>

        {skills.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No skills added yet. Add your skills above to start getting matched with jobs.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {skill.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id, skill.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition opacity-80 group-hover:opacity-100"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Level:</span>
                  <select
                    value={skill.level}
                    onChange={(e) => handleUpdateLevel(skill.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition ${
                      skill.level === 'ADVANCED'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : skill.level === 'INTERMEDIATE'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;
