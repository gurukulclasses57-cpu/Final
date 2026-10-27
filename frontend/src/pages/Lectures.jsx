import React, { useEffect, useMemo, useState } from 'react';
import { api, useApi } from '../hooks/useApi';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, PlayCircle, CalendarDays, Clock3, Video } from 'lucide-react';

const resolveMediaThumb = (value, fallbackVideo = '') => {
  const raw = (value || '').trim();
  if (raw) {
    if (/youtube\.com|youtu\.be|vimeo\.com/i.test(raw)) {
      const match = raw.match(/(?:v=|be\/|video\/)([A-Za-z0-9_-]{6,})/i);
      const id = match ? match[1] : null;
      if (id && /youtube|youtu\.be/i.test(raw)) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      if (id && /vimeo/i.test(raw)) return `https://vumbnail.com/${id}.jpg`;
    }
    return raw;
  }

  if (fallbackVideo) {
    return resolveMediaThumb(fallbackVideo);
  }

  return '';
};

const getVideoEmbedUrl = (videoUrl) => {
  if (!videoUrl) return '';
  const raw = videoUrl.trim();
  if (!raw) return '';

  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();

    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      const videoId = url.searchParams.get('v') || raw.match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/)?.[1] || raw.match(/shorts\/([A-Za-z0-9_-]{11})/)?.[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    if (host.includes('vimeo.com')) {
      const match = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i) || raw.match(/player\.vimeo\.com\/video\/(\d+)/i);
      const videoId = match?.[1];
      if (videoId) return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
    }
  } catch (error) {
    return '';
  }

  return raw;
};

const Lectures = () => {
  const { data: lectures = [], loading: lecturesLoading, setData: setLecturesData } = useApi(() => api.list('lectures'), []);
  const [q, setQ] = useState('');
  const [playingLecture, setPlayingLecture] = useState(null);

  useEffect(() => {
    const handleContentUpdated = (event) => {
      const path = event?.detail?.path;
      if (!path || path === 'lectures' || path === 'lecture-subjects') {
        api.list('lectures')
          .then((nextLectures) => {
            setLecturesData(nextLectures || []);
          })
          .catch(() => {});
      }
    };

    const handleStorageRefresh = (event) => {
      if (event.key !== 'gurukul-content-updated') return;
      try {
        const detail = JSON.parse(event.newValue || '{}');
        if (detail.path === 'lectures' || detail.path === 'lecture-subjects' || !detail.path) {
          api.list('lectures')
            .then((nextLectures) => setLecturesData(nextLectures || []))
            .catch(() => {});
        }
      } catch (error) {
        console.warn('Could not refresh lectures from storage event:', error);
      }
    };

    window.addEventListener('content-updated', handleContentUpdated);
    window.addEventListener('storage', handleStorageRefresh);
    return () => {
      window.removeEventListener('content-updated', handleContentUpdated);
      window.removeEventListener('storage', handleStorageRefresh);
    };
  }, [setLecturesData]);

  const visibleLectures = useMemo(() => {
    return (lectures || []).filter((lecture) => {
      const textMatch = !q || [lecture.title, lecture.lecture_topic, lecture.chapter_or_unit, lecture.description, lecture.instructor_name].join(' ').toLowerCase().includes(q.toLowerCase());
      return textMatch;
    });
  }, [lectures, q]);

  const handleOpen = (lecture) => {
    if (!lecture.video_url) {
      window.alert('This lecture does not have a URL configured yet.');
      return;
    }
    setPlayingLecture(lecture);
  };

  return (
    <>
      {playingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setPlayingLecture(null)}>
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3 text-white">
              <div className="text-sm font-semibold">{playingLecture.title}</div>
              <button onClick={() => setPlayingLecture(null)} className="rounded-md border border-slate-600 px-2 py-1 text-xs hover:bg-slate-800">Close</button>
            </div>
            <div className="aspect-video w-full bg-black">
              {getVideoEmbedUrl(playingLecture.video_url) ? (
                <iframe
                  src={getVideoEmbedUrl(playingLecture.video_url)}
                  title={playingLecture.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-200">
                  Video preview unavailable for this link.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="bg-[#0D2F5F] pb-16 pt-10 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto mb-5 inline-flex items-center justify-center rounded-md bg-[#F5B921] px-4 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0D2F5F]">
            Learning Hub
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Video Lectures</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-200 md:text-xl">
            Quick revision lessons, concept videos, and topic-wise guidance from our expert faculty.
          </p>
        </div>
      </section>

      <section className="bg-[#F3F5F8] py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 max-w-xl">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lecture title/topic" className="pl-9 bg-white" />
            </div>
          </div>

          {lecturesLoading ? <div className="text-slate-500">Loading lectures...</div> : null}

          {visibleLectures.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
              No published video lectures are available right now. Please check back soon.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleLectures.map((lecture) => (
                <article key={lecture.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="relative cursor-pointer" onClick={() => handleOpen(lecture)}>
                    <img src={resolveMediaThumb(lecture.thumbnail_url, lecture.video_url) || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'} alt={lecture.title} className="h-52 w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button onClick={(event) => { event.stopPropagation(); handleOpen(lecture); }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 text-[#0F2A5C] shadow-lg transition hover:scale-105">
                      <PlayCircle size={28} />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-extrabold text-[#0F2A5C] line-clamp-2">{lecture.title}</h3>

                    {lecture.lecture_topic && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{lecture.lecture_topic}</p>}

                    <Button onClick={() => handleOpen(lecture)} className="mt-4 w-full bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold">
                      Watch Now
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Lectures;
