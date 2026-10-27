import React, { useEffect, useMemo, useState } from 'react';
import { api, useApi } from '../hooks/useApi';
import { Button } from '../components/ui/button';
import { CalendarDays, Clock3, BookOpenText, ExternalLink, BadgeCheck } from 'lucide-react';

const normalizeTimeValue = (value) => {
  const raw = (value || '09:00').trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return raw;

  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = (match[3] || '').toUpperCase();

  if (meridiem === 'AM' && hour === 12) hour = 0;
  if (meridiem === 'PM' && hour < 12) hour += 12;

  return `${String(hour).padStart(2, '0')}:${minute}`;
};

const parseExamDateTime = (dateValue, timeValue) => {
  if (!dateValue) return null;

  const time = normalizeTimeValue(timeValue || '09:00');
  const isoCandidate = `${String(dateValue).split('T')[0]}T${time}:00+05:30`;
  const parsed = new Date(isoCandidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getLiveExamStatus = (exam) => {
  if (!exam) return 'Scheduled';

  const computed = (exam.computed_status || exam.status || '').trim();
  if (computed && ['Live', 'Scheduled', 'Completed', 'Cancelled', 'Registration Open'].includes(computed)) {
    return computed;
  }

  const date = exam.exam_date;
  const startTime = exam.start_time || '09:00';
  const endTime = exam.end_time || '10:00';
  const registrationDeadline = exam.registration_deadline;

  if (!date) return computed || 'Scheduled';

  const startDate = parseExamDateTime(date, startTime);
  const endDate = parseExamDateTime(date, endTime);
  const now = new Date();

  if (!startDate || !endDate) {
    return computed || 'Scheduled';
  }

  if (now < startDate) {
    if (registrationDeadline) {
      const deadline = new Date(registrationDeadline);
      if (!Number.isNaN(deadline.getTime()) && now <= deadline) return 'Registration Open';
    }
    return 'Scheduled';
  }

  if (now >= startDate && now < endDate) return 'Live';
  return 'Completed';
};

const normalizeStatus = (status) => {
  const value = (status || 'Scheduled').trim();
  if (['Completed', 'Cancelled', 'Closed'].includes(value)) return 'Closed';
  if (value === 'Registration Open') return 'Open';
  if (value === 'Live') return 'Live';
  return 'Scheduled';
};

const cardStatusStyles = {
  Scheduled: 'bg-[#F7D98A] text-[#0F2A5C]',
  Open: 'bg-[#DFF7E8] text-[#0D7C4B]',
  Live: 'bg-[#FEE2E2] text-[#B91C1C]',
  Closed: 'bg-[#F7E4A1] text-[#0F2A5C]',
};

const Exams = () => {
  const { data: exams = [], loading, error, setData } = useApi(() => api.list('exams'), []);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const handleContentUpdate = (event) => {
      const path = event?.detail?.path;
      if (!path || path === 'exams') {
        api.list('exams')
          .then((rows) => setData(rows || []))
          .catch(() => {});
      }
    };

    const timer = setInterval(() => setTick(Date.now()), 30000);
    window.addEventListener('content-updated', handleContentUpdate);
    return () => {
      clearInterval(timer);
      window.removeEventListener('content-updated', handleContentUpdate);
    };
  }, [setData]);

  const upcomingExams = useMemo(() => {
    const list = (exams || []).filter((exam) => {
      const status = getLiveExamStatus(exam);
      return status !== 'Completed' && status !== 'Cancelled';
    });

    const priority = { Live: 0, Registration: 1, Scheduled: 2 };

    return [...list].sort((a, b) => {
      const aStatus = getLiveExamStatus(a);
      const bStatus = getLiveExamStatus(b);

      const aRank = aStatus === 'Registration Open' ? priority.Registration : priority[aStatus] ?? 99;
      const bRank = bStatus === 'Registration Open' ? priority.Registration : priority[bStatus] ?? 99;

      const statusDiff = aRank - bRank;
      if (statusDiff !== 0) return statusDiff;

      const aDate = new Date(a.exam_date || 0).getTime();
      const bDate = new Date(b.exam_date || 0).getTime();
      return aDate - bDate;
    });
  }, [exams]);

  const filteredExams = useMemo(() => {
    if (selectedFilter === 'All') return upcomingExams;
    return upcomingExams.filter((exam) => getLiveExamStatus(exam) === selectedFilter || (selectedFilter === 'Open' && getLiveExamStatus(exam) === 'Registration Open'));
  }, [upcomingExams, selectedFilter]);

  const openExam = (exam) => {
    if (!exam.is_published || !exam.access_enabled) {
      window.alert('This exam is not currently available.');
      return;
    }
    if (!exam.classplus_url) {
      window.alert('This exam does not have a Classplus link configured yet.');
      return;
    }
    window.open(exam.classplus_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <section className="bg-[#0B2A52] pt-12 pb-16">
        <div className="mx-auto max-w-6xl px-4 text-center text-white">
          <div className="mx-auto mb-5 inline-flex items-center justify-center rounded-full bg-[#F5B921] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B2A52]">
            Student Portal
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Upcoming Exams</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-200 md:text-xl">
            Discover the latest published mock tests, challenge papers, and scheduled exam windows.
          </p>
        </div>
      </section>

      <section className="bg-[#EEF3F9] py-10">
        <div className="mx-auto max-w-6xl px-4">
          {loading && <div className="rounded-xl border border-dashed bg-white p-6 text-center text-slate-500">Loading exams...</div>}
          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">Unable to load exams right now.</div>}

          {!loading && !error && upcomingExams.length === 0 && (
            <div className="rounded-xl border border-dashed bg-white p-6 text-center text-slate-500">No upcoming exams are currently published.</div>
          )}

          {!loading && !error && upcomingExams.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {['All', 'Live', 'Open', 'Scheduled'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedFilter === filter
                      ? 'border-[#0F2A5C] bg-[#0F2A5C] text-white shadow-sm'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          {!loading && !error && filteredExams.length === 0 && (
            <div className="rounded-xl border border-dashed bg-white p-6 text-center text-slate-500">No {selectedFilter.toLowerCase()} exams found.</div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {filteredExams.map((exam) => {
              const status = getLiveExamStatus(exam);
              const displayStatus = status === 'Registration Open' ? 'Open' : status;
              const examDate = exam.exam_date ? new Date(exam.exam_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD';
              const timeText = [exam.start_time, exam.end_time].filter(Boolean).join(' - ') || 'Time TBD';
              const duration = exam.duration ? `${exam.duration} minutes` : 'Duration TBD';

              return (
                <article key={exam.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,42,92,0.10)]">
                  <div className="flex items-center justify-between bg-[#0F2A5C] px-5 py-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">{exam.class_level || exam.academic_level || 'Class'} {exam.academic_year || ''}</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${cardStatusStyles[displayStatus] || cardStatusStyles.Scheduled}`}>
                      {displayStatus}
                    </span>
                  </div>

                  <div className="p-5 md:p-6">
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0F2A5C]">{exam.exam_name}</h3>

                    <div className="mt-5 space-y-3 text-sm text-slate-700">
                      <div className="flex items-center gap-3">
                        <BookOpenText size={16} className="text-[#0F2A5C]" />
                        <span>Course: {exam.subject || 'Subject'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays size={16} className="text-[#0F2A5C]" />
                        <span>Date: {examDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock3 size={16} className="text-[#0F2A5C]" />
                        <span>Time: {timeText}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BadgeCheck size={16} className="text-[#0F2A5C]" />
                        <span>Duration: {duration}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => openExam(exam)}
                        className={`flex-1 rounded-md px-4 py-3 text-sm font-bold transition ${status === 'Live' ? 'bg-[#F5B921] text-[#0F2A5C] hover:bg-[#e3a911]' : 'bg-[#F5B921] text-[#0F2A5C] hover:bg-[#e3a911]'}`}
                      >
                        Start Exam
                      </button>
                      <button
                        type="button"
                        onClick={() => openExam(exam)}
                        className="rounded-md border border-slate-300 bg-white px-3 py-3 text-slate-700 hover:bg-slate-50"
                        aria-label="Open exam"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Exams;
