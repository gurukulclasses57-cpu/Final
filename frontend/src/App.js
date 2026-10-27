import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './auth/AuthContext';
import api from './api';
import { SITE, hydrateSiteSettings } from './mock';

import Home from './pages/Home';
import About from './pages/About';
import { CoursesList, CourseDetail } from './pages/Courses';
import Exams from './pages/Exams';
import Lectures from './pages/Lectures';
import Results from './pages/Results';
import Faculty from './pages/Faculty';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import { BlogsList, BlogDetail } from './pages/Blogs';
import Contact from './pages/Contact';
import Admission from './pages/Admission';
import Scholarship from './pages/Scholarship';
import Franchise from './pages/Franchise';
import Career from './pages/Career';
import { Privacy, Terms } from './pages/Legal';
import AdminLayout from './pages/admin/AdminLayout';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
    <FloatingButtons />
  </>
);

function App() {
  const [, forceUpdate] = React.useState(0);

  useEffect(() => {
    const refreshSiteSettings = () => forceUpdate((v) => v + 1);
    const handleStorageRefresh = (event) => {
      if (event.key === 'gurukul-content-updated') {
        refreshSiteSettings();
      }
    };

    window.addEventListener('site-settings-changed', refreshSiteSettings);
    window.addEventListener('content-updated', refreshSiteSettings);
    window.addEventListener('storage', handleStorageRefresh);

    let active = true;
    const loadSiteSettings = async () => {
      try {
        const rows = await api.list('site-settings');
        if (!active || !Array.isArray(rows)) return;
        const map = Object.fromEntries((rows || []).map((row) => [row.key, row.value]));
        const siteName = (map.site_name || SITE.name);
        const safeSiteName = /nj\s*edu[- ]?hub/i.test(siteName) ? SITE.name : siteName;
        hydrateSiteSettings({
          name: safeSiteName,
          tagline: map.tagline || SITE.tagline,
          phone: map.phone || SITE.phone,
          whatsapp: map.whatsapp || SITE.whatsapp,
          email: map.email || SITE.email,
          address: map.address || SITE.address,
          footer_tagline: map.footer_tagline || SITE.footer_tagline,
          footer_description: map.footer_description || SITE.footer_description,
          footer_copyright: map.footer_copyright || SITE.footer_copyright,
          footer_privacy_text: map.footer_privacy_text || SITE.footer_privacy_text,
          footer_terms_text: map.footer_terms_text || SITE.footer_terms_text,
          social_facebook: map.social_facebook || SITE.social_facebook,
          social_instagram: map.social_instagram || SITE.social_instagram,
          social_youtube: map.social_youtube || SITE.social_youtube,
          social_twitter: map.social_twitter || SITE.social_twitter,
          social_linkedin: map.social_linkedin || SITE.social_linkedin,
          logo: map.logo || SITE.logo,
          logo_width: map.logo_width || SITE.logo_width,
          logo_height: map.logo_height || SITE.logo_height,
        });
      } catch (err) {
        console.warn('Site settings unavailable:', err);
      }
    };

    loadSiteSettings();
    return () => {
      active = false;
      window.removeEventListener('site-settings-changed', refreshSiteSettings);
      window.removeEventListener('content-updated', refreshSiteSettings);
      window.removeEventListener('storage', handleStorageRefresh);
    };
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin-x9k2/*" element={<AdminLayout />} />
          <Route path="/*" element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<CoursesList />} />
                <Route path="/courses/:slug" element={<CourseDetail />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/lectures" element={<Lectures />} />
                <Route path="/results" element={<Results />} />
                <Route path="/faculty" element={<Faculty />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/blogs" element={<BlogsList />} />
                <Route path="/blogs/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admission" element={<Admission />} />
                <Route path="/scholarship" element={<Scholarship />} />
                <Route path="/franchise" element={<Franchise />} />
                <Route path="/career" element={<Career />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
        <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
