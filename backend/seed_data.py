# Seed initial mock data into MongoDB
import uuid
from datetime import datetime

def _id(): return str(uuid.uuid4())
def _ts(): return datetime.utcnow().isoformat()

COURSES = [
    {'slug':'jee','title':'JEE (Mains + Advanced)','duration':'2 Years','audience':'Std. 11 & 12','price':'₹1,85,000','short':'Comprehensive 2-year program for JEE Mains, JEE Advanced, MHT-CET','image':'https://images.unsplash.com/photo-1581726707445-75cbe4efc586?auto=format&fit=crop&w=1200&q=80','highlights':['Hybrid Mode','AI Test Analytics','Doubt Solving 7-days','Hi-Tech Classrooms'],'subjects':['Physics','Chemistry','Mathematics'],'detail':'A meticulously structured 2-year program preparing students for JEE Mains, JEE Advanced and MHT-CET. Includes 3D testing system, AI-driven analytics, and feedback-led mentoring.','is_active':True},
    {'slug':'neet','title':'NEET (PCB)','duration':'2 Years','audience':'Std. 11 & 12','price':'₹1,75,000','short':'Complete medical entrance preparation for NEET, MHT-CET (PCB), CET Pharmacy and IAT','image':'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80','highlights':['Biology Lab','Daily Practice Problems','Doctor Mentors','NCERT-mapped Notes'],'subjects':['Physics','Chemistry','Biology'],'detail':'A focused medical entrance preparation program designed by AIIMS and top medical college alumni — covering NEET, MHT-CET, IAT and CET Pharmacy.','is_active':True},
    {'slug':'foundation','title':'Foundation Program','duration':'1 Year (renewable)','audience':'Std. 5 to Std. 10','price':'₹45,000','short':'Fun-to-learn IIT / NEET foundation curriculum that builds rock-solid fundamentals','image':'https://images.pexels.com/photos/3231358/pexels-photo-3231358.jpeg?auto=compress&w=1200','highlights':['Olympiad Training','NTSE / KVPY Track','Conceptual Clarity','Story-led Pedagogy'],'subjects':['Maths','Science','Mental Ability'],'detail':'Early foundation for serious aspirants. Curriculum builds conceptual clarity, problem solving and curiosity for science & maths.','is_active':True},
    {'slug':'test-series','title':'AI Test Series','duration':'Flexible (3 / 6 / 12 months)','audience':'All XI / XII / Droppers','price':'₹9,999','short':'Offline & Online tests with AI analytics for JEE, NEET, CET, BITSAT, VITEEE','image':'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80','highlights':['Adaptive Tests','AIR Predictor','Topic-Level Insights','Live Leaderboard'],'subjects':['PCM / PCB / PCMB'],'detail':'Adaptive question patterns, granular subject-topic-difficulty heatmaps and rank prediction trained on lakhs of attempts.','is_active':True},
    {'slug':'crash-course','title':'Crash Course (Final Lap)','duration':'90 Days','audience':'Std. 12 / Droppers','price':'₹35,000','short':'Intense revision sprint with 60+ full-length mocks and topper masterclasses','image':'https://images.unsplash.com/photo-1570616969692-54d6ba3d0397?auto=format&fit=crop&w=1200&q=80','highlights':['60+ Mocks','Topper Masterclasses','Formula Marathons','Stress Management'],'subjects':['PCM / PCB'],'detail':'High-intensity 90 day plan engineered around revision, mock tests, exam temperament and stress management.','is_active':True},
    {'slug':'olympiad','title':'Olympiad Excellence','duration':'Year-long','audience':'Std. 6 to Std. 10','price':'₹22,000','short':'NTSE, KVPY, IMO, IPhO, IChO and HBCSE Olympiad preparation','image':'https://images.unsplash.com/photo-1518781286387-9866dc04fb01?auto=format&fit=crop&w=1200&q=80','highlights':['IMO / IPhO / IChO','Concept Marathons','Research Projects','STEM Mentors'],'subjects':['Maths / Physics / Chemistry'],'detail':'Specialised Olympiad track focused on advanced problem solving, research thinking and competitive temperament.','is_active':True},
]

FACULTY = [
    {'name':'Dr. Ramesh Patil','subject':'Physics','exp':'22 yrs','img':'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&w=400&q=80','credentials':'PhD IIT Bombay','bio':'A passionate physicist with 22 years of teaching JEE Physics, known for crystal-clear conceptual lectures.'},
    {'name':'Prof. Anita Deshmukh','subject':'Chemistry','exp':'18 yrs','img':'https://images.unsplash.com/photo-1580894732930-0babd100d356?auto=format&fit=crop&w=400&q=80','credentials':'M.Sc IIT Kanpur','bio':'Specialist in Organic Chemistry. Known for analogy-based teaching that demystifies reaction mechanisms.'},
    {'name':'Mr. Suresh Iyer','subject':'Mathematics','exp':'25 yrs','img':'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80','credentials':'B.Tech IIT Madras','bio':'Calculus and Algebra wizard, mentor to 6 JEE AIR Top-100 students.'},
    {'name':'Dr. Meera Joshi','subject':'Biology','exp':'20 yrs','img':'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=400&q=80','credentials':'MBBS, MD AIIMS','bio':'NEET Biology mentor and former AIIMS researcher. Authored 4 NEET reference books.'},
    {'name':'Mr. Vikram Singh','subject':'Physics','exp':'15 yrs','img':'https://images.unsplash.com/photo-1580894732930-0babd100d356?auto=format&fit=crop&w=400&q=80','credentials':'M.Tech IIT Delhi','bio':'Specialist in Mechanics & Electrodynamics. Known for storytelling-led teaching of difficult concepts.'},
    {'name':'Mrs. Kavita Rao','subject':'Chemistry','exp':'14 yrs','img':'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=400&q=80','credentials':'M.Sc Chemistry','bio':'Physical Chemistry expert with a knack for shortcut techniques and exam-temperament training.'},
    {'name':'Mr. Arjun Kale','subject':'Mathematics','exp':'12 yrs','img':'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&w=400&q=80','credentials':'B.Tech IIT Roorkee','bio':'Coordinate Geometry & Probability mentor. Trains students for Olympiads & JEE Advanced.'},
    {'name':'Dr. Sneha Kulkarni','subject':'Biology','exp':'17 yrs','img':'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80','credentials':'PhD Biotechnology','bio':'Botany & Zoology expert; ensures NCERT line-by-line mastery for NEET aspirants.'},
]

TOPPERS = [
    {'name':'Sara Shukla','rank':'ISC TOPPER','score':'99%','img':'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Simar Singh','rank':'XII','score':'97.8%','img':'https://images.pexels.com/photos/31968811/pexels-photo-31968811.jpeg?auto=compress&w=400','year':2026},
    {'name':'Raj Sen','rank':'XII','score':'95.5%','img':'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Atharva Shukla','rank':'XII','score':'95.2%','img':'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Ronan Verghese','rank':'XII','score':'93.6%','img':'https://images.unsplash.com/photo-1580894732930-0babd100d356?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Nachiket Morabkar','rank':'XII','score':'93.4%','img':'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Ananya Badkundri','rank':'XII','score':'93%','img':'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Kushal Tashildar','rank':'XII','score':'92.3%','img':'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Aaron Mathew','rank':'XII','score':'92%','img':'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=400&q=80','year':2026},
    {'name':'Arnav Raut','rank':'XII','score':'91.4%','img':'https://images.unsplash.com/photo-1580894732930-0babd100d356?auto=format&fit=crop&w=400&q=80','year':2026},
]

RESULTS = [
    {'year':2025,'name':'Utkarsh Patil','rank':'AIR 879','exam':'JEE Advanced','college':'IIT Bombay'},
    {'year':2025,'name':'Pairavi Kulkarni','rank':'AIR 430','exam':'JEE Advanced','college':'IIT Madras'},
    {'year':2025,'name':'Bhavesh Patil','rank':'99.9 %ile','exam':'JEE Mains','college':'BITS Pilani'},
    {'year':2024,'name':'Sutanu Navare','rank':'AIR 1124','exam':'JEE Advanced','college':'IIT Kanpur'},
    {'year':2023,'name':'Darsh Patel','rank':'AIR 612','exam':'JEE Advanced','college':'IIT Bombay'},
    {'year':2023,'name':'Tejas Lohia','rank':'AIR 1450','exam':'JEE Advanced','college':'IIT Gandhinagar'},
    {'year':2022,'name':'Adwait Jog','rank':'AIR 980','exam':'JEE Advanced','college':'IIT Kanpur'},
    {'year':2021,'name':'Priyanka Date','rank':'Pune Girls Topper','exam':'JEE Mains','college':'IIT Madras'},
    {'year':2016,'name':'Abhishek Kulkarni','rank':'AIR 537','exam':'JEE Advanced','college':'IIT Bombay'},
    {'year':2015,'name':'Sankalp Gaur','rank':'AIR 1','exam':'JEE Mains','college':'IIT Bombay'},
]

TESTIMONIALS = [
    {'name':'Utkarsh Patil','rank':'AIR 879 — JEE Advanced 2025','img':'https://images.unsplash.com/photo-1580894732930-0babd100d356?auto=format&fit=crop&w=300&q=80','text':'The structured approach and regular testing here kept me consistent and focused. The mentors and the doubt-solving culture made the real difference for me.'},
    {'name':'Pairavi Kulkarni','rank':'AIR 430 — JEE Advanced 2025','img':'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=300&q=80','text':'What sets NJ Edu-Hub apart is personalised attention. Even in tough phases my mentors made sure I never lost confidence in my own ability.'},
    {'name':'Bhavesh Patil','rank':'99.9 percentile — JEE Mains 2025','img':'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=300&q=80','text':'I joined in Class 11 and the two-year journey was a game changer. Test series, concept-clarity sessions and a strong peer group pushed my limits.'},
    {'name':'Sutanu Navare','rank':'JEE Advanced Qualified','img':'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&w=300&q=80','text':'I did not take JEE seriously at first, but the mentorship here completely transformed my outlook. Today I am studying at a top IIT.'},
    {'name':'Darsh Patel','rank':'IIT Bombay — GM 2023','img':'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=300&q=80','text':'Thank you for all the guidance through my JEE journey. It felt not just possible — it felt achievable. Truly world-class education.'},
    {'name':'Priyanka Date','rank':'Pune Girls JEE Topper — IIT Madras','img':'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=300&q=80','text':'Seminars, anecdotes from teachers and AI testing methods made me believe my JEE goal was easy, not difficult. Forever grateful!'},
]

BLOGS = [
    {'slug':'jee-2026-strategy','title':'JEE 2026: The 12-Month Strategy That Actually Works','excerpt':'A practical, week-by-week framework for serious JEE 2026 aspirants — built from data of 1400+ successful students.','date':'10 Jul 2025','author':'Prof. Anita Deshmukh','category':'JEE','cover':'https://images.unsplash.com/photo-1581726707445-75cbe4efc586?auto=format&fit=crop&w=1200&q=80','body':'Mastering JEE is rarely about studying more — it is about studying right. In this article we break down a calendar that has consistently produced top-1000 ranks at NJ Edu-Hub.\n\nMonth 0–3: Build conceptual depth. Month 3–6: Bridge to advanced application. Month 6–9: Mock-test intensive. Month 9–12: Revision, simulation, mental stamina.'},
    {'slug':'neet-biology-mistakes','title':'5 Biology Mistakes Most NEET Aspirants Repeat','excerpt':'Biology is high-yield but unforgiving. These are the 5 patterns we see students slip on — and how to fix them.','date':'04 Jul 2025','author':'Dr. Meera Joshi','category':'NEET','cover':'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80','body':'NEET Biology should be your highest-scoring section. Most students leak marks here because of 5 specific habits — over-reading, under-revising, late NCERT, ignoring diagrams, and skipping previous-year tests.'},
    {'slug':'foundation-vs-coaching','title':'Foundation vs Direct Coaching — What Really Helps?','excerpt':'Should a Std. 8 student start IIT foundation, or wait till Std. 11? Data, parent stories and a clear answer.','date':'28 Jun 2025','author':'Mr. Suresh Iyer','category':'Foundation','cover':'https://images.unsplash.com/photo-1518781286387-9866dc04fb01?auto=format&fit=crop&w=1200&q=80','body':'A serious foundation program does not steal childhood — done right, it returns it. We share data from 5-year cohorts and conclude with a balanced answer for parents.'},
    {'slug':'ai-testing-future','title':'How AI is Quietly Rewriting Test Preparation','excerpt':'Adaptive testing, error-pattern recognition, rank prediction — the future of test prep is data-rich and student-centric.','date':'20 Jun 2025','author':'Mr. Arjun Kale','category':'EdTech','cover':'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80','body':'AI testing engines no longer simply grade — they diagnose. We share a peek into our own engine and how it shaved 18% off learning time for the 2025 batch.'},
]

NEWS = [
    {'title':'Admissions Open — 2-Year GRANDMASTERS 2027','date':'12 Jul 2025','img':'https://images.unsplash.com/photo-1570616969692-54d6ba3d0397?auto=format&fit=crop&w=600&q=80','desc':'XI + XII + MHT-CET + JEE Mains + JEE Advanced program for Std. 10 pass-outs.'},
    {'title':'NEET 2027 Top Doctors Program Now Open','date':'06 Jul 2025','img':'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80','desc':'Two-year focused PCB program with daily AIIMS-style problem solving.'},
    {'title':'1-Year FOUNDATION 2026-27 Batch Begins Aug','date':'01 Jul 2025','img':'https://images.unsplash.com/photo-1518781286387-9866dc04fb01?auto=format&fit=crop&w=600&q=80','desc':'Fun-to-learn early foundation for Std. 5 to Std. 10 — Olympiad + School + Mental Ability.'},
    {'title':'Free Scholarship Test — Register Now','date':'24 Jun 2025','img':'https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&w=600','desc':'Up to 100% scholarship for talented aspirants. Online & Offline modes available.'},
]

VIDEOS = [
    {'title':'Campus Tour 2025', 'video_url':'https://www.youtube.com/watch?v=ScMzIvxBSi4', 'description':'A quick campus walk-through showing classrooms, labs, and student spaces.', 'category':'Campus Tour', 'display_order':1, 'is_published':True, 'is_featured':True, 'show_on_homepage':True, 'thumbnail_url':'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg'},
    {'title':'Mentor Connect', 'video_url':'https://www.youtube.com/watch?v=ysz5S6PUM-U', 'description':'Students speak about one-on-one mentorship, support, and academic guidance.', 'category':'Student Stories', 'display_order':2, 'is_published':True, 'is_featured':False, 'show_on_homepage':True, 'thumbnail_url':'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg'},
    {'title':'Learning Environment', 'video_url':'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 'description':'A walkthrough of our peer-learning culture, digital labs, and mentoring systems.', 'category':'Academics', 'display_order':3, 'is_published':True, 'is_featured':False, 'show_on_homepage':True, 'thumbnail_url':'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg'},
]

LECTURE_SUBJECTS = [
    {'name':'Physics', 'slug':'physics', 'description':'Problem-solving and conceptual clarity for mechanics, electrostatics, optics and modern physics.', 'thumbnail':'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80', 'is_published':True, 'display_order':1},
    {'name':'Chemistry', 'slug':'chemistry', 'description':'Organic, physical and inorganic chemistry video support for board and entrance preparation.', 'thumbnail':'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80', 'is_published':True, 'display_order':2},
    {'name':'Mathematics', 'slug':'mathematics', 'description':'Concept lectures and formula-based problem solving for algebra, calculus and coordinate geometry.', 'thumbnail':'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80', 'is_published':True, 'display_order':3},
]

LECTURES = [
    {
        'subject_name': 'Physics',
        'class_level': '11th',
        'title': 'Vectors and Motion Basics',
        'lecture_topic': 'Kinematics',
        'chapter_or_unit': 'Chapter 1',
        'description': 'Core concepts of vectors, displacement, velocity and motion with quick solved examples for competitive exams.',
        'instructor_name': 'Dr. Ramesh Patil',
        'lecture_date': '2026-10-27',
        'thumbnail_url': 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg',
        'video_url': 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        'duration': '18 mins',
        'language': 'English',
        'is_published': True,
        'display_order': 1,
    },
    {
        'subject_name': 'Chemistry',
        'class_level': '12th',
        'title': 'Organic Chemistry Fundamentals',
        'lecture_topic': 'Reaction Mechanisms',
        'chapter_or_unit': 'Chapter 3',
        'description': 'Understand major reaction pathways, electron movement and exam-focused shortcuts in organic chemistry.',
        'instructor_name': 'Prof. Anita Deshmukh',
        'lecture_date': '2026-10-28',
        'thumbnail_url': 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg',
        'video_url': 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        'duration': '22 mins',
        'language': 'English',
        'is_published': True,
        'display_order': 2,
    },
    {
        'subject_name': 'Mathematics',
        'class_level': '11th',
        'title': 'Trigonometry Crash Course',
        'lecture_topic': 'Functions and Identities',
        'chapter_or_unit': 'Chapter 2',
        'description': 'Short, revision-friendly trigonometry class with formulas, special angles and problem patterns.',
        'instructor_name': 'Mr. Suresh Iyer',
        'lecture_date': '2026-10-29',
        'thumbnail_url': 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
        'video_url': 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        'duration': '17 mins',
        'language': 'English',
        'is_published': True,
        'display_order': 3,
    },
]

GALLERY = [
    'https://images.unsplash.com/photo-1581726707445-75cbe4efc586?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1570616969692-54d6ba3d0397?auto=format&fit=crop&w=900&q=80',
    'https://images.pexels.com/photos/35865722/pexels-photo-35865722.jpeg?auto=compress&w=900',
    'https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&w=900',
    'https://images.pexels.com/photos/3231358/pexels-photo-3231358.jpeg?auto=compress&w=900',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1561379982-c9f0e54ff067?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518781286387-9866dc04fb01?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
    'https://images.pexels.com/photos/31968811/pexels-photo-31968811.jpeg?auto=compress&w=900',
]

BANNERS = [
    {'title':'Stress-Free Inclusive Coaching','subtitle':'A nurturing environment that prioritises learning over pressure','image':'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80','cta':'Explore Programs','link':'/courses','order':1,'is_active':True},
    {'title':'Excellent College Placements','subtitle':'1400+ IIT-JEE Ranks across 23 years of relentless mentorship','image':'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1600&q=80','cta':'View Results','link':'/results','order':2,'is_active':True},
    {'title':'Highest Success Ratio','subtitle':'AI-driven analytics, small batches, personal mentoring','image':'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80','cta':'Why NJ Edu-Hub?','link':'/about','order':3,'is_active':True},
    {'title':'Small Batch Sizes','subtitle':'Personalised attention for every single student','image':'https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&w=1600','cta':'Apply Now','link':'/admission','order':4,'is_active':True},
]

COUNTERS = [
    {'value': 18, 'prefix': '', 'suffix': '+', 'label': 'Years of Excellence'},
    {'value': 1400, 'prefix': '', 'suffix': '+', 'label': 'IIT-JEE Ranks'},
    {'value': 96, 'prefix': '', 'suffix': '%', 'label': 'Board Results'},
    {'value': 25, 'prefix': '', 'suffix': 'K+', 'label': 'Students mentored'},
]

FAQS = [
    {'question': 'What courses do you offer?', 'answer': 'We offer JEE, NEET, Foundation, Olympiad, and crash courses for school students and droppers.'},
    {'question': 'Do you provide scholarships?', 'answer': 'Yes. We run scholarship tests and merit-based fee waivers across selected programs.'},
    {'question': 'How are batches structured?', 'answer': 'Batches are intentionally small and divided by ability level, subject focus, and mentorship requirements.'},
    {'question': 'Is there support for doubt solving?', 'answer': 'Yes. Every student receives daily doubt-solving support, tests, and mentor feedback.'},
]

PROGRAMS_STRIP = [
    {'code': 'JEE', 'title': 'JEE (Mains + Advanced)', 'sub': 'For Std. 11 & 12', 'desc': 'Rigorous coaching with AI test analytics and mentoring.', 'href': '/courses'},
    {'code': 'NEET', 'title': 'NEET (PCB)', 'sub': 'Medical entrance track', 'desc': 'Complete preparation for medical aspirants with test practice and guidance.', 'href': '/courses'},
    {'code': 'FOUNDATION', 'title': 'Foundation Program', 'sub': 'For Std. 5 to 10', 'desc': 'Concept clarity and strong fundamentals for future competitive exams.', 'href': '/courses'},
]

WHY_US = [
    {'icon': 'Sparkles', 'title': 'Concept-first teaching', 'desc': 'We prioritize understanding over rote memorization and encourage lasting learning.'},
    {'icon': 'Users', 'title': 'Personal mentoring', 'desc': 'Students get regular guidance, parent updates, and tailored academic support.'},
    {'icon': 'TrendingUp', 'title': 'Data-backed analytics', 'desc': 'AI testing and analytics help students improve with clarity and consistency.'},
    {'icon': 'ShieldCheck', 'title': 'Proven success culture', 'desc': 'Our learning environment is built around discipline, reflection, and measurable results.'},
]

CENTRES = [
    {'name': 'Pune Main Centre', 'city': 'Pune', 'address': 'Baner Road, Pune, Maharashtra'},
    {'name': 'Nagpur Centre', 'city': 'Nagpur', 'address': 'Dhantoli, Nagpur, Maharashtra'},
    {'name': 'Nashik Centre', 'city': 'Nashik', 'address': 'College Road, Nashik, Maharashtra'},
    {'name': 'Kolhapur Centre', 'city': 'Kolhapur', 'address': 'Tarabai Park, Kolhapur, Maharashtra'},
]

SEO_CONFIG = [
    {'page': 'home', 'title': 'NJ Edu-Hub | Best Coaching for JEE, NEET & Foundation', 'description': 'Premium coaching for JEE, NEET, Foundation and Olympiad preparation with excellent mentorship and results.', 'keywords': 'JEE coaching, NEET coaching, foundation classes, Pune', 'og_image': 'https://images.unsplash.com/photo-1581726707445-75cbe4efc586?auto=format&fit=crop&w=1200&q=80'},
    {'page': 'courses', 'title': 'Courses | NJ Edu-Hub', 'description': 'Explore JEE, NEET, foundation and flagship programs designed for long-term academic growth.', 'keywords': 'courses, coaching, JEE, NEET, foundation', 'og_image': ''},
]

SITE_SETTINGS = [
    {'key': 'site_name', 'value': 'Giri Sirs Gurukul Classes', 'group': 'site'},
    {'key': 'tagline', 'value': 'Inclusive Personalised JEE & NEET Coaching', 'group': 'site'},
    {'key': 'phone', 'value': '+91 98765 43210', 'group': 'contact'},
    {'key': 'email', 'value': 'support@njeduhub.com', 'group': 'contact'},
    {'key': 'address', 'value': 'Pune, Maharashtra', 'group': 'contact'},
    {'key': 'footer_tagline', 'value': 'Premium Coaching', 'group': 'footer'},
    {'key': 'footer_description', 'value': 'India\'s trusted IIT-JEE & NEET coaching institute. 23+ years of academic excellence, 1400+ JEE Advanced ranks, and a community of dedicated mentors.', 'group': 'footer'},
    {'key': 'footer_copyright', 'value': 'All rights reserved.', 'group': 'footer'},
    {'key': 'footer_privacy_text', 'value': 'Privacy Policy', 'group': 'footer'},
    {'key': 'footer_terms_text', 'value': 'Terms & Conditions', 'group': 'footer'},
    {'key': 'social_facebook', 'value': 'https://facebook.com', 'group': 'social'},
    {'key': 'social_instagram', 'value': 'https://instagram.com', 'group': 'social'},
    {'key': 'social_youtube', 'value': 'https://youtube.com', 'group': 'social'},
    {'key': 'social_twitter', 'value': 'https://x.com', 'group': 'social'},
    {'key': 'social_linkedin', 'value': 'https://linkedin.com', 'group': 'social'},
]

HOMEPAGE_SECTIONS = [
    {'section': 'homepage', 'title': 'Learning that feels personal', 'subtitle': 'Our promise to every learner', 'description': 'The NJ Edu-Hub experience combines high-quality faculty, small-batch learning, and real results-focused mentoring.', 'image': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', 'status': 'active'},
    {'section': 'results', 'title': 'Results that speak', 'subtitle': 'Student success stories', 'description': 'Our learning systems are designed to turn consistent effort into prestigious outcomes.', 'image': 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80', 'status': 'active'},
]

async def seed_db(db):
    counts = {}
    seed_map = {
        'courses': COURSES,
        'faculty': FACULTY,
        'toppers': TOPPERS,
        'results': RESULTS,
        'testimonials': TESTIMONIALS,
        'blogs': BLOGS,
        'news': NEWS,
        'banners': BANNERS,
        'counters': COUNTERS,
        'faqs': FAQS,
        'programs-strip': PROGRAMS_STRIP,
        'why-us': WHY_US,
        'centres': CENTRES,
        'seo-manager': SEO_CONFIG,
        'site-settings': SITE_SETTINGS,
        'homepage-editor': HOMEPAGE_SECTIONS,
    }

    subject_ids = {}
    if await db.lecture_subjects.count_documents({}) == 0:
        for subject in LECTURE_SUBJECTS:
            subject_id = _id()
            subject_ids[subject['name']] = subject_id
            await db.lecture_subjects.insert_one({'id': subject_id, 'created_at': _ts(), **subject})

    if await db.lectures.count_documents({}) == 0:
        for lecture in LECTURES:
            subject_id = subject_ids.get(lecture['subject_name'])
            doc = {'id': _id(), 'created_at': _ts(), **lecture}
            if subject_id:
                doc['subject_id'] = subject_id
            await db.lectures.insert_one(doc)
    for coll, items in seed_map.items():
        if coll == 'site-settings':
            for it in items:
                key = it.get('key')
                if not key:
                    continue
                await db[coll].update_one(
                    {'key': key},
                    {'$set': {'id': _id(), 'created_at': _ts(), **it}},
                    upsert=True,
                )
        elif await db[coll].count_documents({}) == 0:
            for it in items:
                doc = {'id': _id(), 'created_at': _ts(), **it}
                await db[coll].insert_one(doc)
        counts[coll] = await db[coll].count_documents({})

    if await db.gallery.count_documents({}) == 0:
        for url in GALLERY:
            await db.gallery.insert_one({'id': _id(), 'created_at': _ts(), 'url': url, 'caption': ''})
    counts['gallery'] = await db.gallery.count_documents({})

    if await db.videos.count_documents({}) == 0:
        for video in VIDEOS:
            payload = {'id': _id(), 'created_at': _ts(), **video}
            await db.videos.insert_one(payload)
    counts['videos'] = await db.videos.count_documents({})

    return {'seeded': True, 'counts': counts}
