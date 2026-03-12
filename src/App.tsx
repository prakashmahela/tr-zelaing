/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Menu, X, ChevronRight, MapPin, Calendar, GraduationCap,
  Award, Target, Users, Briefcase, Facebook,
  ArrowRight, Shield, Heart, Zap, Sun, Moon,
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'beige');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubpage, setActiveSubpage] = useState<string | null>(null);
  const [savedScrollY, setSavedScrollY] = useState<number>(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  const openSubpage = (id: string, saveScroll = true) => {
    if (saveScroll) setSavedScrollY(window.scrollY);
    setActiveSubpage(id);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setActiveSubpage(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'beige' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('section-reveal')) entry.target.classList.add('active');
          if (entry.target.classList.contains('counter-stat')) animateCounter(entry.target as HTMLElement);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-zoom, .reveal-fade, .reveal-heading, .section-reveal, .counter-stat').forEach(el => revealObserver.observe(el));
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); revealObserver.disconnect(); };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!portraitRef.current) return;
      const xPos = (e.clientX / window.innerWidth - 0.5) * 30;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 30;
      portraitRef.current.style.transform = `rotateY(${xPos}deg) rotateX(${-yPos}deg) translateZ(50px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const animateCounter = (el: HTMLElement) => {
    const target = parseInt(el.dataset.target || '0');
    const startTime = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - startTime) / 2000, 1);
      el.innerText = Math.floor(progress * target).toString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Journey', id: 'journey' },
    { name: 'Vision', id: 'vision' },
    { name: 'Initiatives', id: 'initiatives' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Contact', id: 'contact' },
  ];

  const cardBase: React.CSSProperties = {
    background: 'var(--bg-secondary)',
    borderRadius: '20px',
    padding: '1.25rem 1.5rem',
    borderLeft: '3px solid var(--accent-gold)',
    boxShadow: '0 8px 30px var(--shadow)',
    transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
    transformStyle: 'preserve-3d' as const,
    cursor: 'pointer',
    position: 'relative' as const,
  };

  const hoveredCardStyle: React.CSSProperties = {
    ...cardBase,
    borderLeft: '4px solid var(--accent-gold)',
    boxShadow: '0 30px 80px var(--shadow), 0 8px 20px rgba(0,0,0,0.1)',
    transform: 'translateY(-10px) translateZ(20px) scale(1.01)',
  };

  const BackBtn = () => (
    <button
      onClick={goBack}
      className="flex items-center gap-1.5 text-violet-500 font-anton text-[10px] uppercase tracking-widest mb-6 hover:text-violet-300 transition-colors group cursor-pointer"
    >
      <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back
    </button>
  );

  const SH = ({ t }: { t: string }) => (
    <h2 className="text-xl font-anton text-violet-500 uppercase mb-3">{t}</h2>
  );

  const SubPage = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <BackBtn />
        <h1 className="text-3xl font-anton mb-6 text-[var(--text-primary)] tracking-tight">{title}</h1>
        <div className="space-y-6 font-poppins text-[var(--text-secondary)] leading-relaxed text-base">{children}</div>
      </div>
    </div>
  );

  return (
    /* CRITICAL: overflow-x hidden on root wrapper */
    <div className="relative" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      <style>{`
        /* MOBILE OVERFLOW FIX - prevent all horizontal scroll */
        html, body, #root {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }

        @keyframes oceanSwell1 {
          0%   { transform: translateX(0%)   translateY(0px); }
          100% { transform: translateX(8%)   translateY(-14px); }
        }
        @keyframes oceanSwell2 {
          0%   { transform: translateX(0%)   translateY(0px); }
          100% { transform: translateX(-7%)  translateY(-9px); }
        }
        @keyframes oceanSwell3 {
          0%   { transform: translateX(0%)   translateY(0px); }
          100% { transform: translateX(5%)   translateY(-5px); }
        }

        .relative::before { content: none; }

        .premium-card {
          background: var(--card-bg) !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 20px 60px var(--shadow), inset 0 1px 0 rgba(167,139,250,0.08) !important;
          border-radius: 20px;
        }

        @keyframes colorFlowGold {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-color-flow {
          background: linear-gradient(90deg, #ffffff 0%, #e9d5ff 15%, #a78bfa 35%, #f59e0b 55%, #fbbf24 70%, #a78bfa 85%, #ffffff 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 6s ease infinite;
        }
        .animate-color-flow-alt {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 20%, #a78bfa 45%, #7c3aed 65%, #a78bfa 80%, #f59e0b 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 5s ease infinite reverse;
        }

        .title-timeline {
          background: linear-gradient(90deg, #ffffff 0%, #e9d5ff 25%, #a78bfa 50%, #c4b5fd 75%, #ffffff 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 5s ease infinite;
        }
        .title-timeline-accent {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 30%, #f59e0b 60%, #fbbf24 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 4s ease infinite reverse;
        }
        .title-vision {
          background: linear-gradient(90deg, #ffffff 0%, #e9d5ff 20%, #a78bfa 45%, #7c3aed 65%, #c4b5fd 85%, #ffffff 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 6s ease infinite;
        }
        .title-vision-gold {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 25%, #fde68a 55%, #f59e0b 80%, #fbbf24 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 4s ease infinite;
        }
        .title-milestone {
          background: linear-gradient(90deg, #f5f3ff 0%, #ffffff 20%, #e9d5ff 40%, #a78bfa 60%, #c4b5fd 80%, #ffffff 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 5s ease infinite;
        }
        .title-milestone-accent {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 25%, #fde68a 55%, #f59e0b 80%, #fbbf24 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: colorFlowGold 3.5s ease infinite reverse;
        }

        .text-dark-sub  { color: var(--text-muted); }
        .text-dark-body { color: var(--text-secondary); }
        .text-dark-muted{ color: var(--text-muted); }

        h2.text-clamp-section { color: var(--text-primary); }

        .fixed.inset-0.z-\[100\].bg-white { background: var(--bg-primary) !important; }
        
        .timeline-line { background: var(--border) !important; }
        .timeline-dot { background: var(--accent-gold) !important; box-shadow: 0 0 20px var(--shadow) !important; }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(50px) scale(0.97);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
          will-change: opacity, transform;
        }
        .reveal-on-scroll.visible { opacity: 1; transform: translateY(0) scale(1); }
        .reveal-on-scroll:nth-child(1) { transition-delay: 0s; }
        .reveal-on-scroll:nth-child(2) { transition-delay: 0.1s; }
        .reveal-on-scroll:nth-child(3) { transition-delay: 0.2s; }
        .reveal-on-scroll:nth-child(4) { transition-delay: 0.3s; }
        .reveal-on-scroll:nth-child(5) { transition-delay: 0.4s; }
        .reveal-left { opacity: 0; transform: translateX(-60px) scale(0.97); transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1); }
        .reveal-left.visible { opacity: 1; transform: translateX(0) scale(1); }
        .reveal-right { opacity: 0; transform: translateX(60px) scale(0.97); transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1); }
        .reveal-right.visible { opacity: 1; transform: translateX(0) scale(1); }
        .reveal-zoom { opacity: 0; transform: scale(0.85); transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1); }
        .reveal-zoom.visible { opacity: 1; transform: scale(1); }
        .reveal-fade { opacity: 0; transition: opacity 1.2s ease; }
        .reveal-fade.visible { opacity: 1; }
        .reveal-heading { opacity: 0; transform: translateY(40px) skewY(2deg); transition: opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1); }
        .reveal-heading.visible { opacity: 1; transform: translateY(0) skewY(0); }

        @keyframes starTwinkle1 {
          0%   { opacity: 0.6; transform: scale(1); }
          50%  { opacity: 1;   transform: scale(1.05); }
          100% { opacity: 0.7; transform: scale(0.98); }
        }
        @keyframes starTwinkle2 {
          0%   { opacity: 0.8; transform: scale(1); }
          40%  { opacity: 0.5; transform: scale(0.95); }
          100% { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes shootingStar {
          0%   { transform: translateX(0vw) rotate(-20deg); opacity: 0; }
          2%   { opacity: 1; }
          10%  { transform: translateX(110vw) rotate(-20deg); opacity: 0; }
          100% { transform: translateX(110vw) rotate(-20deg); opacity: 0; }
        }
        @keyframes shootingStar2 {
          0%   { transform: translateX(0vw) rotate(-15deg); opacity: 0; }
          2%   { opacity: 1; }
          8%   { transform: translateX(-110vw) rotate(-15deg); opacity: 0; }
          100% { transform: translateX(-110vw) rotate(-15deg); opacity: 0; }
        }

        @keyframes heroNameFlow {
          0%   { background-position: 0% center; }
          50%  { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .hero-name-flow {
          background: linear-gradient(90deg, var(--text-primary) 0%, var(--text-primary) 20%, #c9a84c 35%, var(--text-primary) 50%, var(--text-primary) 65%, #f0c060 78%, var(--text-primary) 90%, var(--text-primary) 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroNameFlow 5s ease infinite;
        }
        .hero-gold-flow {
          background: linear-gradient(90deg, var(--accent-gold) 0%, #fde68a 20%, #f59e0b 35%, #ffffff 50%, #f59e0b 65%, #fde68a 80%, var(--accent-gold) 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroNameFlow 4s ease infinite reverse;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.6) !important; }
        .contact-input { color: #ffffff !important; caret-color: #ffffff; }

        @keyframes quoteColorFlow {
          0%   { background-position: 0% center; }
          50%  { background-position: 150% center; }
          100% { background-position: 300% center; }
        }

        /* Wave animations - contained within overflow:hidden parents */
        @keyframes waveFlow1 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes waveFlow2 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes waveFlow3 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes skyShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes blobDrift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(40px,30px) scale(1.1)} }
        @keyframes floatDot { 0%{transform:translateY(0) scale(1)} 100%{transform:translateY(-20px) scale(1.15)} }
        @keyframes cardFloatLeft {
          0%   { transform: translateX(0px) rotate(0deg); box-shadow: 0 10px 40px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.04); }
          100% { transform: translateX(-6px) rotate(-0.4deg); box-shadow: -4px 16px 50px rgba(124,58,237,0.18), 0 4px 16px rgba(0,0,0,0.06); }
        }
        @keyframes cardFloatRight {
          0%   { transform: translateX(0px) rotate(0deg); box-shadow: 0 10px 40px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.04); }
          100% { transform: translateX(6px) rotate(0.4deg); box-shadow: 4px 16px 50px rgba(124,58,237,0.18), 0 4px 16px rgba(0,0,0,0.06); }
        }
      `}</style>


      {/* ═══════════════════════ SUBPAGES ═══════════════════════ */}

      {activeSubpage === 'home' && (
        <SubPage title="Welcome to the Official Portal of T.R. Zeliang">
          <section><SH t="A Commitment to the People of Nagaland" />
            <p>This official digital platform is dedicated to providing a comprehensive overview of the life, career, and vision of T.R. Zeliang, the Deputy Chief Minister of Nagaland. With a career spanning over four decades, T.R. Zeliang has been a central figure in the political landscape of the state, serving in various capacities from a student leader to the Chief Minister. This portal aims to bridge the gap between the administration and the citizens, offering a transparent look into the policies and initiatives that are shaping the future of our state.</p>
            <p className="mt-4">Nagaland is a land of immense potential, rich in culture and natural resources. However, it also faces unique challenges that require dedicated and visionary leadership. T.R. Zeliang's mission has always been to harness this potential and address these challenges through inclusive governance, sustainable development, and a steadfast commitment to peace.</p>
          </section>
          <section><SH t="Fostering Transparency and Engagement" />
            <p>In today's digital age, transparency is not just a goal but a necessity for effective governance. This portal is designed to provide citizens with easy access to information regarding government policies, developmental projects, and administrative reforms. We believe that an informed citizenry is the greatest asset of a democracy.</p>
            <p className="mt-4">We encourage you to explore the various sections of this site to learn more about the strategic initiatives being undertaken in sectors such as infrastructure, social welfare, and rural development. Your feedback and engagement are vital as we work together to build a Nagaland that reflects the aspirations of all its people.</p>
          </section>
          <section><SH t="A Vision for a Prosperous Future" />
            <p>The vision of T.R. Zeliang for Nagaland is one of holistic growth and self-reliance — where every citizen has access to quality education, modern healthcare, and sustainable livelihood opportunities, and where our rich cultural heritage is preserved even as we embrace the opportunities of the 21st century.</p>
          </section>
          <section><SH t="Stay Informed and Connected" />
            <p>We invite you to visit this portal regularly for the latest updates on government activities and public announcements. Together, we can build a stronger, more resilient, and more prosperous state for generations to come.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'about' && (
        <SubPage title="Biography of T.R. Zeliang">
          <section><SH t="Heritage and Early Influences" />
            <p>T.R. Zeliang's life story is one of deep connection to his roots and a relentless pursuit of the common good. Born in the remote village of Mbaupungwa in the Peren District, he was raised in an environment where the traditional Naga values of community, honesty, and bravery were paramount. His father, Lt. Rangleu Zeliang, was a man of great integrity who instilled in him the importance of serving one's people with dedication and humility.</p>
            <p className="mt-4">The Zeliangrong community, to which he belongs, has a rich history of resilience and cultural pride. These early influences were instrumental in shaping his character and his approach to leadership. Growing up in a rural setting, he experienced firsthand the difficulties of living in areas with limited access to modern amenities, which later became a driving force behind his focus on rural development and infrastructure.</p>
          </section>
          <section><SH t="Academic Journey" />
            <p>His quest for knowledge led him from the hills of Nagaland to the plains of Assam. He attended Don Bosco School in Dibrugarh, where he received a holistic education that emphasized both academic excellence and moral character. He continued at Kohima College, a premier institution in the state capital, where his involvement in student politics provided both an intellectual foundation and a practical understanding of the issues facing the state. He graduated with a Bachelor of Arts degree.</p>
          </section>
          <section><SH t="Personal Life: Family and Faith" />
            <p>T.R. Zeliang is married to Smti. Kevizenuo, who has been his constant support throughout his long political career. Together they have raised three children. Despite the rigors of high office, he has always made time for his family and community, known for his simple lifestyle and approachable nature.</p>
          </section>
          <section><SH t="A Philosophy of Service" />
            <p>The guiding principle of T.R. Zeliang's life is the belief that public service is a sacred trust. His philosophy is based on the idea of inclusive growth, where the benefits of development reach the most marginalized sections of society.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey' && (
        <SubPage title="Political Journey Overview">
          <section><SH t="A Life Dedicated to Public Service" />
            <p>T.R. Zeliang's political journey is a remarkable story of perseverance, vision, and an unshakeable commitment to the people of Nagaland. Spanning more than four decades, his career traces the arc of Nagaland's own political evolution. What makes his story distinctive is not merely the offices he has held, but the consistency of his values and his ability to remain connected to the grassroots even as he rose to the very top of the state's political hierarchy.</p>
          </section>
          <section><SH t="From the Villages to the Assembly" />
            <p>The transition from student leader to elected representative was neither swift nor easy. T.R. Zeliang contested his first election in 1982, losing but gaining invaluable ground-level experience. He spent the intervening years deepening his roots in the Tening constituency. When victory came in 1989, it was a mandate built on relationships, not merely rhetoric.</p>
          </section>
          <section><SH t="National Stage and Return to State Leadership" />
            <p>His elevation to the Rajya Sabha in 2004 gave him a national platform to champion the cause of Nagaland and the broader Northeast. The decades of preparation culminated in his appointment as Chief Minister in May 2014. Today, as Deputy Chief Minister, he continues that work with the same energy and conviction.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'legacy' && (
        <SubPage title="The Political Journey of T.R. Zeliang">
          <section><SH t="A Childhood Forged in the Hills" />
            <p>Taditui Rangkau Zeliang was born on February 21, 1952, in the remote village of Mbaupungwa, nestled in the hills of Peren District, Nagaland. Growing up in a region where roads were scarce, schools were few, and government services rarely reached, young Zeliang witnessed firsthand the consequences of neglect and underdevelopment. His father, Lt. Rangleu Zeliang, was a man of standing and principle within the community. Zeliang pursued his early education at Don Bosco School in Dibrugarh, Assam, and later completed his Bachelor of Arts at Kohima College.</p>
          </section>
          <section><SH t="The Activist Years: Building a Political Identity (1975–1982)" />
            <p>Before he ever contested an election, Zeliang was already shaping public life through student activism. As President of the Zeliangrong Students Union, Kohima, he organized campaigns for better education, accommodation, and representation for students from his community. He joined the Naga Students' Federation, engaging with the full breadth of Naga political consciousness.</p>
          </section>
          <section><SH t="First Steps in Electoral Politics (1982–1989)" />
            <p>Zeliang contested his first election in 1982, an experience that ended in defeat but gave him invaluable political education. In 1989, he stood again from the Tening constituency and won decisively — the beginning of an unbroken electoral record spanning more than three decades.</p>
          </section>
          <section><SH t="The Chief Ministership: First Term (2014–2017)" />
            <p>On May 22, 2014, T.R. Zeliang was sworn in as the 19th Chief Minister of Nagaland. His first term was defined by three priorities: advancing the Naga peace process, accelerating infrastructure development, and reforming public administration.</p>
          </section>
          <section><SH t="Return to the Helm: Second Term and Deputy Chief Minister" />
            <p>After a brief interruption, Zeliang returned as Chief Minister in July 2017, continuing the developmental agenda. Following the 2023 elections, he transitioned to the role of Deputy Chief Minister. As Deputy Chief Minister, he continues to focus on connectivity, youth employment, the Naga political settlement, and sustainable development.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-student' && (<SubPage title="Student Leadership & Activism: 1975–1982"><section><SH t="The Emergence of a Grassroots Leader" /><p>Long before T.R. Zeliang ever stood for election, he was already shaping public life in Nagaland through the power of student activism. Zeliang entered this arena as a young man from the Zeliangrong community, acutely aware of the marginalization felt by people from the Peren region. He channeled that awareness into organized student advocacy, beginning with his election as President of the Zeliangrong Students Union, Kohima, in 1975.</p></section><section><SH t="President of the Zeliangrong Students Union" /><p>As President, Zeliang worked on issues that directly affected the lives of students from his community: access to quality education, availability of hostels and accommodation, and the need for greater representation. He organized public meetings, submitted memoranda to government officials, and built coalitions with other student organizations.</p></section><section><SH t="Engagement with the Naga Students' Federation" /><p>Following his work with the Zeliangrong Students Union, Zeliang became an active member of the Naga Students' Federation (NSF), the apex body representing students across Nagaland. The NSF was — and remains — one of the most influential civil society organizations in the state.</p></section></SubPage>)}
      {activeSubpage === 'journey-1982' && (<SubPage title="The First Step: 1982 Electoral Contest"><section><SH t="A Bold Entry into Mainstream Politics" /><p>In 1982, T.R. Zeliang made the momentous decision to transition from student leadership to the arena of mainstream electoral politics. He chose to contest from the 6-Tening Assembly Constituency, a region that was topographically challenging. Zeliang's campaign was a true grassroots effort, involving long treks on foot to reach the most isolated hamlets.</p></section><section><SH t="The Outcome and Its Significance" /><p>Although T.R. Zeliang did not win in his first attempt, the 1982 election was a moral victory. He secured a significant percentage of the vote, establishing himself as a formidable political force in the region. The experience taught him the importance of patience, persistence, and the need for a long-term strategy.</p></section></SubPage>)}
      {activeSubpage === 'journey-1989' && (<SubPage title="The Breakthrough: 1989 Victory"><section><SH t="A Decisive Mandate from Tening" /><p>The 1989 elections saw T.R. Zeliang contest as a candidate of the Naga People's Council (NPC). His message of change and his track record of consistent engagement resonated deeply with the electorate. The victory in 1989 was a decisive mandate — a clear indication that the people of Tening were ready for a new generation of leadership.</p></section><section><SH t="Entry into the Council of Ministers" /><p>His talent and his connection with the grassroots were immediately recognized. T.R. Zeliang was appointed as a Minister of State for Relief and Rehabilitation in the new government — a significant responsibility for a first-time MLA.</p></section></SubPage>)}
      {activeSubpage === 'journey-1993' && (<SubPage title="Consolidation and Service: 1993–1998"><section><SH t="Re-election and Continued Mandate" /><p>In 1993, T.R. Zeliang sought re-election from the Tening constituency, and the people responded with an even stronger mandate. His first term as an MLA and Minister had proven his commitment to their welfare.</p></section><section><SH t="Focus on Rural Empowerment" /><p>During this term, Zeliang's focus remained firmly on rural empowerment. He worked to strengthen local self-governance institutions and to ensure that developmental funds were utilized effectively at the grassroots level.</p></section></SubPage>)}
      {activeSubpage === 'journey-1998' && (<SubPage title="Cabinet Leadership: 1998–2003"><section><SH t="Elevation to Cabinet Rank" /><p>The 1998 elections saw T.R. Zeliang return for a third consecutive term, elevated to Cabinet rank. He was appointed as the Minister for Environment and Forests and Geology and Mining.</p></section><section><SH t="The Creation of Peren District: A Lasting Legacy" /><p>One of the most significant achievements of T.R. Zeliang's tenure as a Cabinet Minister was his role in the creation of Peren as a separate district in 2003. This had been a long-standing demand of the people of the region, and Zeliang worked tirelessly to make it a reality.</p></section></SubPage>)}
      {activeSubpage === 'journey-parliament' && (<SubPage title="National Representation: Rajya Sabha 2004–2008"><section><SH t="A New Stage: The Parliament of India" /><p>In 2004, T.R. Zeliang was elected to represent the state in the Rajya Sabha, the Upper House of the Parliament of India. This elevation to the national stage was both a recognition of his stature within Nagaland's political landscape and an opportunity to amplify the voice of the Naga people in the corridors of national power.</p></section><section><SH t="Championing the Northeast at the National Level" /><p>Throughout his tenure in the Rajya Sabha, T.R. Zeliang was an unwavering advocate for Nagaland and the broader Northeast region. He was particularly vocal about the infrastructure deficit in the Northeast, arguing that the region's geographical isolation had for too long been treated as a natural given rather than a developmental challenge.</p></section></SubPage>)}
      {activeSubpage === 'journey-2014' && (<SubPage title="The 19th Chief Minister of Nagaland: 2014"><section><SH t="A New Era of Leadership" /><p>In May 2014, T.R. Zeliang assumed the office of the Chief Minister of Nagaland. As the 19th Chief Minister, Zeliang brought with him over three decades of experience in public life. His first few months in office were characterized by a strong emphasis on administrative efficiency and inclusive governance.</p></section><section><SH t="The Naga Peace Process: A Top Priority" /><p>From the very beginning of his tenure, the resolution of the Naga political issue was Zeliang's top priority. His administration played a crucial role in the lead-up to the signing of the Framework Agreement in August 2015.</p></section></SubPage>)}
      {activeSubpage === 'journey-2017' && (<SubPage title="Second Term as Chief Minister: 2017"><section><SH t="A Return to the Helm" /><p>In July 2017, T.R. Zeliang returned as the Chief Minister of Nagaland for a second term. His second term was characterized by a pragmatic and resilient approach to governance focused on maintaining political stability and continuing developmental projects.</p></section><section><SH t="Steadfast Commitment to Peace" /><p>Throughout his second term, Zeliang's commitment to the Naga peace process remained unwavering. He continued to engage with various Naga groups and the Government of India, pushing for a final settlement that would bring lasting peace to the region.</p></section></SubPage>)}
      {activeSubpage === 'journey-deputy' && (<SubPage title="Deputy Chief Minister & Current Leadership: 2023–Present"><section><SH t="A New Chapter of Service" /><p>In 2023, T.R. Zeliang assumed the role of Deputy Chief Minister of Nagaland, continuing his unbroken record of service to the state in its highest offices. The portfolios assigned to him — Planning and Transformation, and National Highways — were precisely the areas where his years of experience could be most effectively deployed.</p></section><section><SH t="National Highways: Connecting Nagaland to the Future" /><p>Under his watch, significant progress has been made in the construction and improvement of National Highways across the state. He has worked closely with the National Highways Authority of India to ensure that Nagaland receives its fair share of national road development funding.</p></section></SubPage>)}
      {activeSubpage === 'vision' && (<SubPage title="Vision and Policy Framework"><section><SH t="Peace First: The Naga Political Settlement" /><p>Everything else that T.R. Zeliang believes in — development, youth empowerment, economic transformation — rests on a single foundation: peace. The Naga political issue is not merely a constitutional or administrative matter; it is a deeply human question about identity, dignity, and the right of a people to determine their own future.</p></section><section><SH t="Connectivity: Roads as the Architecture of Opportunity" /><p>His infrastructure vision centers on completing the National Highway network across Nagaland's difficult terrain, improving inter-district connectivity, and ensuring that no village is more than a reasonable distance from a paved road.</p></section><section><SH t="Youth: From Job Seekers to Job Creators" /><p>His youth policy vision involves three integrated pillars: vocational training, entrepreneurship, and digital inclusion — ensuring that young Nagas have the connectivity and digital literacy to participate in the knowledge economy.</p></section></SubPage>)}
      {activeSubpage === 'initiatives' && (<SubPage title="Key Portfolios and Initiatives"><section><SH t="Planning and Transformation: A Data-Driven Approach" /><p>As the Minister in charge of Planning and Transformation, T.R. Zeliang has introduced a paradigm shift in how developmental projects are conceived and implemented in Nagaland. His focus is on data-driven decision-making and the use of modern technology to ensure transparency and accountability.</p></section><section><SH t="National Highway Development: The Connectivity Revolution" /><p>Under his leadership, the Department of National Highways has seen an unprecedented surge in activity. Major projects, such as the four-laning of the Dimapur-Kohima road and the development of the Trans-Nagaland Highway, are at various stages of completion.</p></section></SubPage>)}
      {activeSubpage === 'vision-peace' && (<SubPage title="Peace & Unity: The Foundation of Progress"><section><SH t="The Centrality of Peace to Nagaland's Future" /><p>For T.R. Zeliang, peace is not merely a political goal — it is the essential precondition for every other form of progress. A state that is consumed by internal conflict cannot build roads, schools, or hospitals with any lasting effect. This conviction has been at the heart of his public philosophy for over four decades.</p></section><section><SH t="A Framework for Lasting Resolution" /><p>His framework for resolution is built on three principles: inclusivity, honor, and finality. A solution must be inclusive, reflecting the aspirations of all sections of Naga society. It must be honorable, respecting the dignity and cultural identity of the Naga people. And it must be final.</p></section></SubPage>)}
      {activeSubpage === 'vision-development' && (<SubPage title="Development: Building the Infrastructure of Progress"><section><SH t="Infrastructure as the Foundation of Opportunity" /><p>T.R. Zeliang's developmental philosophy is grounded in a simple but powerful insight: opportunity cannot reach people who are not connected. Infrastructure is not just one item on the developmental agenda — it is the platform on which all other items rest.</p></section><section><SH t="Economic Development and Livelihoods" /><p>Beyond infrastructure, Zeliang's development agenda addresses the question of livelihoods. His vision is to diversify the economic base by promoting agriculture, tourism, and small enterprise as sustainable sources of income for a broader segment of the population.</p></section></SubPage>)}
      {activeSubpage === 'vision-youth' && (<SubPage title="Youth & Future: Investing in Nagaland's Greatest Asset"><section><SH t="The Youth Imperative" /><p>Nagaland is a young state — demographically, historically, and in terms of its unrealized potential. A significant proportion of its population is under the age of thirty-five. T.R. Zeliang has made youth empowerment a central pillar of his political vision.</p></section><section><SH t="From Job Seekers to Job Creators" /><p>The most distinctive aspect of Zeliang's youth agenda is his emphasis on entrepreneurship and self-reliance over government employment. He wants to create an ecosystem that makes entrepreneurship a genuinely attractive option — with access to capital, mentorship, market connections, and a supportive regulatory environment.</p></section></SubPage>)}
      {activeSubpage === 'achievement-cm' && (<SubPage title="Twice Chief Minister of Nagaland"><p>T.R. Zeliang made history by serving as Chief Minister of Nagaland on two separate occasions — first from 2014 to 2017, and again from 2017 to 2018. His administration prioritized infrastructure development, with special focus on road connectivity across the state's challenging terrain. He championed inclusive governance, bringing together diverse tribal groups under one vision.</p></SubPage>)}
      {activeSubpage === 'achievement-9time' && (<SubPage title="9-Time Elected Representative"><p>Zeliang's extraordinary democratic mandate spans over four decades. He has been elected to the Nagaland Legislative Assembly from the Peren constituency nine consecutive times — an achievement that reflects unmatched grassroots trust. This remarkable electoral record is built on decades of consistent constituency service, personal accessibility, and a deep understanding of local needs.</p></SubPage>)}
      {activeSubpage === 'achievement-mp' && (<SubPage title="Rajya Sabha Member of Parliament"><p>Zeliang served as a Member of the Rajya Sabha, the upper house of the Indian Parliament, bringing the voice of Nagaland to the national stage. During his tenure, he raised critical issues pertaining to the Northeast — infrastructure gaps, the unique cultural identity of Naga people, special category status, and the long-standing political settlement process.</p></SubPage>)}
      {activeSubpage === 'achievement-40years' && (<SubPage title="40+ Years of Public Service"><p>Since entering public life in the early 1980s, T.R. Zeliang has devoted more than four decades to the service of Nagaland. Through changing governments, coalitions, and political landscapes, Zeliang remained consistent in his dedication. His longevity in public service is a testament to integrity, adaptability, and genuine commitment to the people he represents.</p></SubPage>)}
      {activeSubpage === 'achievement-npf' && (<SubPage title="Led NPF as Single Largest Party"><p>As President of the Naga People's Front (NPF), Zeliang led the party to becoming the single largest party in the Nagaland Legislative Assembly. His leadership strategy combined grassroots mobilisation with strategic coalition-building. His ability to manage diverse tribal constituencies under a unified political platform demonstrated rare organizational and diplomatic skill.</p></SubPage>)}
      {activeSubpage === 'achievement-uda' && (<SubPage title="Chairman, UDA Nagaland"><p>As Chairman of the Urban Development Authority (UDA) of Nagaland, Zeliang played a pivotal role in shaping the state's urban landscape. He oversaw key initiatives in town planning, infrastructure modernisation, and housing development across Nagaland's growing urban centres.</p></SubPage>)}
      {activeSubpage === 'achievement-naga' && (<SubPage title="Advocate for Naga Resolution"><p>Among Zeliang's most defining commitments is his decades-long advocacy for a peaceful, honourable, and lasting resolution to the Naga political issue. He has consistently called for a settlement that respects Naga identity, aspirations, and unique history within the Indian constitutional framework.</p></SubPage>)}
      {activeSubpage === 'achievement-ne' && (<SubPage title="Champion of NE Development"><p>Throughout his career, Zeliang has been a vocal champion for the broader development of Northeast India. He consistently lobbied for greater central investment in the region's infrastructure, healthcare, education, and connectivity. From advocating for better road and rail connectivity to pushing for the Act East Policy's effective implementation in Nagaland, Zeliang worked to ensure that the Northeast was not left behind in India's growth story.</p></SubPage>)}
      {activeSubpage === 'value-integrity' && (<SubPage title="Integrity in Governance"><p>Integrity is not merely a word in Zeliang's political vocabulary — it is the cornerstone of his decades-long public life. He has consistently maintained that governance must be transparent, accountable, and free from corruption. During his tenure as Chief Minister, he introduced measures to improve financial accountability and reduce leakage in government spending.</p></SubPage>)}
      {activeSubpage === 'value-unity' && (<SubPage title="Unity Across Diversity"><p>Nagaland is home to more than sixteen major Naga tribes, each with its own language, customs, and territorial identity. Zeliang has throughout his career been a builder of bridges — between tribes, between the hills and the plains, between Nagaland and the rest of India. He consistently emphasised that the Naga people's strength lies in their unity, not in their divisions.</p></SubPage>)}
      {activeSubpage === 'value-progress' && (<SubPage title="Progress with Cultural Preservation"><p>Zeliang's idea of progress is rooted in a deep respect for Nagaland's rich indigenous heritage. He has always believed that modernization and cultural preservation are not opposites but complements. Under his leadership, development programmes were designed to improve material conditions without eroding the unique identity of Naga communities.</p></SubPage>)}
      {activeSubpage === 'info-born' && (<SubPage title="Early Life & Birth"><p>T.R. Zeliang was born on February 21, 1952, in Mbaupungwa village, located in the Peren District of Nagaland. He is the son of the late Rangleu Zeliang. Growing up in a remote village during a transformative period in Nagaland's history, his early years were shaped by the traditional values of his community and the challenges of rural life.</p></SubPage>)}
      {activeSubpage === 'info-constituency' && (<SubPage title="Peren Constituency"><p>T.R. Zeliang represents the 7-Peren Assembly Constituency in the Nagaland Legislative Assembly. Peren is a significant region in Nagaland, known for its rich cultural heritage and strategic importance. Throughout his career, he has been a steadfast advocate for the development of his constituency, focusing on improving infrastructure, healthcare, and educational opportunities.</p></SubPage>)}
      {activeSubpage === 'info-party' && (<SubPage title="Political Affiliation"><p>T.R. Zeliang is a prominent leader of the Naga People's Front (NPF) in Nagaland. The NPF is a major regional political party that focuses on the progress, development, and regional identity of Nagaland. As a senior leader within the party, he has played a crucial role in shaping its policies and strategies.</p></SubPage>)}
      {activeSubpage === 'info-education' && (<SubPage title="Educational Background"><p>T.R. Zeliang holds a Bachelor of Arts (B.A.) degree from Kohima College, which is one of the premier educational institutions in the state. His time in college was not just about academic learning; it was also the period when he became actively involved in student politics and social advocacy.</p></SubPage>)}
      {activeSubpage === 'achievements' && (<SubPage title="Milestones and Achievements"><section><SH t="Leadership Excellence and Political Longevity" /><p>T.R. Zeliang's career is marked by remarkable political longevity and leadership excellence. Being elected as the Chief Minister of Nagaland twice is a testament to the trust and confidence the people have in his leadership. His record as a nine-time elected representative to the Nagaland Legislative Assembly reflects a deep and enduring connection with the grassroots.</p></section><section><SH t="The Creation of Peren District" /><p>Among his most tangible and lasting achievements is his pivotal role in the creation of Peren as a separate district in 2003. This long-standing demand of the Zeliangrong people became a reality through his persistent advocacy.</p></section></SubPage>)}
      {activeSubpage === 'contact' && (<SubPage title="Contact and Office Details"><section><SH t="The Office of the Deputy Chief Minister" /><p>The primary office of T.R. Zeliang, the Deputy Chief Minister of Nagaland, is located in the state capital, Kohima, at Old Minister's Hill. This office serves as the central hub for administrative coordination and public engagement.</p></section><section><SH t="Digital Outreach: Modernizing Citizen Engagement" /><p>Recognizing the importance of technology in modern governance, the office of the Deputy Chief Minister has a strong digital presence. This official portal is part of a broader digital outreach strategy aimed at making information more accessible to everyone, regardless of their location.</p></section></SubPage>)}

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-center ${isScrolled ? 'pt-4' : 'pt-0'}`} style={{ maxWidth: '100vw' }}>
        <div className={`transition-all duration-500 flex justify-between items-center ${isScrolled ? 'w-[92%] max-w-6xl px-6 py-3 rounded-2xl bg-[var(--nav-bg)] backdrop-blur-xl shadow-[0_20px_50px_var(--shadow)] border border-[var(--border)] nav-3d-effect' : 'w-full max-w-7xl px-4 py-6 bg-transparent'}`}>
          <a href="#home" className="flex items-center gap-1 group flex-shrink-0">
            <span className="font-anton text-xl tracking-tighter text-[var(--text-primary)]">TR ZELIANG</span>
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 group-hover:scale-150 transition-transform duration-300"></span>
          </a>
          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => openSubpage(link.id, false)} className="font-poppins text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-all duration-300 tracking-wide hover:-translate-y-1 hover:scale-110 active:scale-95 cursor-pointer">
                {link.name}
              </button>
            ))}
            <button onClick={toggleTheme} className="p-2 rounded-full transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] cursor-pointer flex-shrink-0" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="flex items-center gap-2 xl:hidden" style={{ display: 'flex' }}>
            <button onClick={toggleTheme} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div className={`xl:hidden absolute top-full left-1/2 -translate-x-1/2 w-[92%] mt-2 bg-[var(--bg-secondary)] backdrop-blur-xl rounded-2xl shadow-2xl border border-[var(--border)] transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => { openSubpage(link.id, false); setIsMenuOpen(false); }} className="font-poppins text-lg font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-2 hover:text-[var(--accent-gold)] transition-colors text-left w-full cursor-pointer">
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 lg:pt-40 lg:pb-8" style={{ background: "var(--hero-bg)", overflow: 'hidden' }} ref={heroRef}>
        {/* Blobs — clipped to section */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-violet-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 items-center w-full">
          <div className="reveal-on-scroll reveal-left text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="text-clamp-hero leading-[0.9] mb-4 font-anton w-full">
              <span className="hero-name-flow">TADITUI RANGKAU</span><br />
              <span className="hero-gold-flow">ZELIANG</span>
            </h1>
            <p className="font-anton text-base md:text-xl text-[var(--text-muted)] mb-4 tracking-wide">Deputy Chief Minister, Nagaland</p>
            <p className="font-poppins text-sm md:text-base text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed mx-auto lg:mx-0">Two-time Chief Minister · Member of Parliament · 40+ Years of Public Service. A legacy built on peace, progress, and the unwavering spirit of Nagaland.</p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start w-full">
              <button onClick={() => openSubpage('legacy')} className="cursor-pointer flex items-center gap-2" style={{
                fontFamily: 'Anton, sans-serif', letterSpacing: '0.08em', fontSize: 'clamp(0.65rem, 2.5vw, 0.85rem)',
                padding: '0.65rem 1.4rem', borderRadius: '6px',
                background: 'var(--accent-gold)', color: '#fff', border: 'none',
                boxShadow: '0 4px 20px var(--shadow)', transition: 'all 0.3s ease', textTransform: 'uppercase',
              }}>
                Political Journey <ArrowRight size={14} />
              </button>
              <button onClick={() => openSubpage('vision')} className="cursor-pointer" style={{
                fontFamily: 'Anton, sans-serif', letterSpacing: '0.08em', fontSize: 'clamp(0.65rem, 2.5vw, 0.85rem)',
                padding: '0.65rem 1.4rem', borderRadius: '6px',
                background: 'transparent', color: 'var(--accent-gold)',
                border: '1.5px solid var(--accent-gold)', boxShadow: '0 2px 12px var(--shadow)',
                transition: 'all 0.3s ease', textTransform: 'uppercase',
              }}>
                Vision &amp; Policy
              </button>
            </div>
          </div>
          <div className="relative flex justify-center items-center perspective-container reveal-right">
            <div ref={portraitRef} className="relative w-full max-w-[220px] md:max-w-[280px] preserve-3d transition-transform duration-200 ease-out">
              <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ border: "3px solid var(--border)", boxShadow: "0 0 60px var(--shadow), 0 30px 80px rgba(0,0,0,0.4)", height: 'clamp(280px, 50vw, 400px)' }}>
                <img src="https://i.ibb.co/VY8tcdMs/2017-7-largeimg24-Monday-2017-113308648.jpg" alt="Hon. T.R. Zeliang" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 8%', display:'block' }} referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-1 -right-1" style={{
                background: 'var(--bg-primary)', padding: '0.3rem 0.5rem', borderRadius: '8px',
                boxShadow: '0 4px 16px var(--shadow)', border: '1px solid var(--border)',
              }}>
                <p className="font-anton text-[var(--accent-gold)] leading-tight" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>SERVING</p>
                <p className="font-anton text-[var(--text-muted)] leading-tight" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>NAGALAND</p>
                <p className="font-poppins text-[var(--text-muted)] uppercase tracking-widest" style={{ fontSize: '0.45rem', marginTop: '2px' }}>Since 1975</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ABOUT ═══════════════════════ */}
      <section id="about" className="py-24 relative overflow-hidden section-1" style={{ background: "var(--bg-primary)", paddingBottom: "140px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-16">
            <div className="max-w-4xl w-full reveal-on-scroll reveal-heading text-center">
              <h2 className="text-clamp-section mb-8 font-anton"><span className="animate-color-flow">A Journey of</span> <span className="animate-color-flow-alt">Service</span></h2>
              <div className="prose prose-lg max-w-none text-[var(--text-secondary)] font-poppins space-y-6 mx-auto">
                <p>Born in Mbaupungwa village, Peren District, Nagaland, T.R. Zeliang is the son of Lt. Rangleu Zeliang. His journey from a remote village to the corridors of power is a testament to his resilience and dedication to the Naga people.</p>
                <p>Educated at Don Bosco School, Dibrugarh and Kohima College, he entered public life as a student leader, serving as the President of the Zeliangrong Students Union, Kohima. This early involvement in grassroots activism laid the foundation for a political career spanning over four decades.</p>
                <p>Married to Smti. Kevizenuo, and a father of three, he has balanced his personal life with the immense responsibilities of statecraft. A leader who rose through the ranks, he has served in various capacities — from a Minister of State to the Chief Minister of Nagaland twice.</p>
              </div>
            </div>

            {/* KEY INFORMATION */}
            <div className="max-w-5xl w-full reveal-on-scroll">
              <div style={{ borderRadius:'4px 20px 4px 20px', overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ background:'linear-gradient(90deg, #0a1628 0%, #0d2044 100%)', padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', borderBottom:'2px solid #b8913a' }}>
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#c9a84c' }} />
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#c9a84c', opacity:0.5 }} />
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#c9a84c', opacity:0.25 }} />
                  <h3 className="font-anton tracking-[0.25em] uppercase ml-3" style={{ fontSize:'0.7rem', color:'#b8913a', margin:0 }}>Biographical Profile</h3>
                </div>
                {[
                  { icon: <Calendar size={14} />, label: 'Date of Birth', value: 'February 21, 1952', id: 'info-born', bg: 'var(--bg-accent)' },
                  { icon: <MapPin size={14} />, label: 'Constituency', value: 'Tening, Peren District — Nagaland', id: 'info-constituency', bg: 'var(--bg-secondary)' },
                  { icon: <Shield size={14} />, label: 'Political Party', value: "Naga People's Front (NPF)", id: 'info-party', bg: 'var(--bg-accent)' },
                  { icon: <GraduationCap size={14} />, label: 'Education', value: 'Bachelor of Arts — Kohima College', id: 'info-education', bg: 'var(--bg-secondary)' },
                ].map((item, i) => (
                  <div key={i} onClick={() => openSubpage(item.id)} style={{
                    background: item.bg,
                    padding:'clamp(0.8rem,2vw,1.1rem) clamp(1rem,3vw,2rem)',
                    display:'flex', alignItems:'center', gap:'clamp(0.6rem,2vw,1.5rem)',
                    borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                    cursor:'pointer', transition:'background 0.2s ease',
                  }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(184,145,58,0.1)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=item.bg}>
                    <div style={{ width:'28px', height:'28px', borderRadius:'6px', background:'rgba(184,145,58,0.15)', border:'1px solid rgba(184,145,58,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ color:'#c9a84c' }}>{item.icon}</span>
                    </div>
                    <span className="font-poppins uppercase hidden sm:block" style={{ fontSize:'0.55rem', color:'#c9a84c', letterSpacing:'0.12em', fontWeight:700, width:'90px', flexShrink:0 }}>{item.label}</span>
                    <div className="hidden sm:block" style={{ width:'1px', height:'22px', background:'var(--border)', flexShrink:0 }} />
                    <span className="font-poppins" style={{ fontSize:'clamp(0.7rem,2vw,0.9rem)', color:'var(--text-primary)', fontWeight:600, flex:1 }}>{item.value}</span>
                    <span style={{ marginLeft:'auto', color:'rgba(201,168,76,0.5)', fontSize:'0.75rem', flexShrink:0 }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STAT COUNTERS */}
            <div className="w-full reveal-on-scroll">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { num:'2×',  label:'Chief\nMinister',       sub:'of Nagaland',         bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)', border:'#4a8fa8', shape:'2px 24px 2px 24px' },
                  { num:'9×',  label:'Elected\nRepresentative', sub:'Consecutive terms', bg:'linear-gradient(135deg,#1a0a2e,#16213e,#0f3460)', border:'#6c63a8', shape:'24px 2px 24px 2px' },
                  { num:'RS',  label:'Member of\nParliament',  sub:'Rajya Sabha',         bg:'linear-gradient(135deg,#1b2838,#2d4a22,#1a3a1a)', border:'#5a8a4a', shape:'2px 2px 24px 24px' },
                  { num:'40+', label:'Years in\nService',     sub:'Unbroken dedication', bg:'linear-gradient(135deg,#2c1810,#4a2c1a,#2c1810)', border:'#b8913a', shape:'24px 24px 2px 2px' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: s.bg, border: `1px solid ${s.border}40`, borderRadius: s.shape,
                    padding:'clamp(1rem,2.5vw,2rem) clamp(0.5rem,1.5vw,1.25rem)',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:'0.4rem',
                    minHeight:'140px', position:'relative', overflow:'hidden',
                    boxShadow:`0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
                    transition:'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-6px)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';}}>
                    <div style={{ position:'absolute', bottom:'-20px', right:'-20px', width:'70px', height:'70px', borderRadius:'50%', background:`radial-gradient(circle, ${s.border}30, transparent 70%)`, pointerEvents:'none' }} />
                    <span className="font-anton" style={{ fontSize:'clamp(1.8rem,5vw,3rem)', color:s.border, lineHeight:1, position:'relative' }}>{s.num}</span>
                    <p className="font-anton uppercase tracking-widest" style={{ fontSize:'clamp(0.48rem,1.4vw,0.65rem)', color:'rgba(255,255,255,0.85)', margin:0, lineHeight:1.5, whiteSpace:'pre-line' }}>{s.label}</p>
                    <p className="font-poppins" style={{ fontSize:'clamp(0.44rem,1.2vw,0.58rem)', color:'rgba(255,255,255,0.35)', margin:0 }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TIMELINE ═══════════════════════ */}
      <section
        id="journey"
        className="relative overflow-hidden"
        style={{
          background: theme === 'dark' ? 'linear-gradient(160deg, #1a0533 0%, #2d0f5c 30%, #3b0f7a 60%, #2d0f5c 80%, #1a0533 100%)' : 'var(--bg-primary)',
          marginTop: '-80px',
          borderRadius: '60px 60px 0 0',
          paddingTop: '100px',
          paddingBottom: '120px',
          position: 'relative',
          zIndex: 2,
          boxShadow: theme === 'dark' ? '0 -20px 60px rgba(91,33,182,0.3)' : '0 -20px 60px var(--shadow)',
        }}
      >
        {/* Animated waves - CONTAINED within overflow:hidden parent */}
        {theme === 'dark' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden', height: '90px' }}>
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow3 9s linear infinite' }}>
              <path d="M0,45 C180,80 360,10 540,45 C720,80 900,10 1080,45 C1260,80 1350,20 1440,45 L1440,0 L0,0 Z" fill="rgba(10,5,22,0.3)" />
            </svg>
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow2 6s linear infinite' }}>
              <path d="M0,55 C200,20 400,70 600,40 C800,10 1000,65 1200,35 C1320,18 1380,50 1440,55 L1440,0 L0,0 Z" fill="rgba(10,5,22,0.55)" />
            </svg>
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow1 4s linear infinite' }}>
              <path d="M0,60 C120,30 240,75 360,50 C480,25 600,70 720,45 C840,20 960,65 1080,40 C1200,15 1320,55 1440,60 L1440,0 L0,0 Z" fill="#0a0516" />
            </svg>
          </div>
        )}

        {/* Background blobs - contained */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', top: '-100px', left: '-100px', borderRadius: '50%', animation: 'blobDrift 12s ease-in-out infinite alternate' }} />
          <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', bottom: '-80px', right: '-80px', borderRadius: '50%', animation: 'blobDrift 15s ease-in-out infinite alternate-reverse' }} />
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', width: `${8 + i * 2}px`, height: `${8 + i * 2}px`, borderRadius: '50%', background: `rgba(124,58,237,${0.1 + i * 0.03})`, top: `${10 + i * 13}%`, left: `${5 + i * 13}%`, animation: `floatDot ${9 + i * 1.5}s ease-in-out ${i * 1.2}s infinite alternate` }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-20 reveal-on-scroll reveal-heading">
            <h2 className="text-clamp-section mb-4 font-anton"><span className="title-timeline">Political </span><span className="title-timeline-accent">Timeline</span></h2>
            <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(90deg, #ffffff, #ede9fe)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { year: '1975–1982', title: 'Student Leader', desc: 'President, Zeliangrong Students Union, Kohima. Began grassroots activism and social advocacy across Nagaland.', subpageId: 'journey-student' },
              { year: '1982', title: 'First Electoral Contest', desc: 'Contested from Tening Constituency for the Nagaland Legislative Assembly. Built lasting voter trust despite the loss.', subpageId: 'journey-1982' },
              { year: '1989', title: 'First Victory', desc: "Elected as MLA from Tening (Naga People's Council). Appointed Minister of State for Relief & Rehabilitation.", subpageId: 'journey-1989' },
              { year: '1993–1998', title: 'Re-elected MLA', desc: 'Minister of State for Relief & Rehabilitation. Deepened rural empowerment and grassroots governance reforms.', subpageId: 'journey-1993' },
              { year: '1998–2003', title: 'Cabinet Minister', desc: 'Minister for Environment, Forests, Geology & Mining under CM S.C. Jamir. Championed sustainable resource use.', subpageId: 'journey-1998' },
              { year: '2004–2008', title: 'Member of Parliament', desc: 'Represented Nagaland in the Rajya Sabha. Elevated Northeast development issues to the national stage.', subpageId: 'journey-parliament' },
              { year: '2014', title: '19th Chief Minister', desc: 'Appointed Chief Minister of Nagaland. Spearheaded the Naga Peace Process and major infrastructure programs.', subpageId: 'journey-2014' },
              { year: '2017', title: 'Second Term as CM', desc: 'Returned as Chief Minister for a second term in July 2017. Continued the Nagaland Vision 2030 developmental agenda.', subpageId: 'journey-2017' },
              { year: '2023–Present', title: 'Deputy Chief Minister', desc: "Holds Planning & Transformation and National Highway portfolios. Leading Nagaland's connectivity revolution.", subpageId: 'journey-deputy' },
            ].map((item, index) => (
              <div key={index} className="reveal-on-scroll">
                <div
                  onClick={() => openSubpage(item.subpageId)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={hoveredCard === index ? hoveredCardStyle : {
                    ...cardBase,
                    animation: `${index % 2 === 0 ? 'cardFloatLeft' : 'cardFloatRight'} ${3.2 + (index % 3) * 0.6}s ease-in-out ${index * 0.25}s infinite alternate`,
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)', borderRadius: '1px' }} />
                  <span style={{ fontFamily: 'Anton, sans-serif', color: '#7c3aed', fontSize: '1rem', display: 'block', marginBottom: '0.4rem' }}>{item.year}</span>
                  <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color:'var(--text-primary)' }}>
                    {item.title}
                    <ArrowRight size={14} style={{ opacity: hoveredCard === index ? 1 : 0, transition: 'opacity 0.3s', color: 'var(--accent-gold)', flexShrink: 0 }} />
                  </h3>
                  <p style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom waves - contained */}
        {theme === 'dark' && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden', height: '90px' }}>
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow3 9s linear infinite' }}>
              <path d="M0,45 C180,10 360,80 540,45 C720,10 900,80 1080,45 C1260,10 1350,70 1440,45 L1440,90 L0,90 Z" fill="rgba(7,3,15,0.25)" />
            </svg>
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow2 6s linear infinite' }}>
              <path d="M0,55 C200,80 400,20 600,50 C800,80 1000,15 1200,55 C1320,75 1380,35 1440,55 L1440,90 L0,90 Z" fill="rgba(7,3,15,0.55)" />
            </svg>
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow1 4s linear infinite' }}>
              <path d="M0,60 C120,80 240,30 360,55 C480,80 600,25 720,50 C840,75 960,20 1080,45 C1200,70 1320,35 1440,60 L1440,90 L0,90 Z" fill="#07030f" />
            </svg>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'120px', background:'linear-gradient(180deg, transparent 0%, #07030f 100%)', pointerEvents:'none' }} />
          </div>
        )}
      </section>

      {/* ═══════════════════════ VISION ═══════════════════════ */}
      <section id="vision" className="py-24 relative overflow-hidden section-2" style={{ background: "var(--bg-primary)" }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'80px', background: theme === 'dark' ? 'linear-gradient(180deg,#07030f 0%,transparent 100%)' : 'transparent', pointerEvents:'none', zIndex:1 }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ position:"relative", zIndex: 2 }}>
          <div className="text-center mb-16 reveal-on-scroll reveal-heading">
            <h2 className="text-clamp-section mb-4 font-anton"><span className="title-vision">A Vision for </span><span className="title-vision-gold">Nagaland</span></h2>
            <p className="font-poppins uppercase tracking-widest text-sm" style={{ color:"var(--text-muted)", letterSpacing:"0.25em" }}>Building a stronger, resilient future</p>
          </div>
          <style>{`
            @keyframes flipInCenter {
              0%   { opacity:0; transform: perspective(800px) rotateY(-90deg) scale(0.8); }
              60%  { transform: perspective(800px) rotateY(8deg) scale(1.02); }
              100% { opacity:1; transform: perspective(800px) rotateY(0deg) scale(1); }
            }
            @keyframes flipInLeft {
              0%   { opacity:0; transform: perspective(800px) rotateY(90deg) translateX(-40px) scale(0.85); }
              60%  { transform: perspective(800px) rotateY(-6deg) translateX(4px) scale(1.01); }
              100% { opacity:1; transform: perspective(800px) rotateY(0deg) translateX(0) scale(1); }
            }
            @keyframes flipInRight {
              0%   { opacity:0; transform: perspective(800px) rotateY(-90deg) translateX(40px) scale(0.85); }
              60%  { transform: perspective(800px) rotateY(6deg) translateX(-4px) scale(1.01); }
              100% { opacity:1; transform: perspective(800px) rotateY(0deg) translateX(0) scale(1); }
            }
            .vision-card-0 { opacity:0; }
            .vision-card-1 { opacity:0; }
            .vision-card-2 { opacity:0; }
            .vision-card-0.flip-visible { animation: flipInCenter 0.9s cubic-bezier(0.22,1,0.36,1) 0s forwards; }
            .vision-card-1.flip-visible { animation: flipInLeft  0.9s cubic-bezier(0.22,1,0.36,1) 0.25s forwards; }
            .vision-card-2.flip-visible { animation: flipInRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.45s forwards; }
          `}</style>
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {[
              { icon: <Shield size={28} />, title: 'Peace & Unity', desc: 'Committed to an amicable and lasting solution to the Naga political issue that respects Naga aspirations and ensures lasting peace.', subpageId: 'vision-peace', bg: 'linear-gradient(145deg, #0a1628 0%, #0d2347 50%, #112d5c 100%)', accent: '#5b9bd5', accentDim: 'rgba(91,155,213,0.15)', shape: '24px 24px 80px 24px' },
              { icon: <Zap size={28} />, title: 'Development', desc: 'Championing road connectivity, healthcare, education, and economic growth across every district of Nagaland.', subpageId: 'vision-development', bg: 'linear-gradient(145deg, #1a0e00 0%, #2d1f00 50%, #3d2900 100%)', accent: '#c9a84c', accentDim: 'rgba(201,168,76,0.15)', shape: '80px 24px 24px 24px' },
              { icon: <Heart size={28} />, title: 'Youth & Future', desc: 'Empowering youth to be job creators, not job seekers. Fostering entrepreneurship, skill development, and self-reliance.', subpageId: 'vision-youth', bg: 'linear-gradient(145deg, #06160d 0%, #0d2418 50%, #0f2c1c 100%)', accent: '#4caf7d', accentDim: 'rgba(76,175,125,0.15)', shape: '24px 80px 24px 24px' },
            ].map((pillar, index) => (
              <div
                key={index}
                className={`vision-card-${index} cursor-pointer`}
                ref={el => {
                  if (!el) return;
                  const obs = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) { el.classList.add('flip-visible'); obs.disconnect(); }
                  }, { threshold: 0.15 });
                  obs.observe(el);
                }}
                onClick={() => openSubpage(pillar.subpageId)}
                style={{
                  background: pillar.bg, borderRadius: pillar.shape,
                  border: `1px solid ${pillar.accent}25`,
                  padding: 'clamp(1.5rem,3.5vw,2.75rem)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  gap: '1rem', position: 'relative', overflow: 'hidden',
                  boxShadow: `0 12px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-8px) scale(1.01)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0) scale(1)';}}>
                <div style={{ position:'absolute', bottom:'-1rem', right:'-1rem', width:'100px', height:'100px', borderRadius:'50%', background:`radial-gradient(circle, ${pillar.accent}12, transparent 70%)`, pointerEvents:'none' }} />
                <div style={{ width:'52px', height:'52px', borderRadius:'50%', background: pillar.accentDim, border:`1.5px solid ${pillar.accent}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ color: pillar.accent }}>{pillar.icon}</span>
                </div>
                <h3 className="font-anton tracking-wide" style={{ fontSize:'clamp(1.1rem,3vw,1.5rem)', color:'#f0ece4', margin:0 }}>{pillar.title}</h3>
                <div style={{ width:'36px', height:'2px', background:`linear-gradient(90deg, ${pillar.accent}, transparent)`, borderRadius:'1px' }} />
                <p className="font-poppins" style={{ fontSize:'clamp(0.78rem,2vw,0.88rem)', color:'rgba(220,215,205,0.7)', lineHeight:1.75, margin:0, flexGrow:1 }}>{pillar.desc}</p>
                <div style={{ paddingTop:'0.75rem', borderTop:`1px solid rgba(255,255,255,0.06)`, width:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="font-poppins uppercase tracking-widest" style={{ fontSize:'0.58rem', color: pillar.accent }}>Explore Policy →</span>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal-on-scroll reveal-fade">
            <div style={{ maxWidth:'52rem', margin:'0 auto', position:'relative', padding:'2rem clamp(1.5rem,4vw,3rem)' }}>
              <span className="font-anton" style={{ position:'absolute', top:'-1rem', left:'1.5rem', fontSize:'5rem', color:'rgba(201,168,76,0.12)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>"</span>
              <div style={{ borderLeft:'3px solid #c9a84c', paddingLeft:'1.5rem' }}>
                <p className="font-poppins" style={{ fontSize:'0.65rem', color:'#c9a84c', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.75rem' }}>T.R. Zeliang — Deputy Chief Minister, Nagaland</p>
                <h2 className="font-anton" style={{ fontSize:'clamp(1rem,3vw,1.75rem)', lineHeight:1.55, color: theme === 'dark' ? '#f0ece4' : '#0a1628', letterSpacing:'0.02em', margin:0 }}>
                  "Together we can build a society that is strong, resilient, just, inclusive and prosperous."
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ INITIATIVES ═══════════════════════ */}
      <section id="initiatives" className="py-24 section-3" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6 reveal-on-scroll reveal-heading">
            <div>
              <h2 className="font-anton text-clamp-section text-[var(--text-primary)]">Key <span className="text-[var(--accent-gold)]">Initiatives</span></h2>
              <p className="font-poppins text-[var(--text-muted)] mt-2">Strategic portfolios for state transformation</p>
            </div>
            <div className="hidden md:block w-32 h-px bg-[var(--accent-gold)]"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto md:max-w-none">
            {[
              { title: 'Planning & Transformation', desc: "Steering Nagaland's long-term development blueprint through strategic resource allocation and modern governance frameworks.", icon: <Target /> },
              { title: 'National Highway Development', desc: "Improving connectivity across the state's difficult terrain to foster trade, tourism, and accessibility for all citizens.", icon: <MapPin /> },
              { title: 'Agriculture & Allied Sectors', desc: 'Promoting rural livelihoods and food security by empowering farmers with modern technology and market linkages.', icon: <Users /> },
              { title: 'Education & Skill Development', desc: "Investing in Nagaland's human capital by modernizing schools and creating vocational training centers for the youth.", icon: <GraduationCap /> },
            ].map((item, index) => (
              <div key={index} className="premium-3d-card flex gap-5 items-start p-6 cursor-pointer reveal-on-scroll">
                <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center shrink-0 border border-white/40 icon-accent">
                  <span style={{ color: 'var(--card-accent-dark)' }}>{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-anton mb-2 tracking-wide" style={{ fontSize: 'clamp(1rem,3vw,1.4rem)' }}>{item.title}</h3>
                  <p className="font-poppins text-sm leading-relaxed opacity-90">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ACHIEVEMENTS ═══════════════════════ */}
      <section id="achievements" className="py-28 text-navy section-4 overflow-hidden" style={{ position:'relative', background: theme === 'dark' ? 'linear-gradient(180deg, #00000f 0%, #01010f 30%, #000005 60%, #000000 100%)' : 'var(--bg-primary)' }}>
        {/* Stars - all contained */}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 22% 8%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 35% 25%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 48% 5%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 58% 18%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 70% 12%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1px 1px at 82% 28%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 91% 7%, rgba(255,255,255,0.65) 0%, transparent 100%)`, pointerEvents:'none', zIndex:0 }} />}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1.5px 1.5px at 8% 20%, rgba(255,255,240,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 25% 35%, rgba(200,220,255,0.95) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 42% 10%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 60% 30%, rgba(255,240,220,0.9) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 75% 22%, rgba(255,255,255,1) 0%, transparent 100%)`, animation:'starTwinkle1 4s ease-in-out infinite alternate', pointerEvents:'none', zIndex:0 }} />}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'120px', background: theme === 'dark' ? 'linear-gradient(180deg, #07030f 0%, transparent 100%)' : 'transparent', pointerEvents:'none', zIndex:1 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ position:'relative', zIndex:1 }}>
          <div className="text-center mb-16 reveal-on-scroll reveal-heading">
            <p className="font-poppins text-xs uppercase tracking-[0.3em] mb-3 text-[var(--text-muted)]">A life in service</p>
            <h2 className="font-anton mb-4" style={{ fontSize:'clamp(1.8rem,5vw,3.5rem)', letterSpacing:'0.02em', color: 'var(--text-primary)' }}><span className="title-milestone">MILESTONES OF </span><span className="title-milestone-accent">SERVICE</span></h2>
            <div style={{ width:'60px', height:'3px', background: 'var(--accent-gold)', margin:'0 auto', borderRadius:'2px' }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label:'Twice Chief Minister',    sub:'of Nagaland',              id:'achievement-cm',       num:'2×',  bg:'linear-gradient(135deg,#0a1628,#0d2347)', accent:'#5b9bd5', shape:'20px 4px 20px 4px' },
              { label:'Elected Representative', sub:'Nine consecutive terms',    id:'achievement-9time',    num:'9×',  bg:'linear-gradient(135deg,#1a0e00,#3d2900)', accent:'#c9a84c', shape:'4px 20px 4px 20px' },
              { label:'Member of Parliament',   sub:'Rajya Sabha',               id:'achievement-mp',       num:'RS',  bg:'linear-gradient(135deg,#06160d,#0f2c1c)', accent:'#4caf7d', shape:'20px 20px 4px 4px' },
              { label:'Years of Service',       sub:'Unbroken dedication',       id:'achievement-40years',  num:'40+', bg:'linear-gradient(135deg,#160a1a,#2e0f3a)', accent:'#9b72cf', shape:'4px 4px 20px 20px' },
              { label:'Led NPF',                sub:'As single largest party',   id:'achievement-npf',      num:'①',  bg:'linear-gradient(135deg,#0f1a0a,#1e3510)', accent:'#7ab648', shape:'4px 20px 4px 20px' },
              { label:'Chairman, UDA',          sub:'Urban Development Auth.',   id:'achievement-uda',      num:'UDA', bg:'linear-gradient(135deg,#0d1520,#162840)', accent:'#4a8fa8', shape:'20px 4px 20px 4px' },
              { label:'Naga Resolution',        sub:'Lifelong advocate',         id:'achievement-naga',     num:'☮',  bg:'linear-gradient(135deg,#1a0f00,#2e1f00)', accent:'#e8a830', shape:'4px 4px 20px 20px' },
              { label:'NE Development',         sub:'Champion of the region',    id:'achievement-ne',       num:'NE',  bg:'linear-gradient(135deg,#14070f,#280e1e)', accent:'#c45f8a', shape:'20px 20px 4px 4px' },
            ].map((item, index) => (
              <div key={index} onClick={() => openSubpage(item.id)} className="reveal-on-scroll reveal-zoom cursor-pointer" style={{
                background: item.bg, border: `1px solid ${item.accent}25`, borderRadius: item.shape,
                padding: 'clamp(0.85rem,2vw,1.5rem) clamp(0.6rem,1.5vw,1.25rem)',
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
                minHeight: '140px', position: 'relative', overflow: 'hidden',
                boxShadow: `0 6px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-6px) scale(1.02)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0) scale(1)';}}>
                <div style={{ position:'absolute', top:'-15px', right:'-15px', width:'60px', height:'60px', borderRadius:'50%', background:`radial-gradient(circle, ${item.accent}20, transparent 70%)`, pointerEvents:'none' }} />
                <span className="font-anton" style={{ fontSize:'clamp(1.3rem,3.5vw,2rem)', color:item.accent, lineHeight:1, position:'relative' }}>{item.num}</span>
                <h4 className="font-anton uppercase" style={{ fontSize:'clamp(0.55rem,1.6vw,0.75rem)', color:'#f0ece4', lineHeight:1.3, margin:'0.1rem 0 0' }}>{item.label}</h4>
                <p className="font-poppins" style={{ fontSize:'clamp(0.45rem,1.2vw,0.6rem)', color:'rgba(220,215,205,0.4)', margin:0 }}>{item.sub}</p>
                <div style={{ marginTop:'auto', paddingTop:'0.5rem', borderTop:`1px solid rgba(255,255,255,0.05)` }}>
                  <span className="font-poppins uppercase tracking-widest" style={{ fontSize:'0.45rem', color:`${item.accent}80` }}>Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VALUES ═══════════════════════ */}
      <section className="py-24 relative overflow-hidden section-2" style={{ background: theme === 'dark' ? 'linear-gradient(180deg, #000000 0%, #00000a 50%, #00000f 100%)' : 'var(--bg-primary)' }}>
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1px 1px at 5% 10%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 18% 28%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 55% 35%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 78% 22%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 40% 55%, rgba(255,255,255,1) 0%, transparent 100%)`, animation:'starTwinkle1 5s ease-in-out infinite alternate', pointerEvents:'none', zIndex:0 }} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex:1 }}>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Integrity', id: 'value-integrity', num: '01', desc: 'Unwavering commitment to honest governance and ethical leadership in every decision made for the state.', bg: 'linear-gradient(160deg, #0a1628 0%, #0d2347 100%)', accent: '#5b9bd5', style: 'split' },
              { title: 'Unity', id: 'value-unity', num: '02', desc: 'Bringing together diverse voices and tribes to work towards a common goal of a peaceful and prosperous Nagaland.', bg: 'linear-gradient(160deg, #1a0e00 0%, #3d2900 100%)', accent: '#c9a84c', style: 'split' },
              { title: 'Progress', id: 'value-progress', num: '03', desc: 'A relentless drive to modernize infrastructure, economy, and social systems while preserving our rich heritage.', bg: 'linear-gradient(160deg, #06160d 0%, #0f2c1c 100%)', accent: '#4caf7d', style: 'line' },
            ].map((value, index) => (
              <div key={index} className="reveal-on-scroll cursor-pointer" onClick={() => openSubpage(value.id)} style={{
                background: value.bg,
                borderRadius: index === 0 ? '20px 4px 20px 4px' : index === 1 ? '4px 20px 4px 20px' : '20px 20px 4px 4px',
                border: `1px solid ${value.accent}20`, overflow: 'hidden', position: 'relative',
                boxShadow: '0 12px 50px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                minHeight: '260px',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-6px)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';}}>
                {value.style === 'split' && <>
                  <div style={{ background:`${value.accent}18`, borderBottom:`2px solid ${value.accent}40`, padding:'1.25rem clamp(1.25rem,3vw,2.25rem)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <h3 className="font-anton" style={{ fontSize:'clamp(1.3rem,3.5vw,1.9rem)', color:'#f0ece4', margin:0 }}>{value.title}</h3>
                    <span className="font-anton" style={{ fontSize:'2rem', color:`${value.accent}30`, lineHeight:1 }}>{value.num}</span>
                  </div>
                  <div style={{ padding:'1.5rem clamp(1.25rem,3vw,2.25rem)', display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <p className="font-poppins" style={{ fontSize:'clamp(0.8rem,2vw,0.9rem)', color:'rgba(220,215,205,0.65)', lineHeight:1.75, margin:0 }}>{value.desc}</p>
                    <span className="font-poppins uppercase tracking-widest" style={{ fontSize:'0.58rem', color:value.accent }}>Read More →</span>
                  </div>
                </>}
                {value.style === 'line' && <>
                  <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'4px', background:`linear-gradient(180deg, ${value.accent}, ${value.accent}30)` }} />
                  <div style={{ padding:'2rem clamp(1.25rem,3vw,2.25rem) 2rem 2.5rem', display:'flex', flexDirection:'column', gap:'1rem', height:'100%' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                      <p className="font-poppins uppercase tracking-widest" style={{ fontSize:'0.58rem', color:`${value.accent}90`, margin:0 }}>Core Value</p>
                      <span className="font-anton" style={{ fontSize:'2rem', color:`${value.accent}20`, lineHeight:1 }}>{value.num}</span>
                    </div>
                    <h3 className="font-anton" style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', color:'#f0ece4', margin:0, lineHeight:1.1 }}>{value.title}</h3>
                    <p className="font-poppins" style={{ fontSize:'clamp(0.8rem,2vw,0.9rem)', color:'rgba(220,215,205,0.65)', lineHeight:1.75, margin:0, flexGrow:1 }}>{value.desc}</p>
                    <span className="font-poppins uppercase tracking-widest" style={{ fontSize:'0.58rem', color:value.accent }}>Read More →</span>
                  </div>
                </>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CONTACT ═══════════════════════ */}
      <section id="contact" className="py-24 relative overflow-hidden section-3" style={{ background: theme === 'dark' ? 'linear-gradient(180deg, #00000f 0%, #030010 60%, #07030f 100%)' : 'var(--bg-secondary)' }}>
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1px 1px at 8% 20%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 35% 15%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 65% 75%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 88% 10%, rgba(255,255,255,1) 0%, transparent 100%)`, pointerEvents:'none', zIndex:0 }} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex:1 }}>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="reveal-on-scroll reveal-left">
              <h2 className="font-anton text-clamp-section mb-8 text-[var(--text-primary)]">Connect with the <span className="text-[var(--accent-gold)]">Office</span></h2>
              <div className="space-y-5">
                {[
                  { icon: <MapPin size={22} />, title: 'Office Address', value: "Old Minister's Hill, Kohima, Nagaland", rowClass: 'office-row-1' },
                  { icon: <Briefcase size={22} />, title: 'Constituency', value: 'Peren District, Nagaland', rowClass: 'office-row-2' },
                  { icon: <Shield size={22} />, title: 'Political Party', value: "Naga People's Front (NPF)", rowClass: 'office-row-3' },
                ].map((item, i) => (
                  <div key={i} className={`premium-3d-card p-5 flex items-start gap-5 ${item.rowClass}`}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 icon-accent">
                      <span style={{ color: 'var(--card-accent-dark)' }}>{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-anton text-lg mb-1">{item.title}</h4>
                      <p className="font-poppins text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center md:justify-start mt-8 pt-4">
                <a href="https://www.facebook.com/TRZeliang/" target="_blank" rel="noopener noreferrer" style={{ width:'46px', height:'46px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(145deg, #1877f2, #0d5abf)', boxShadow:'0 4px 15px rgba(24,119,242,0.5)', border:'1.5px solid rgba(255,255,255,0.25)', position:'relative', overflow:'hidden', transition:'transform 0.3s ease', cursor:'pointer' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-3px) scale(1.08)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0) scale(1)';}}>
                  <Facebook size={18} color="white" />
                </a>
                <a href="https://www.instagram.com/trzeliang?igsh=ZTM1aTNrcWg5Y3dr" target="_blank" rel="noopener noreferrer" style={{ width:'46px', height:'46px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(145deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888)', boxShadow:'0 4px 15px rgba(220,39,67,0.5)', border:'1.5px solid rgba(255,255,255,0.25)', position:'relative', overflow:'hidden', transition:'transform 0.3s ease', cursor:'pointer' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-3px) scale(1.08)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0) scale(1)';}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="reveal-on-scroll reveal-right">
              <div className="premium-3d-card p-8" style={{ border: "1px solid var(--border)" }}>
                <h3 className="font-anton text-2xl mb-7" style={{ color: '#ffffff' }}>Send a Message</h3>
                <div className="space-y-5">
                  <input type="text" placeholder="Your Name" className="contact-input w-full bg-transparent py-3 outline-none transition-colors duration-300 font-poppins" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'} />
                  <input type="email" placeholder="Your Email" className="contact-input w-full bg-transparent py-3 outline-none transition-colors duration-300 font-poppins" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'} />
                  <input type="text" placeholder="Subject" className="contact-input w-full bg-transparent py-3 outline-none transition-colors duration-300 font-poppins" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'} />
                  <textarea placeholder="Your Message" rows={4} className="contact-input w-full bg-transparent py-3 outline-none transition-colors duration-300 font-poppins resize-none" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLTextAreaElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLTextAreaElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'}></textarea>
                  <button type="button" className="w-full mt-2 font-anton uppercase tracking-widest py-3 px-6 rounded-lg text-white cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--accent-gold)", boxShadow: "0 4px 20px var(--shadow)" }}>Submit Message</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="py-12 border-t" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-anton text-3xl text-[var(--accent-gold)] mb-1">T.R. ZELIANG</h2>
          <p className="font-poppins text-sm text-[var(--text-muted)] tracking-widest uppercase mb-8">Deputy Chief Minister, Nagaland</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => openSubpage(link.id, false)} className="font-poppins text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors text-xs uppercase tracking-widest cursor-pointer">
                {link.name}
              </button>
            ))}
          </div>
          <p className="font-poppins text-[var(--text-muted)] text-xs mb-3">© 2026 Office of T.R. Zeliang. All rights reserved.</p>
          <p className="font-poppins text-[var(--text-muted)] text-xs tracking-wider">Developed by<br /><span className="text-[var(--accent-gold)] font-semibold">NITI Technologies</span></p>
        </div>
      </footer>

      <a href="#home" className={`fixed bottom-8 right-8 w-12 h-12 bg-[var(--accent-gold)] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-40 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <ChevronRight size={24} className="-rotate-90" />
      </a>
    </div>
  );
}