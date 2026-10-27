import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Trash2, Edit, X, RefreshCw, Save } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import ImageUploadField from '../../components/ImageUploadField';
import { hydrateSiteSettings, resolveBackendUrl } from '../../mock';

const SCHEMAS = {
  'homepage-editor': {
    label: 'Homepage Editor', cols: ['section','title','status'],
    fields: [
      ['section','Section *','text'], ['title','Title *','text'], ['subtitle','Subtitle','text'],
      ['description','Description','textarea'], ['image','Image','image'], ['status','Status','text'],
    ],
    blank: { section:'homepage', title:'', subtitle:'', description:'', image:'', status:'active' },
  },
  'seo-manager': {
    label: 'SEO Manager', cols: ['page','title'],
    fields: [
      ['page','Page *','text'], ['title','Title *','text'], ['description','Meta Description','textarea'],
      ['keywords','Keywords','text'], ['og_image','Open Graph Image','image'],
    ],
    blank: { page:'home', title:'', description:'', keywords:'', og_image:'' },
  },
  'site-settings': {
    label: 'Site Settings', cols: ['key','value'],
    fields: [
      ['key','Key *','text'], ['value','Value *','text'], ['group','Group','text'],
    ],
    blank: { key:'site_name', value:'GURUKUL ClASSES', group:'site' },
  },
  banners: {
    label: 'Hero Banners', cols: ['title','cta','link','order'],
    fields: [
      ['title','Title *','text'], ['subtitle','Subtitle','text'],
      ['image','Banner image *','image'],
      ['cta','Button text','text'], ['link','Button link','text'],
      ['order','Display order','number'],
    ],
    blank: { title:'', subtitle:'', image:'', cta:'Learn More', link:'/', order:1, is_active:true },
  },
  counters: {
    label: 'Counters', cols: ['value','label','suffix'],
    fields: [
      ['value','Value *','number'], ['prefix','Prefix','text'], ['suffix','Suffix','text'],
      ['label','Label *','text'],
    ],
    blank: { value:0, prefix:'', suffix:'+', label:'' },
  },
  faqs: {
    label: 'FAQs', cols: ['question','answer'],
    fields: [
      ['question','Question *','text'], ['answer','Answer *','textarea'],
    ],
    blank: { question:'', answer:'' },
  },
  'programs-strip': {
    label: 'Programs Strip', cols: ['code','title','sub'],
    fields: [
      ['code','Code *','text'], ['title','Title *','text'], ['sub','Subtitle','text'],
      ['desc','Description','textarea'], ['href','Link','text'],
    ],
    blank: { code:'JEE', title:'JEE', sub:'(For Std. 11, 12)', desc:'', href:'/courses' },
  },
  'why-us': {
    label: 'Why Us', cols: ['title','icon'],
    fields: [
      ['icon','Icon *','text'], ['title','Title *','text'], ['desc','Description','textarea'],
    ],
    blank: { icon:'Sparkles', title:'', desc:'' },
  },
  centres: {
    label: 'Centres', cols: ['name','city'],
    fields: [
      ['name','Centre Name *','text'], ['city','City','text'], ['address','Address','textarea'],
    ],
    blank: { name:'', city:'', address:'' },
  },
  courses: {
    label: 'Courses', cols: ['slug','title','duration','audience','price'],
    fields: [
      ['slug','Slug *','text'], ['title','Title *','text'],
      ['duration','Duration','text'], ['audience','Audience','text'],
      ['price','Price','text'], ['image','Course image','image'],
      ['short','Short description','textarea'], ['detail','Full detail','textarea'],
      ['highlights','Highlights (comma-sep)','tags'], ['subjects','Subjects (comma-sep)','tags'],
    ],
    blank: { slug:'', title:'', duration:'', audience:'', price:'', image:'', short:'', detail:'', highlights:[], subjects:[], is_active:true },
  },
  faculty: {
    label: 'Faculty', cols: ['name','subject','exp','credentials'],
    fields: [
      ['name','Name *','text'], ['subject','Subject *','text'],
      ['exp','Experience','text'], ['credentials','Credentials','text'],
      ['img','Photo','image'], ['bio','Bio','textarea'],
    ],
    blank: { name:'', subject:'', exp:'', credentials:'', img:'', bio:'' },
  },
  blogs: {
    label: 'Blogs', cols: ['slug','title','author','category','date'],
    fields: [
      ['slug','Slug *','text'], ['title','Title *','text'],
      ['author','Author','text'], ['category','Category','text'], ['date','Date','text'],
      ['cover','Cover image','image'], ['excerpt','Excerpt','textarea'], ['body','Body','textarea'],
    ],
    blank: { slug:'', title:'', author:'', category:'', date:'', cover:'', excerpt:'', body:'' },
  },
  testimonials: {
    label: 'Testimonials', cols: ['name','rank','text'],
    fields: [
      ['name','Name *','text'], ['rank','Rank / Title','text'],
      ['img','Photo','image'], ['text','Testimonial text','textarea'],
    ],
    blank: { name:'', rank:'', img:'', text:'' },
  },
  toppers: {
    label: 'Toppers', cols: ['name','rank','score','year'],
    fields: [
      ['name','Name *','text'], ['rank','Rank','text'],
      ['score','Score','text'], ['year','Year','number'], ['img','Photo','image'],
    ],
    blank: { name:'', rank:'', score:'', year:2026, img:'' },
  },
  results: {
    label: 'Results', cols: ['year','name','rank','exam','college'],
    fields: [
      ['year','Year *','number'], ['name','Name *','text'],
      ['rank','Rank','text'], ['exam','Exam','text'], ['college','College','text'],
    ],
    blank: { year:2025, name:'', rank:'', exam:'', college:'' },
  },
  gallery: {
    label: 'Gallery', cols: ['url','caption'],
    fields: [['url','Image *','image'], ['caption','Caption','text']],
    blank: { url:'', caption:'' },
  },
  news: {
    label: 'News', cols: ['title','date'],
    fields: [
      ['title','Title *','text'], ['date','Date','text'],
      ['img','Image','image'], ['desc','Description','textarea'],
    ],
    blank: { title:'', date:'', img:'', desc:'' },
  },
};

const SiteSettingsEditor = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    site_name: 'Giri Sirs Gurukul Classes',
    tagline: 'Inclusive Personalised JEE & NEET Coaching',
    phone: '+91 7888276333',
    whatsapp: '+917888276333',
    whatsapp_message: 'Hello Giri Sirs Gurukul Classes! I am interested in your coaching programs. Please share more details.',
    email: 'info@girisirsgurukulclasses.com',
    address: 'Education Lane, Sector 21, Pune 411001, Maharashtra, India',
    footer_tagline: 'Premium Coaching',
    footer_description: 'India\'s trusted IIT-JEE & NEET coaching institute. 23+ years of academic excellence, 1400+ JEE Advanced ranks, and a community of dedicated mentors.',
    footer_copyright: 'All rights reserved.',
    footer_privacy_text: 'Privacy Policy',
    footer_terms_text: 'Terms & Conditions',
    social_facebook: 'https://facebook.com',
    social_instagram: 'https://instagram.com',
    social_youtube: 'https://youtube.com',
    social_twitter: 'https://x.com',
    social_linkedin: 'https://linkedin.com',
    logo: '',
    logo_width: 100,
    logo_height: 100,
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await api.list('site-settings');
      const map = Object.fromEntries((rows || []).map((row) => [row.key, row]));
      setSettings((prev) => ({
        site_name: map.site_name?.value || prev.site_name,
        tagline: map.tagline?.value || prev.tagline,
        phone: map.phone?.value || prev.phone,
        whatsapp: map.whatsapp?.value || prev.whatsapp,
        whatsapp_message: map.whatsapp_message?.value || prev.whatsapp_message,
        email: map.email?.value || prev.email,
        address: map.address?.value || prev.address,
        footer_tagline: map.footer_tagline?.value || prev.footer_tagline,
        footer_description: map.footer_description?.value || prev.footer_description,
        footer_copyright: map.footer_copyright?.value || prev.footer_copyright,
        footer_privacy_text: map.footer_privacy_text?.value || prev.footer_privacy_text,
        footer_terms_text: map.footer_terms_text?.value || prev.footer_terms_text,
        social_facebook: map.social_facebook?.value || prev.social_facebook,
        social_instagram: map.social_instagram?.value || prev.social_instagram,
        social_youtube: map.social_youtube?.value || prev.social_youtube,
        social_twitter: map.social_twitter?.value || prev.social_twitter,
        social_linkedin: map.social_linkedin?.value || prev.social_linkedin,
        logo: map.logo?.value || prev.logo,
        logo_width: Number(map.logo_width?.value || prev.logo_width),
        logo_height: Number(map.logo_height?.value || prev.logo_height),
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const rows = await api.list('site-settings');
      const map = Object.fromEntries((rows || []).map((row) => [row.key, row]));
      const payloads = [
        ['site_name', settings.site_name],
        ['tagline', settings.tagline],
        ['phone', settings.phone],
        ['whatsapp', settings.whatsapp],
        ['whatsapp_message', settings.whatsapp_message],
        ['email', settings.email],
        ['address', settings.address],
        ['footer_tagline', settings.footer_tagline],
        ['footer_description', settings.footer_description],
        ['footer_copyright', settings.footer_copyright],
        ['footer_privacy_text', settings.footer_privacy_text],
        ['footer_terms_text', settings.footer_terms_text],
        ['social_facebook', settings.social_facebook],
        ['social_instagram', settings.social_instagram],
        ['social_youtube', settings.social_youtube],
        ['social_twitter', settings.social_twitter],
        ['social_linkedin', settings.social_linkedin],
        ['logo', settings.logo],
        ['logo_width', String(settings.logo_width || 100)],
        ['logo_height', String(settings.logo_height || 100)],
      ];

      for (const [key, value] of payloads) {
        const existing = map[key];
        const row = { key, value, group: 'site' };
        if (existing?.id) await api.update('site-settings', existing.id, row);
        else await api.create('site-settings', row);
      }

      hydrateSiteSettings({
        name: settings.site_name,
        tagline: settings.tagline,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        footer_tagline: settings.footer_tagline,
        footer_description: settings.footer_description,
        footer_copyright: settings.footer_copyright,
        footer_privacy_text: settings.footer_privacy_text,
        footer_terms_text: settings.footer_terms_text,
        social_facebook: settings.social_facebook,
        social_instagram: settings.social_instagram,
        social_youtube: settings.social_youtube,
        social_twitter: settings.social_twitter,
        social_linkedin: settings.social_linkedin,
        logo: settings.logo,
        logo_width: settings.logo_width,
        logo_height: settings.logo_height,
      });

      toast({ title: 'Site settings saved' });
      load();
    } catch (e) {
      toast({ title: 'Could not save settings', description: e?.response?.data?.detail || e?.message || 'Unknown error' });
    }
  };

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-extrabold text-[#0F2A5C]">Site Settings</h1>
        <Button onClick={save} disabled={loading} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold" size="sm"><Save size={14}/> Save changes</Button>
      </div>

      <div className="bg-white rounded-xl border p-5 md:p-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Site name</label>
            <Input value={settings.site_name} onChange={(e) => update('site_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tagline</label>
            <Input value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
            <Input value={settings.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">WhatsApp number</label>
            <Input value={settings.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">WhatsApp pre-filled message</label>
            <Textarea value={settings.whatsapp_message} onChange={(e) => update('whatsapp_message', e.target.value)} className="min-h-[100px]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <Input value={settings.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
            <Input value={settings.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Footer tagline</label>
            <Input value={settings.footer_tagline} onChange={(e) => update('footer_tagline', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Footer description</label>
            <Textarea value={settings.footer_description} onChange={(e) => update('footer_description', e.target.value)} className="min-h-[100px]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Footer copyright text</label>
            <Input value={settings.footer_copyright} onChange={(e) => update('footer_copyright', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Footer privacy label</label>
            <Input value={settings.footer_privacy_text} onChange={(e) => update('footer_privacy_text', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Footer terms label</label>
            <Input value={settings.footer_terms_text} onChange={(e) => update('footer_terms_text', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Facebook link</label>
            <Input value={settings.social_facebook} onChange={(e) => update('social_facebook', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Instagram link</label>
            <Input value={settings.social_instagram} onChange={(e) => update('social_instagram', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">YouTube link</label>
            <Input value={settings.social_youtube} onChange={(e) => update('social_youtube', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">X / Twitter link</label>
            <Input value={settings.social_twitter} onChange={(e) => update('social_twitter', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">LinkedIn link</label>
            <Input value={settings.social_linkedin} onChange={(e) => update('social_linkedin', e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <div className="grid md:grid-cols-[1fr_160px_160px] gap-3 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Logo</label>
                <div className="rounded-md border overflow-hidden">
                  <ImageUploadField
                    label=""
                    value={settings.logo}
                    onChange={(value) => update('logo', value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Logo width</label>
                <Input type="number" value={settings.logo_width} onChange={(e) => update('logo_width', Number(e.target.value || 100))} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Logo height</label>
                <Input type="number" value={settings.logo_height} onChange={(e) => update('logo_height', Number(e.target.value || 100))} />
              </div>
            </div>

            {settings.logo && (
              <div className="mt-4 flex justify-center border border-dashed rounded-lg bg-slate-50 p-4">
                <img
                  src={resolveBackendUrl(settings.logo)}
                  alt="Site logo preview"
                  style={{ width: settings.logo_width || 100, height: settings.logo_height || 100 }}
                  className="object-contain rounded-md bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoGalleryManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const blank = {
    title: '',
    video_url: '',
    thumbnail_url: '',
    description: '',
    category: 'Campus Tour',
    display_order: 0,
    is_published: true,
    is_featured: false,
    show_on_homepage: true,
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await api.list('admin/videos');
      setItems(rows || []);
    } catch (e) {
      toast({ title: 'Could not load videos', description: e?.response?.data?.detail || e?.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      const payload = {
        ...editing,
        display_order: Number(editing.display_order || 0),
        is_published: Boolean(editing.is_published),
        is_featured: Boolean(editing.is_featured),
        show_on_homepage: Boolean(editing.show_on_homepage),
      };
      if (payload.id) await api.update('admin/videos', payload.id, payload);
      else await api.create('admin/videos', payload);
      toast({ title: 'Video saved' });
      setEditing(null);
      load();
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'videos' } }));
    } catch (e) {
      toast({ title: 'Could not save video', description: e?.response?.data?.detail || e?.message || 'Unknown error' });
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.remove('admin/videos', id);
      setItems((rows) => rows.filter((r) => r.id !== id));
      toast({ title: 'Video deleted' });
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'videos' } }));
    } catch (e) {
      toast({ title: 'Could not delete video', description: e?.response?.data?.detail || e?.message || 'Unknown error' });
    }
  };

  const getThumb = (video) => {
    if (video.thumbnail_url) return video.thumbnail_url;
    const match = (video.video_url || '').match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/);
    if (match?.[1]) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-extrabold text-[#0F2A5C]">Video Gallery ({items.length})</h1>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm" disabled={loading}><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/></Button>
          <Button onClick={() => setEditing({ ...blank })} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold" size="sm"><Plus size={14}/> New</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Published</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">No videos yet</td></tr>}
                {items.map((v) => (
                  <tr key={v.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-medium text-[#0F2A5C]">{v.title}</td>
                    <td className="p-3">{v.category || 'Campus Tour'}</td>
                    <td className="p-3">{v.is_published ? 'Yes' : 'No'}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setEditing({ ...blank, ...v })} className="p-1.5 rounded hover:bg-slate-100" title="Edit"><Edit size={14}/></button>
                      <button onClick={() => remove(v.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600 ml-1" title="Delete"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-lg font-extrabold text-[#0F2A5C] mb-4">{editing?.id ? 'Edit video' : 'Add new video'}</h2>
          {!editing ? (
            <div className="text-slate-500 text-sm">Select a video to edit or create a new one.</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Title</label>
                <Input value={editing.title || ''} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Video URL</label>
                <Input value={editing.video_url || ''} onChange={(e) => setEditing((p) => ({ ...p, video_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Thumbnail URL (optional)</label>
                <Input value={editing.thumbnail_url || ''} onChange={(e) => setEditing((p) => ({ ...p, thumbnail_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Category</label>
                <Input value={editing.category || 'Campus Tour'} onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Description</label>
                <Textarea value={editing.description || ''} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} className="min-h-[90px]" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Display order</label>
                  <Input type="number" value={editing.display_order || 0} onChange={(e) => setEditing((p) => ({ ...p, display_order: Number(e.target.value || 0) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Featured</label>
                  <div className="flex items-center h-10 px-3 rounded-md border bg-slate-50">
                    <input type="checkbox" checked={Boolean(editing.is_featured)} onChange={(e) => setEditing((p) => ({ ...p, is_featured: e.target.checked }))} className="mr-2" />
                    <span className="text-sm text-slate-700">Mark as featured</span>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">Published</span>
                  <input type="checkbox" checked={Boolean(editing.is_published)} onChange={(e) => setEditing((p) => ({ ...p, is_published: e.target.checked }))} />
                </div>
                <div className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">Show on homepage</span>
                  <input type="checkbox" checked={Boolean(editing.show_on_homepage)} onChange={(e) => setEditing((p) => ({ ...p, show_on_homepage: e.target.checked }))} />
                </div>
              </div>

              {editing.video_url && (
                <div className="rounded-lg border bg-slate-50 p-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Preview</div>
                  <img src={getThumb(editing)} alt={editing.title} className="w-full h-40 object-cover rounded-md" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={save} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold"><Save size={14}/> Save</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExamManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All classes');
  const [statusFilter, setStatusFilter] = useState('All statuses');

  const blank = {
    exam_name: '',
    description: '',
    academic_level: 'School',
    class_level: '11th',
    subject: 'JEE',
    exam_type: 'Mock Test',
    academic_year: '2026-27',
    exam_date: '',
    start_time: '09:00',
    end_time: '10:00',
    duration: '60',
    registration_deadline: '',
    timezone: 'Asia/Kolkata',
    general_instructions: 'Any rules, instructions, or exam notes for students',
    exam_specific_instructions: '',
    required_materials: '',
    rules_and_restrictions: '',
    additional_notes: '',
    classplus_url: 'https://your-classplus-test-link',
    registration_url: '',
    result_url: '',
    action_button_label: 'Register Now',
    is_published: false,
    access_enabled: true,
    display_order: 0,
    is_featured: false,
    status: 'Draft',
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await api.list('admin/exams');
      setItems(rows || []);
    } catch (e) {
      toast({ title: 'Could not load exams', description: e?.response?.data?.detail || e?.message || 'Unknown error' });
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const classOptions = useMemo(() => {
    const values = (items || []).map((item) => item.class_level || item.academic_level).filter(Boolean);
    return ['All classes', ...Array.from(new Set(values))];
  }, [items]);

  const statusOptions = ['All statuses', 'Published', 'Draft', 'Scheduled', 'Registration Open', 'Live', 'Completed', 'Cancelled'];

  const getDisplayStatus = (item) => {
    const status = item?.computed_status || item?.status || '';
    if (status && ['Live', 'Scheduled', 'Completed', 'Cancelled', 'Registration Open'].includes(status)) return status;
    if (item?.is_published) return 'Published';
    return status || 'Draft';
  };

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

  const parseExamDateTime = useCallback((dateValue, timeValue) => {
    if (!dateValue) return null;

    const time = normalizeTimeValue(timeValue || '09:00');
    const isoCandidate = `${String(dateValue).split('T')[0]}T${time}:00+05:30`;
    const parsed = new Date(isoCandidate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, []);

  const getCurrentComputedStatus = useCallback((exam) => {
    if (!exam) return 'Draft';

    const statusRaw = String(exam?.status || '').trim().toLowerCase();
    if (statusRaw === 'cancelled') return 'Cancelled';

    const date = exam?.exam_date;
    const start = exam?.start_time || '09:00';
    const end = exam?.end_time || '10:00';
    const deadline = exam?.registration_deadline;

    if (!date) return statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : 'Draft';

    const startDate = parseExamDateTime(date, start);
    const endDate = parseExamDateTime(date, end);
    const now = new Date();

    if (!startDate || !endDate) {
      return statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : 'Draft';
    }

    if (now < startDate) {
      if (deadline) {
        const deadlineDate = new Date(deadline);
        if (!Number.isNaN(deadlineDate.getTime()) && now <= deadlineDate) return 'Registration Open';
      }
      return 'Scheduled';
    }

    if (now >= startDate && now < endDate) return 'Live';
    return 'Completed';
  }, [parseExamDateTime]);

  const getComputedStatusFromDateTime = useCallback((exam) => {
    const date = exam?.exam_date;
    const start = exam?.start_time || '09:00';
    const end = exam?.end_time || '10:00';
    const deadline = exam?.registration_deadline;
    const statusRaw = String(exam?.status || '').trim().toLowerCase();

    if (statusRaw === 'cancelled') return 'Cancelled';
    if (!date) return statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : 'Draft';

    const startDate = parseExamDateTime(date, start);
    const endDate = parseExamDateTime(date, end);
    const now = new Date();

    if (!startDate || !endDate) {
      return statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : 'Draft';
    }

    if (now < startDate) {
      if (deadline) {
        const deadlineDate = new Date(deadline);
        if (!Number.isNaN(deadlineDate.getTime()) && now <= deadlineDate) return 'Registration Open';
      }
      return 'Scheduled';
    }

    if (now >= startDate && now < endDate) return 'Live';
    return 'Completed';
  }, [parseExamDateTime]);

  const filteredItems = useMemo(() => {
    return (items || []).filter((item) => {
      const examName = (item.exam_name || '').toLowerCase();
      const searchText = search.toLowerCase();
      const matchesSearch = !searchText || examName.includes(searchText) || (item.subject || '').toLowerCase().includes(searchText) || (item.class_level || item.academic_level || '').toLowerCase().includes(searchText);
      const itemClass = item.class_level || item.academic_level || '';
      const matchesClass = classFilter === 'All classes' || itemClass === classFilter;
      const statusValue = getCurrentComputedStatus(item);
      const matchesStatus = statusFilter === 'All statuses' || statusValue === statusFilter;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [items, search, classFilter, statusFilter, getCurrentComputedStatus]);

  const saveExam = async (mode = 'draft') => {
    try {
      const computedStatus = getComputedStatusFromDateTime(editing);
      const payload = {
        ...editing,
        display_order: Number(editing.display_order || 0),
        is_published: mode === 'publish' || Boolean(editing.is_published),
        status: computedStatus,
      };

      if (payload.id) await api.update('admin/exams', payload.id, payload);
      else await api.create('admin/exams', payload);

      toast({ title: mode === 'publish' ? 'Exam published' : 'Exam saved as draft' });
      setEditing(null);
      load();
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'exams' } }));
    } catch (e) {
      toast({ title: 'Could not save exam', description: e?.response?.data?.detail || e?.message || 'Unknown error' });
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    try { await api.remove('admin/exams', id); toast({ title: 'Exam deleted' }); load(); window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'exams' } })); }
    catch (e) { toast({ title: 'Could not delete exam', description: e?.response?.data?.detail || e?.message || 'Unknown error' }); }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCreated = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#F3F6FA] p-0">
      <div className="px-6 py-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-[38px] font-extrabold text-[#0F2A5C] tracking-tight">Published and Draft Exams</h1>
          <Button onClick={() => setEditing({ ...blank })} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold px-4 py-2 rounded-md">
            <Plus size={14} className="mr-2" /> Create Exam
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exam, course, class"
              className="h-11 rounded-md border-slate-200 bg-white pl-10 text-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            </span>
          </div>

          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="h-11 min-w-[150px] rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
            {classOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 min-w-[160px] rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Exam</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Class</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Time</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Classplus URL</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Created</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">No exams found</td>
                </tr>
              )}

              {filteredItems.map((item) => {
                const status = getCurrentComputedStatus(item);
                const statusClass =
                  status === 'Live' ? 'bg-[#fee2e2] text-[#b91c1c]' :
                  status === 'Scheduled' ? 'bg-[#f7d98a] text-[#0F2A5C]' :
                  status === 'Registration Open' ? 'bg-[#dff7e8] text-[#0d7c4b]' :
                  status === 'Completed' ? 'bg-[#e2e8f0] text-[#334155]' :
                  status === 'Cancelled' ? 'bg-[#fce7f3] text-[#9d174d]' :
                  status === 'Published' ? 'bg-[#dff7e8] text-[#0f8a4d]' :
                  status === 'Draft' ? 'bg-[#f3f4f6] text-[#475569]' :
                  'bg-[#f7e4a1] text-[#0F2A5C]';
                return (
                  <tr key={item.id} className="border-t border-slate-200 bg-white hover:bg-slate-50">
                    <td className="px-4 py-4 align-top">
                      <div className="font-bold text-[#0F2A5C]">{item.exam_name || 'Untitled exam'}</div>
                      <div className="mt-1 text-slate-500">{item.subject || 'JEE'}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-slate-700">{item.class_level || item.academic_level || '-'}</div>
                      <div className="text-slate-500">{item.academic_year || '-'}</div>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-700">{formatDate(item.exam_date)}</td>
                    <td className="px-4 py-4 align-top text-slate-700">{item.start_time || '09:00'} - {item.end_time || '10:00'}</td>
                    <td className="px-4 py-4 align-top text-slate-700">{item.classplus_url ? <a href={item.classplus_url} target="_blank" rel="noreferrer" className="text-[#0F2A5C] underline decoration-dotted underline-offset-4">{item.classplus_url}</a> : '-'}</td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${statusClass}`}>{status}</span>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-700">{formatCreated(item.created_at)}</td>
                    <td className="px-4 py-4 align-top text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing({ ...blank, ...item })} className="rounded-md border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100" title="Edit"><Edit size={14} /></button>
                        <button onClick={() => setEditing({ ...blank, ...item })} className="rounded-md border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100" title="Duplicate"><RefreshCw size={14} /></button>
                        <button onClick={() => remove(item.id)} className="rounded-md border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl max-w-4xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold text-[#0F2A5C]">{editing.id ? 'Edit exam' : 'Create exam'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-slate-100"><X size={18}/></button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-xs font-semibold text-slate-600">Exam name</label><Input value={editing.exam_name || ''} onChange={(e) => setEditing((p) => ({ ...p, exam_name: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-slate-600">Class</label><Input value={editing.class_level || ''} onChange={(e) => setEditing((p) => ({ ...p, class_level: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-slate-600">Course / Stream</label><Input value={editing.subject || ''} onChange={(e) => setEditing((p) => ({ ...p, subject: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-slate-600">Exam date</label><Input type="date" value={editing.exam_date || ''} onChange={(e) => setEditing((p) => ({ ...p, exam_date: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-slate-600">Academic year</label><Input value={editing.academic_year || ''} onChange={(e) => setEditing((p) => ({ ...p, academic_year: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-slate-600">Start time</label><Input type="time" value={editing.start_time || '09:00'} onChange={(e) => setEditing((p) => ({ ...p, start_time: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-slate-600">End time</label><Input type="time" value={editing.end_time || '10:00'} onChange={(e) => setEditing((p) => ({ ...p, end_time: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-slate-600">Duration</label><Input value={editing.duration || ''} onChange={(e) => setEditing((p) => ({ ...p, duration: e.target.value }))} /></div>
              <div className="md:col-span-2"><label className="text-xs font-semibold text-slate-600">Classplus URL</label><Input value={editing.classplus_url || ''} onChange={(e) => setEditing((p) => ({ ...p, classplus_url: e.target.value }))} /></div>
              <div className="md:col-span-2"><label className="text-xs font-semibold text-slate-600">Instructions</label><Textarea value={editing.general_instructions || ''} onChange={(e) => setEditing((p) => ({ ...p, general_instructions: e.target.value }))} className="min-h-[120px]" /></div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={() => saveExam('draft')} className="bg-white text-[#0F2A5C] border border-slate-200 hover:bg-slate-100">Save Draft</Button>
              <Button onClick={() => saveExam('publish')} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold">Publish</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

const LectureSubjectManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const blank = { name: '', description: '', thumbnail: '', display_order: 0, is_published: true };

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.list('admin/lecture-subjects')); } catch (e) { toast({ title: 'Could not load subjects', description: e?.response?.data?.detail || e?.message || 'Unknown error' }); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      const payload = { ...editing, display_order: Number(editing.display_order || 0) };
      if (payload.id) await api.update('admin/lecture-subjects', payload.id, payload);
      else await api.create('admin/lecture-subjects', payload);
      toast({ title: 'Subject saved' });
      setEditing(null); load();
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'lecture-subjects' } }));
    } catch (e) { toast({ title: 'Could not save subject', description: e?.response?.data?.detail || e?.message || 'Unknown error' }); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await api.remove('admin/lecture-subjects', id);
      toast({ title: 'Subject deleted' });
      load();
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'lecture-subjects' } }));
    } catch (e) { toast({ title: 'Could not delete subject', description: e?.response?.data?.detail || e?.message || 'Unknown error' }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5"><h1 className="text-2xl font-extrabold text-[#0F2A5C]">Lecture Subjects ({items.length})</h1><Button onClick={() => setEditing({ ...blank })} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold" size="sm"><Plus size={14}/> New</Button></div>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Published</th><th className="text-right p-3">Actions</th></tr></thead><tbody>{items.length===0 && <tr><td colSpan={3} className="p-8 text-center text-slate-400">No subjects yet</td></tr>}{items.map((i) => (<tr key={i.id} className="border-t hover:bg-slate-50"><td className="p-3 font-medium text-[#0F2A5C]">{i.name}</td><td className="p-3">{i.is_published ? 'Yes' : 'No'}</td><td className="p-3 text-right"><button onClick={() => setEditing({ ...blank, ...i })} className="p-1.5 rounded hover:bg-slate-100"><Edit size={14}/></button><button onClick={() => remove(i.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600 ml-1"><Trash2 size={14}/></button></td></tr>))}</tbody></table>
      </div>
      {editing && <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}><div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl max-w-2xl w-full p-6 my-8"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-extrabold text-[#0F2A5C]">{editing.id ? 'Edit subject' : 'New subject'}</h3><button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-slate-100"><X size={18}/></button></div><div className="space-y-4"><div><label className="text-xs font-semibold text-slate-600">Name</label><Input value={editing.name || ''} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} /></div><div><label className="text-xs font-semibold text-slate-600">Description</label><Textarea value={editing.description || ''} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} className="min-h-[100px]" /></div><div><label className="text-xs font-semibold text-slate-600">Thumbnail URL</label><Input value={editing.thumbnail || ''} onChange={(e) => setEditing((p) => ({ ...p, thumbnail: e.target.value }))} /></div><div className="grid sm:grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-600">Display order</label><Input type="number" value={editing.display_order || 0} onChange={(e) => setEditing((p) => ({ ...p, display_order: Number(e.target.value || 0) }))} /></div><div className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2 h-10"><span className="text-sm font-medium text-slate-700">Published</span><input type="checkbox" checked={Boolean(editing.is_published)} onChange={(e) => setEditing((p) => ({ ...p, is_published: e.target.checked }))} /></div></div>{(editing.thumbnail || '').trim() && <img src={resolveMediaThumb(editing.thumbnail)} alt="Subject preview" className="h-28 w-auto object-cover rounded-md border" />}</div><div className="flex justify-end gap-2 mt-6"><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold"><Save size={14}/> Save</Button></div></div></div>}
    </div>
  );
};

const LectureManager = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const blank = { subject_id: '', subject_name: '', class_level: '11th', title: '', lecture_topic: '', chapter_or_unit: '', description: '', instructor_name: '', lecture_date: '', thumbnail_url: '', video_url: '', duration: '', language: 'English', is_published: true, display_order: 0 };

  const getLectureThumb = (lecture) => {
    if ((lecture?.thumbnail_url || '').trim()) return resolveMediaThumb(lecture.thumbnail_url);
    if ((lecture?.video_url || '').trim()) return resolveMediaThumb(lecture.video_url);
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [subs, lectures] = await Promise.all([
        api.list('admin/lecture-subjects'),
        api.list('admin/lectures'),
      ]);
      setSubjects(subs || []);
      setItems(lectures || []);
    } catch (e) { toast({ title: 'Could not load lectures', description: e?.response?.data?.detail || e?.message || 'Unknown error' }); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      const payload = { ...editing, display_order: Number(editing.display_order || 0), subject_name: subjects.find((s) => s.id === editing.subject_id)?.name || editing.subject_name || '' };
      if (payload.id) await api.update('admin/lectures', payload.id, payload);
      else await api.create('admin/lectures', payload);
      toast({ title: 'Lecture saved' });
      setEditing(null); load();
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'lectures' } }));
    } catch (e) { toast({ title: 'Could not save lecture', description: e?.response?.data?.detail || e?.message || 'Unknown error' }); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this lecture?')) return;
    try {
      await api.remove('admin/lectures', id);
      toast({ title: 'Lecture deleted' });
      load();
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'lectures' } }));
    } catch (e) { toast({ title: 'Could not delete lecture', description: e?.response?.data?.detail || e?.message || 'Unknown error' }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5"><h1 className="text-2xl font-extrabold text-[#0F2A5C]">Lectures ({items.length})</h1><Button onClick={() => setEditing({ ...blank, subject_id: subjects[0]?.id || '' })} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold" size="sm"><Plus size={14}/> New</Button></div>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="text-left p-3">Title</th><th className="text-left p-3">Subject</th><th className="text-left p-3">Published</th><th className="text-right p-3">Actions</th></tr></thead><tbody>{items.length===0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">No lectures yet</td></tr>}{items.map((i) => (<tr key={i.id} className="border-t hover:bg-slate-50"><td className="p-3 font-medium text-[#0F2A5C]">{i.title}</td><td className="p-3">{i.subject_name || '-'}</td><td className="p-3">{i.is_published ? 'Yes' : 'No'}</td><td className="p-3 text-right"><button onClick={() => setEditing({ ...blank, ...i })} className="p-1.5 rounded hover:bg-slate-100"><Edit size={14}/></button><button onClick={() => remove(i.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600 ml-1"><Trash2 size={14}/></button></td></tr>))}</tbody></table>
      </div>
      {editing && <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}><div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl max-w-2xl w-full p-6 my-6"><div className="mb-5 flex items-center justify-between"><div><div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-400">Video Lectures</div><h3 className="mt-1 text-3xl font-extrabold text-[#0F2A5C]">{editing.id ? 'Edit Lecture' : 'Create Lecture'}</h3></div><button onClick={() => setEditing(null)} className="p-2 rounded-md hover:bg-slate-100"><X size={18}/></button></div><div className="space-y-4"><div className="grid sm:grid-cols-2 gap-4"><div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Class</label><select value={editing.class_level || '11th'} onChange={(e) => setEditing((p) => ({ ...p, class_level: e.target.value }))} className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"><option value="11th">11th</option><option value="12th">12th</option><option value="Foundation">Foundation</option><option value="JEE">JEE</option><option value="NEET">NEET</option></select></div><div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Subject</label><select value={editing.subject_id || ''} onChange={(e) => setEditing((p) => ({ ...p, subject_id: e.target.value, subject_name: subjects.find((s) => s.id === e.target.value)?.name || '' }))} className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"><option value="">Select subject</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div></div><div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Lecture Title</label><Input value={editing.title || ''} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))} className="h-11 rounded-md border-slate-200 bg-slate-50 text-base" /></div><div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">YouTube URL</label><Input value={editing.video_url || ''} onChange={(e) => setEditing((p) => ({ ...p, video_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="h-11 rounded-md border-slate-200 bg-slate-50 text-base" /></div>{(editing.video_url || editing.thumbnail_url) && <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Video Preview</div><img src={getLectureThumb(editing)} alt={editing.title || 'Lecture preview'} className="h-40 w-full rounded-md object-cover" /></div>}<div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Description</label><Textarea value={editing.description || ''} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} className="min-h-[120px] rounded-md border-slate-200 bg-slate-50 text-base" /></div><div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Publication Status</label><select value={editing.is_published ? 'Published' : 'Draft'} onChange={(e) => setEditing((p) => ({ ...p, is_published: e.target.value === 'Published' }))} className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"><option value="Draft">Draft</option><option value="Published">Published</option></select></div><div><label className="text-xs font-semibold text-slate-600">Lecture date</label><Input type="date" value={editing.lecture_date || ''} onChange={(e) => setEditing((p) => ({ ...p, lecture_date: e.target.value }))} /></div><div><label className="text-xs font-semibold text-slate-600">Duration</label><Input value={editing.duration || ''} onChange={(e) => setEditing((p) => ({ ...p, duration: e.target.value }))} /></div><div><label className="text-xs font-semibold text-slate-600">Video URL</label><Input value={editing.video_url || ''} onChange={(e) => setEditing((p) => ({ ...p, video_url: e.target.value }))} /></div><div><label className="text-xs font-semibold text-slate-600">Thumbnail URL</label><Input value={editing.thumbnail_url || ''} onChange={(e) => setEditing((p) => ({ ...p, thumbnail_url: e.target.value }))} /></div><div><label className="text-xs font-semibold text-slate-600">Display order</label><Input type="number" value={editing.display_order || 0} onChange={(e) => setEditing((p) => ({ ...p, display_order: Number(e.target.value || 0) }))} /></div><div className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2 h-10"><span className="text-sm font-medium text-slate-700">Published</span><input type="checkbox" checked={Boolean(editing.is_published)} onChange={(e) => setEditing((p) => ({ ...p, is_published: e.target.checked }))} /></div><div className="md:col-span-2"><label className="text-xs font-semibold text-slate-600">Description</label><Textarea value={editing.description || ''} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} className="min-h-[100px]" /></div></div><div className="flex justify-end gap-2 mt-6"><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold"><Save size={14}/> Save</Button></div></div></div>}</div>
  );
};

const AdminContent = ({ path }) => {
  const schema = SCHEMAS[path];
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.list(path)); } finally { setLoading(false); }
  }, [path]);

  useEffect(() => {
    if (path === 'site-settings' || path === 'videos') return;
    load();
  }, [path, load]);

  if (path === 'site-settings') return <SiteSettingsEditor />;
  if (path === 'videos') return <VideoGalleryManager />;
  if (path === 'exams') return <ExamManager />;
  if (path === 'lectures') return <LectureManager />;

  const save = async () => {
    const payload = { ...editing };
    // convert tags fields
    schema.fields.forEach(([k, _, t]) => {
      if (t === 'tags' && typeof payload[k] === 'string') {
        payload[k] = payload[k].split(',').map(s=>s.trim()).filter(Boolean);
      }
      if (t === 'number') payload[k] = Number(payload[k]) || 0;
    });
    try {
      if (payload.id) await api.update(path, payload.id, payload);
      else await api.create(path, payload);
      toast({ title: 'Saved' });
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path } }));
      setEditing(null);
      load();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) toast({ title: 'Session expired', description: 'Please sign in again.' });
      else toast({ title: 'Error saving', description: e?.response?.data?.detail || e?.message || 'Unknown error' });
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.remove(path, id);
      setRows(rs => rs.filter(r => r.id !== id));
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path } }));
      toast({ title: 'Deleted' });
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) toast({ title: 'Session expired', description: 'Please sign in again.' });
      else toast({ title: 'Could not delete', description: e?.response?.data?.detail || e?.message });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-extrabold text-[#0F2A5C]">{schema.label} ({rows.length})</h1>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm" disabled={loading}><RefreshCw size={14} className={loading?'animate-spin':''}/></Button>
          <Button onClick={() => setEditing({ ...schema.blank })} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold" size="sm"><Plus size={14}/> New</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              {schema.cols.map((c) => <th key={c} className="text-left p-3 text-xs uppercase tracking-wider text-slate-500">{c}</th>)}
              <th className="text-right p-3 text-xs uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={schema.cols.length + 1} className="p-8 text-center text-slate-400">No items — click <b>New</b> to add</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-slate-50">
                {schema.cols.map((c) => (
                  <td key={c} className="p-3 max-w-[220px] truncate">{Array.isArray(r[c]) ? r[c].join(', ') : (r[c] ?? '—')}</td>
                ))}
                <td className="p-3 text-right">
                  <button onClick={()=>setEditing({ ...schema.blank, ...r, highlights: (r.highlights||[]).join(', '), subjects: (r.subjects||[]).join(', ') })} className="p-1.5 rounded hover:bg-slate-100" title="Edit"><Edit size={14}/></button>
                  <button onClick={()=>remove(r.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600 ml-1" title="Delete"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setEditing(null)}>
          <div onClick={e=>e.stopPropagation()} className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold text-[#0F2A5C]">{editing.id ? 'Edit' : 'New'} {schema.label.slice(0,-1)}</h3>
              <button onClick={()=>setEditing(null)} className="p-1 rounded hover:bg-slate-100"><X size={18}/></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {schema.fields.map(([k, label, type]) => {
                const wide = type === 'textarea' || type === 'tags' || type === 'image' ? 'sm:col-span-2' : '';
                const val = editing[k] ?? '';
                if (type === 'image') return (
                  <div key={k} className={wide}>
                    <ImageUploadField label={label} value={val} onChange={(u) => setEditing(p => ({...p, [k]: u}))}/>
                  </div>
                );
                if (type === 'textarea') return (
                  <div key={k} className={wide}>
                    <label className="text-xs font-semibold text-slate-600">{label}</label>
                    <Textarea className="min-h-[100px]" value={val} onChange={e=>setEditing(p=>({...p,[k]:e.target.value}))}/>
                  </div>
                );
                return (
                  <div key={k} className={wide}>
                    <label className="text-xs font-semibold text-slate-600">{label}</label>
                    <Input type={type === 'number' ? 'number' : 'text'} value={val} onChange={e=>setEditing(p=>({...p,[k]:e.target.value}))}/>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button>
              <Button onClick={save} className="bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold"><Save size={14}/> Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
