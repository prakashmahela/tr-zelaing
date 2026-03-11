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

  // FIX 3: save scroll + open subpage
  const openSubpage = (id: string, saveScroll = true) => {
    if (saveScroll) setSavedScrollY(window.scrollY);
    setActiveSubpage(id);
    window.scrollTo(0, 0);
  };

  // FIX 3: close subpage + restore scroll
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
      document.querySelectorAll('.parallax-layer').forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || '0');
        (el as HTMLElement).style.transform = `translateY(${-(window.scrollY * speed)}px)`;
      });
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

  // Parallax scroll for sections
  useEffect(() => {
    const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
    const handleParallax = () => {
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax || '0.15');
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    };
    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => window.removeEventListener('scroll', handleParallax);
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

  // FIX 2: card styles
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

  // ── SUBPAGE COMPONENTS ───────────────────────────────────────────────────────
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
    <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <BackBtn />
        <h1 className="text-3xl font-anton mb-6 text-[var(--text-primary)] tracking-tight">{title}</h1>
        <div className="space-y-6 font-poppins text-[var(--text-secondary)] leading-relaxed text-base">{children}</div>
      </div>
    </div>
  );

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="relative">
      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
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

        /* ── PREMIUM GLOBAL OVERRIDES ── */
        body { background: var(--bg-primary); }

        /* Futuristic scanline overlay */
        .relative::before {
          content: none;
        }

        /* Dark premium card */
        .premium-card {
          background: var(--card-bg) !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 20px 60px var(--shadow), inset 0 1px 0 rgba(167,139,250,0.08) !important;
          border-radius: 20px;
        }

        /* Hero color-flow for name */
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

        /* Timeline title */
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

        /* Vision title */
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

        /* Milestone title */
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

        /* About section heading */
        h2.text-clamp-section { color: var(--text-primary); }

        /* Subpage styling */
        .fixed.inset-0.z-\[100\].bg-white {
          background: var(--bg-primary) !important;
        }
        
        /* Timeline line */
        .timeline-line {
          background: var(--border) !important;
        }
        .timeline-dot {
          background: var(--accent-gold) !important;
          box-shadow: 0 0 20px var(--shadow) !important;
        }

        /* ── PREMIUM REVEAL ANIMATIONS ── */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(50px) scale(0.97);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
          will-change: opacity, transform;
        }
        .reveal-on-scroll.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        /* Staggered delays for children */
        .reveal-on-scroll:nth-child(1) { transition-delay: 0s; }
        .reveal-on-scroll:nth-child(2) { transition-delay: 0.1s; }
        .reveal-on-scroll:nth-child(3) { transition-delay: 0.2s; }
        .reveal-on-scroll:nth-child(4) { transition-delay: 0.3s; }
        .reveal-on-scroll:nth-child(5) { transition-delay: 0.4s; }
        /* Slide from left */
        .reveal-left {
          opacity: 0;
          transform: translateX(-60px) scale(0.97);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-left.visible { opacity: 1; transform: translateX(0) scale(1); }
        /* Slide from right */
        .reveal-right {
          opacity: 0;
          transform: translateX(60px) scale(0.97);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-right.visible { opacity: 1; transform: translateX(0) scale(1); }
        /* Zoom in */
        .reveal-zoom {
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-zoom.visible { opacity: 1; transform: scale(1); }
        /* Fade only */
        .reveal-fade {
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .reveal-fade.visible { opacity: 1; }
        /* Section heading special reveal */
        .reveal-heading {
          opacity: 0;
          transform: translateY(40px) skewY(2deg);
          transition: opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-heading.visible { opacity: 1; transform: translateY(0) skewY(0); }

        /* Starfield animations */
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

        /* Hero name color flow — keeps original black/gold palette */
        @keyframes heroNameFlow {
          0%   { background-position: 0% center; }
          50%  { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .hero-name-flow {
          background: linear-gradient(90deg,
            var(--text-primary) 0%,
            var(--text-primary) 20%,
            #c9a84c 35%,
            var(--text-primary) 50%,
            var(--text-primary) 65%,
            #f0c060 78%,
            var(--text-primary) 90%,
            var(--text-primary) 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroNameFlow 5s ease infinite;
        }
        .hero-gold-flow {
          background: linear-gradient(90deg,
            var(--accent-gold) 0%,
            #fde68a 20%,
            #f59e0b 35%,
            #ffffff 50%,
            #f59e0b 65%,
            #fde68a 80%,
            var(--accent-gold) 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroNameFlow 4s ease infinite reverse;
        }
        /* Contact form white text & placeholders */
        .contact-input::placeholder { color: rgba(255,255,255,0.6) !important; }
        .contact-input { color: #ffffff !important; caret-color: #ffffff; }

        @keyframes quoteColorFlow {
          0%   { background-position: 0% center; }
          50%  { background-position: 150% center; }
          100% { background-position: 300% center; }
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
            <p className="mt-4">"Our journey is one of collective effort and unwavering determination. We are committed to creating a Nagaland where peace is the foundation and progress is the constant." — T.R. Zeliang.</p>
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
            <p>T.R. Zeliang is married to Smti. Kevizenuo, who has been his constant support throughout his long political career. Together they have raised three children. Despite the rigors of high office, he has always made time for his family and community, known for his simple lifestyle and approachable nature. His faith provides him with the moral compass to navigate the complexities of political life.</p>
          </section>
          <section><SH t="A Philosophy of Service" />
            <p>The guiding principle of T.R. Zeliang's life is the belief that public service is a sacred trust. His philosophy is based on the idea of inclusive growth, where the benefits of development reach the most marginalized sections of society. Throughout his career, he has consistently worked towards the upliftment of the rural poor, the empowerment of women, and the development of the youth.</p>
          </section>
          <section><SH t="Legacy in the Making" />
            <p>As he continues to serve the people of Nagaland as Deputy Chief Minister, T.R. Zeliang's legacy is one of dedication, resilience, and visionary leadership. His journey from a small village to the highest offices of the state is an inspiration to many, and he remains a steadfast voice for the Naga people.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey' && (
        <SubPage title="Political Journey Overview">
          <section><SH t="A Life Dedicated to Public Service" />
            <p>T.R. Zeliang's political journey is a remarkable story of perseverance, vision, and an unshakeable commitment to the people of Nagaland. Spanning more than four decades, his career traces the arc of Nagaland's own political evolution. What makes his story distinctive is not merely the offices he has held, but the consistency of his values and his ability to remain connected to the grassroots even as he rose to the very top of the state's political hierarchy.</p>
            <p className="mt-4">His journey began in the student movements of Kohima, where he first learned to articulate the aspirations of his community and organize collective action. This foundational experience in citizen-led advocacy would define his approach to governance for the rest of his career.</p>
          </section>
          <section><SH t="From the Villages to the Assembly" />
            <p>The transition from student leader to elected representative was neither swift nor easy. T.R. Zeliang contested his first election in 1982, losing but gaining invaluable ground-level experience. He spent the intervening years deepening his roots in the Tening constituency — meeting families, understanding local grievances, and building a network of trust that no political machinery could replicate. When victory came in 1989, it was a mandate built on relationships, not merely rhetoric.</p>
          </section>
          <section><SH t="National Stage and Return to State Leadership" />
            <p>His elevation to the Rajya Sabha in 2004 gave him a national platform to champion the cause of Nagaland and the broader Northeast. Those four years in Parliament widened his perspective considerably. The decades of preparation culminated in his appointment as Chief Minister in May 2014. Today, as Deputy Chief Minister, he continues that work with the same energy and conviction that have always defined him.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'legacy' && (
        <SubPage title="The Political Journey of T.R. Zeliang">
          <section><SH t="A Childhood Forged in the Hills" />
            <p>Taditui Rangkau Zeliang was born on February 21, 1952, in the remote village of Mbaupungwa, nestled in the hills of Peren District, Nagaland. Growing up in a region where roads were scarce, schools were few, and government services rarely reached, young Zeliang witnessed firsthand the consequences of neglect and underdevelopment. These early experiences planted the seed of a lifelong vocation — the desire to serve, to improve, and to change.</p>
            <p className="mt-4">His father, Lt. Rangleu Zeliang, was a man of standing and principle within the community, and the values he modelled — hard work, humility, and responsibility to one's people — would define his son's public life. Zeliang pursued his early education at Don Bosco School in Dibrugarh, Assam, and later completed his Bachelor of Arts at Kohima College. Education gave him language, perspective, and ambition; the hills gave him roots and purpose.</p>
          </section>
          <section><SH t="The Activist Years: Building a Political Identity (1975–1982)" />
            <p>Before he ever contested an election, Zeliang was already shaping public life through student activism. As President of the Zeliangrong Students Union, Kohima, he organized campaigns for better education, accommodation, and representation for students from his community. He joined the Naga Students' Federation, engaging with the full breadth of Naga political consciousness — the question of identity, self-determination, and what it means to be Naga in modern India.</p>
            <p className="mt-4">These years taught him the fundamentals of democratic leadership: how to build coalitions, how to communicate across tribal lines, and how to translate grievance into organized, peaceful advocacy. He learned that durable change comes not through confrontation alone, but through sustained engagement with those who hold power.</p>
          </section>
          <section><SH t="First Steps in Electoral Politics (1982–1989)" />
            <p>Zeliang contested his first election in 1982, an experience that ended in defeat but gave him invaluable political education. Far from discouraging him, the experience deepened his resolve. He spent the next seven years strengthening his constituency presence — listening to farmers, elders, women's groups, and young people — building the kind of trust that cannot be manufactured overnight.</p>
            <p className="mt-4">In 1989, he stood again, this time from the Tening constituency, and won decisively. It was the beginning of an unbroken electoral record that would span more than three decades, through nine consecutive victories that made him one of the most reliably returned legislators in Nagaland's history.</p>
          </section>
          <section><SH t="Minister of the Crown: Building Expertise Across Portfolios" />
            <p>Over successive terms, Zeliang held a series of ministerial portfolios that gave him deep domain knowledge across critical sectors. As Minister for Relief and Rehabilitation, he coordinated responses to natural disasters in some of Nagaland's most difficult terrain. As Minister for Environment and Forests, he championed conservation policies that balanced ecological protection with the livelihood needs of forest-dependent communities. In Geology and Mining, he worked to ensure that Nagaland's natural resources were developed responsibly and for the benefit of local people.</p>
            <p className="mt-4">Each portfolio left its mark — not just in policy, but in Zeliang's growing understanding of the complexity and interconnectedness of governance. He developed the conviction that no single sector exists in isolation: roads require environmental clearances; forests sustain agriculture; education enables economic growth. A good minister, he believed, must think like a systems architect.</p>
          </section>
          <section><SH t="The Chief Ministership: First Term (2014–2017)" />
            <p>On May 22, 2014, T.R. Zeliang was sworn in as the 19th Chief Minister of Nagaland — a moment that represented the culmination of four decades of public service and the recognition by his party, the NPF, that he was the right person to lead the state at a critical juncture. His first term was defined by three priorities: advancing the Naga peace process, accelerating infrastructure development, and reforming public administration.</p>
            <p className="mt-4">On the peace front, he engaged with both the Government of India and the various Naga political groups with a diplomacy born of deep cultural understanding. He consistently argued that the solution to the Naga political issue must be inclusive — that no lasting peace could be built if significant sections of Naga society felt left out of the settlement. He worked to create the conditions for dialogue, not just between governments, but within Naga society itself.</p>
          </section>
          <section><SH t="Return to the Helm: Second Term and Deputy Chief Minister (2017–Present)" />
            <p>After a brief interruption, Zeliang returned as Chief Minister in July 2017, continuing the developmental agenda that had defined his first term. Following the 2023 elections, he transitioned to the role of Deputy Chief Minister, bringing his experience and stature to bear in a new governmental configuration.</p>
            <p className="mt-4">As Deputy Chief Minister, he has continued to focus on the issues that have defined his career — connectivity, youth employment, the Naga political settlement, and the sustainable development of Nagaland's economy. Approaching his fifth decade in public life, T.R. Zeliang remains one of Nagaland's most consequential political figures: a leader whose journey mirrors the story of his state — marked by challenge, resilience, and an enduring belief in a better future.</p>
          </section>
        </SubPage>
      )}

      {/* ═══════════ TIMELINE SUBPAGES ═══════════ */}

      {activeSubpage === 'journey-student' && (
        <SubPage title="Student Leadership & Activism: 1975–1982">
          <section><SH t="The Emergence of a Grassroots Leader" />
            <p>Long before T.R. Zeliang ever stood for election, he was already shaping public life in Nagaland through the power of student activism. The decade between 1975 and 1982 was formative not just for him personally, but for the broader political consciousness of Nagaland's younger generation. It was a period of intense social ferment across the country, and the state of Nagaland was no exception. Issues of identity, governance, and self-determination were being debated passionately in campuses, community halls, and village councils alike.</p>
            <p className="mt-4">Zeliang entered this arena as a young man from the Zeliangrong community, acutely aware of the marginalization felt by people from the Peren region and other rural areas of Nagaland. He channeled that awareness into organized student advocacy, beginning with his election as President of the Zeliangrong Students Union, Kohima, in 1975. This was not a ceremonial role — it required him to engage directly with the concerns of students who had left their villages to pursue education in Kohima and often found themselves navigating an unfamiliar environment.</p>
          </section>
          <section><SH t="President of the Zeliangrong Students Union" />
            <p>As President of the Zeliangrong Students Union, Kohima, Zeliang worked on issues that directly affected the lives of students from his community: access to quality education, availability of hostels and accommodation, and the need for greater representation of the Zeliangrong community in the state's educational and administrative institutions. He organized public meetings, submitted memoranda to government officials, and built coalitions with other student organizations.</p>
            <p className="mt-4">His tenure in this role taught him the fundamentals of political organization — how to build consensus among people with different priorities, how to negotiate with figures in authority, and how to communicate a compelling vision. He was known among his peers for his calm under pressure and his ability to find common ground between competing interests.</p>
          </section>
          <section><SH t="Engagement with the Naga Students' Federation" />
            <p>Following his work with the Zeliangrong Students Union, Zeliang became an active member of the Naga Students' Federation (NSF), the apex body representing students across Nagaland. The NSF was — and remains — one of the most influential civil society organizations in the state, with a history of shaping political developments and holding the government accountable. Membership in the NSF gave Zeliang a much wider platform and exposed him to the full breadth of Naga political discourse.</p>
            <p className="mt-4">Within the NSF, he was involved in campaigns for educational reforms, including improvements to the quality of schooling in rural areas, better facilities in government institutions, and the need for more opportunities for Naga youth in higher education and professional training. He also engaged with the broader question of Naga identity and the political aspirations of the Naga people, developing a nuanced understanding of the various strands of opinion within Naga society.</p>
          </section>
          <section><SH t="Building Foundations for a Political Career" />
            <p>The years of student activism between 1975 and 1982 were not merely a prelude to Zeliang's political career — they were an integral part of it. By the time he decided to contest his first election in 1982, he already had nearly a decade of public engagement behind him. He had built a network of contacts across the state, earned a reputation for integrity and dedication, and developed a deep, experiential understanding of the issues affecting the people of Nagaland.</p>
            <p className="mt-4">His experience in the student movement also gave him something that could not be learned from books or briefings: a genuine connection with ordinary people and their daily struggles. He had sat in village meetings, listened to farmers and teachers and mothers, and understood in a visceral way what was needed for the state to progress. This grounding in grassroots reality would be the bedrock of his political identity for the decades that followed.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-1982' && (
        <SubPage title="The First Step: 1982 Electoral Contest">
          <section><SH t="A Bold Entry into Mainstream Politics" />
            <p>In 1982, T.R. Zeliang made the momentous decision to transition from student leadership to the arena of mainstream electoral politics. He chose to contest from the 6-Tening Assembly Constituency, a region that was then, and remains today, one of the most topographically challenging parts of Nagaland. This decision was not taken lightly; it was the culmination of years of grassroots engagement and a deep-seated desire to bring the concerns of his people to the floor of the state assembly.</p>
            <p className="mt-4">The Tening constituency, located in the Peren district, was characterized by remote villages, limited road connectivity, and a population that felt largely disconnected from the centers of power in Kohima. Zeliang's campaign was a true grassroots effort, involving long treks on foot to reach the most isolated hamlets. He spoke to the elders, the youth, and the women, listening to their stories of hardship and their hopes for a better future.</p>
          </section>
          <section><SH t="The Challenges of a Debut Campaign" />
            <p>As a young debutant in politics, Zeliang faced significant challenges. He was up against established political figures and a system that was often resistant to new voices. His platform was built on the pillars of transparency, rural development, and the protection of Naga rights. The logistical hurdles were immense — in 1982, many parts of the Tening constituency were inaccessible by vehicle. Zeliang and his small team spent weeks on the road, sleeping in village homes and sharing simple meals with the locals.</p>
          </section>
          <section><SH t="The Outcome and Its Significance" />
            <p>Although T.R. Zeliang did not win the seat in his first attempt, the 1982 election was a moral victory. He secured a significant percentage of the vote, establishing himself as a formidable political force in the region. The campaign had allowed him to build a base of loyal supporters who believed in his vision for a more equitable Nagaland. The experience taught him the importance of patience, persistence, and the need for a long-term strategy.</p>
          </section>
          <section><SH t="Continuing the Work Between Elections" />
            <p>The years between 1982 and his eventual victory in 1989 were not years of inactivity. Zeliang continued to involve himself deeply in the affairs of the Tening constituency and the broader Peren region. He attended community events, supported local development initiatives, and maintained the network of relationships he had built during the campaign. By the time the 1989 elections came around, he was not a newcomer asking for a chance; he was a familiar, trusted figure who had earned the right to represent his people.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-1989' && (
        <SubPage title="The Breakthrough: 1989 Victory">
          <section><SH t="A Decisive Mandate from Tening" />
            <p>The 1989 elections in Nagaland were held in a climate of significant political realignment. T.R. Zeliang, having spent the years since his first contest strengthening his ties with the people, contested as a candidate of the Naga People's Council (NPC). His message of change and his track record of consistent engagement resonated deeply with the electorate of the 6-Tening constituency. The victory in 1989 was a decisive mandate — a clear indication that the people of Tening were ready for a new generation of leadership.</p>
          </section>
          <section><SH t="Entry into the Council of Ministers" />
            <p>His talent and his connection with the grassroots were immediately recognized by the state leadership. T.R. Zeliang was appointed as a Minister of State for Relief and Rehabilitation in the new government — a significant responsibility for a first-time MLA. As Minister, he focused on streamlining the delivery of aid to those affected by natural disasters and civil unrest, introducing more transparent procedures and ensuring that relief materials reached remote areas of the state.</p>
          </section>
          <section><SH t="Laying the Foundation for Future Governance" />
            <p>The period following the 1989 victory was one of intense learning. Zeliang had to navigate the complexities of ministerial responsibility while also fulfilling his duties as a representative. He used his position to advocate for the developmental needs of the Peren region, pushing for better roads, improved healthcare, and more educational opportunities. This first term in office was crucial in establishing his reputation as a capable administrator and dedicated legislator.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-1993' && (
        <SubPage title="Consolidation and Service: 1993–1998">
          <section><SH t="Re-election and Continued Mandate" />
            <p>In 1993, T.R. Zeliang sought re-election from the Tening constituency, and the people responded with an even stronger mandate. His first term as an MLA and Minister had proven his commitment to their welfare. The mid-1990s were a challenging time for Nagaland, with various socio-political issues demanding careful and sensitive handling. Zeliang's experience as a grassroots leader and his understanding of the state's complexities made him a valuable asset to the government.</p>
          </section>
          <section><SH t="Focus on Rural Empowerment" />
            <p>During this term, Zeliang's focus remained firmly on rural empowerment. He believed that the true progress of Nagaland could only be measured by the improvement in the lives of those living in the villages. He worked to strengthen local self-governance institutions and to ensure that developmental funds were utilized effectively at the grassroots level. In his constituency, he oversaw the construction of village roads, provision of clean drinking water, and the establishment of primary healthcare centers.</p>
          </section>
          <section><SH t="A Voice for Stability and Progress" />
            <p>As a senior member of the state assembly, Zeliang played a role in the broader political discourse of the state. He was a vocal advocate for political stability and the need for a unified approach to the state's developmental challenges. He worked to build bridges between different political groups and to foster a culture of constructive dialogue in the assembly. By the end of his second term in 1998, he had established himself as a pillar of the state's political establishment.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-1998' && (
        <SubPage title="Cabinet Leadership: 1998–2003">
          <section><SH t="Elevation to Cabinet Rank" />
            <p>The 1998 elections saw T.R. Zeliang return to the Nagaland Legislative Assembly for a third consecutive term. His consistent performance and his growing influence in the state's politics led to his elevation to Cabinet rank. He was appointed as the Minister for Environment and Forests and Geology and Mining in the government led by Chief Minister S.C. Jamir. As a Cabinet Minister, he had a greater role in the formulation of state policy, bringing his characteristic pragmatism and deep understanding of the grassroots to the cabinet table.</p>
          </section>
          <section><SH t="Environmental Stewardship and Resource Management" />
            <p>In the Environment and Forests department, Zeliang was a strong advocate for sustainable resource management. He recognized that Nagaland's forests were its greatest natural asset and must be protected for future generations. He initiated several programs for community-based forest conservation, encouraging local villagers to take an active role in protecting their environment.</p>
            <p className="mt-4">In the Geology and Mining department, he focused on the responsible exploration of the state's mineral wealth, creating a more transparent and efficient system for mining leases while emphasizing environmental safeguards in all mining operations, balancing economic development with ecological protection.</p>
          </section>
          <section><SH t="The Creation of Peren District: A Lasting Legacy" />
            <p>One of the most significant achievements of T.R. Zeliang's tenure as a Cabinet Minister was his role in the creation of Peren as a separate district in 2003. This had been a long-standing demand of the people of the region, and Zeliang worked tirelessly to make it a reality. The creation of the district brought the administration closer to the people, facilitating more focused developmental planning and more efficient delivery of public services.</p>
            <p className="mt-4">The establishment of Peren district was a major milestone for the Zeliangrong people and a testament to Zeliang's commitment to their welfare. This achievement remains one of the most enduring legacies of his time as a Cabinet Minister — a move that transformed the political and developmental landscape of the region.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-parliament' && (
        <SubPage title="National Representation: Rajya Sabha 2004–2008">
          <section><SH t="A New Stage: The Parliament of India" />
            <p>The year 2004 marked a significant turning point in T.R. Zeliang's political trajectory. Having established himself as one of Nagaland's most respected and capable legislators, he was elected to represent the state in the Rajya Sabha, the Upper House of the Parliament of India. This elevation to the national stage was both a recognition of his stature within Nagaland's political landscape and an opportunity to amplify the voice of the Naga people in the corridors of national power.</p>
            <p className="mt-4">The transition from a state legislator to a Member of Parliament was not merely a change of venue — it was a transformation of scale and scope. Zeliang approached this new responsibility with the same seriousness and preparation that had characterized his work at the state level, dedicating himself to understanding the complexities of national governance.</p>
          </section>
          <section><SH t="Championing the Northeast at the National Level" />
            <p>Throughout his tenure in the Rajya Sabha, T.R. Zeliang was an unwavering advocate for Nagaland and the broader Northeast region. He used every available platform — debates, question hours, committee proceedings, and bilateral engagements with central ministers — to raise the issues that mattered most to his constituents. He was particularly vocal about the infrastructure deficit in the Northeast, arguing that the region's geographical isolation had for too long been treated as a natural given rather than a developmental challenge to be actively addressed.</p>
            <p className="mt-4">He also worked to ensure that the special provisions for Nagaland under Article 371(A) of the Constitution were understood and respected by the central government in its policy-making. His interventions in parliamentary debates helped to keep the Northeast's connectivity needs on the national agenda.</p>
          </section>
          <section><SH t="Committee Work and Legislative Contributions" />
            <p>Zeliang served on several important parliamentary committees during his time in the Rajya Sabha, participating in detailed deliberations on matters relating to national security, regional development, tribal rights, and social welfare. He was known in Parliament as a reasonable, well-informed, and constructive voice — someone who came prepared and spoke with authority on his areas of expertise. These relationships would later prove valuable when he needed to engage the central government on matters critical to Nagaland.</p>
          </section>
          <section><SH t="The Decision to Return to State Politics" />
            <p>After four years in Parliament, T.R. Zeliang made the decision to resign from the Rajya Sabha in 2008 and return to state politics. He had gained from his national experience what he needed — a broader perspective, stronger relationships with central leadership, and a deepened understanding of how national policy frameworks could be leveraged for Nagaland's benefit. He was elected to the Nagaland Legislative Assembly in 2008, re-entering state politics with renewed purpose and a richer repertoire of experience that would set the stage for his eventual rise to Chief Minister.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-2014' && (
        <SubPage title="The 19th Chief Minister of Nagaland: 2014">
          <section><SH t="A New Era of Leadership" />
            <p>In May 2014, T.R. Zeliang assumed the office of the Chief Minister of Nagaland, succeeding Neiphiu Rio who had been elected to the Lok Sabha. As the 19th Chief Minister, Zeliang brought with him over three decades of experience in public life. His first few months in office were characterized by a strong emphasis on administrative efficiency and inclusive governance. He worked to build a cohesive team and set a clear developmental agenda for the state.</p>
          </section>
          <section><SH t="The Naga Peace Process: A Top Priority" />
            <p>From the very beginning of his tenure, the resolution of the Naga political issue was Zeliang's top priority. He believed that a lasting peace was the prerequisite for all other developmental efforts. He reached out to various Naga political groups and civil society organizations, emphasizing the need for a unified approach to the negotiations with the Government of India.</p>
            <p className="mt-4">His administration played a crucial role in the lead-up to the signing of the Framework Agreement in August 2015. Zeliang worked to ensure that the aspirations of the Naga people were central to the dialogue and that the voices of the grassroots were heard. He organized numerous consultative meetings, fostering an environment of mutual trust and understanding among the various stakeholders.</p>
          </section>
          <section><SH t="Infrastructure Push and Administrative Reforms" />
            <p>Zeliang's first year as Chief Minister saw a significant push for infrastructure development. He recognized that Nagaland's geographical isolation was a major barrier to progress and worked to improve the state's connectivity. Several major road projects were initiated, and efforts were made to modernize the state's power and water supply systems. He also introduced several administrative reforms aimed at improving service delivery, including the adoption of digital technologies for better governance and more transparent procedures for the allocation of developmental funds.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-2017' && (
        <SubPage title="Second Term as Chief Minister: 2017">
          <section><SH t="A Return to the Helm" />
            <p>In July 2017, T.R. Zeliang returned as the Chief Minister of Nagaland for a second term. Despite the complexities of the political landscape, Zeliang remained focused on his developmental agenda and his commitment to the welfare of the people. His second term was characterized by a pragmatic and resilient approach to governance. He worked to maintain political stability and to ensure that the state's developmental projects continued without interruption.</p>
          </section>
          <section><SH t="Continuing the Developmental Agenda" />
            <p>During this term, Zeliang oversaw the implementation of several major infrastructure projects initiated during his first term, including the improvement of National Highways and the expansion of the state's power grid. He also focused on the social welfare sector, launching schemes aimed at the empowerment of women and the development of the youth.</p>
            <p className="mt-4">He continued to advocate for the Nagaland Vision 2030, working to align state policies with the goals of sustainable development and economic self-reliance. He also worked to improve the state's investment climate, encouraging local entrepreneurs and seeking to attract outside investment in key sectors like tourism and agri-allied industries.</p>
          </section>
          <section><SH t="Steadfast Commitment to Peace" />
            <p>Throughout his second term, Zeliang's commitment to the Naga peace process remained unwavering. He continued to engage with various Naga groups and the Government of India, pushing for a final settlement that would bring lasting peace to the region. He emphasized the need for unity among the Naga people, arguing that a divided house could not achieve its goals. His leadership during this period was a source of stability and hope for the people of Nagaland.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'journey-deputy' && (
        <SubPage title="Deputy Chief Minister & Current Leadership: 2023–Present">
          <section><SH t="A New Chapter of Service" />
            <p>In 2023, T.R. Zeliang assumed the role of Deputy Chief Minister of Nagaland, continuing his unbroken record of service to the state in its highest offices. This appointment was both a recognition of his immense experience and a signal of the confidence placed in him by his colleagues and by the people of the state. The portfolios assigned to him — Planning and Transformation, and National Highways — were precisely the areas where his years of experience and his expansive network of relationships with central government officials could be most effectively deployed.</p>
          </section>
          <section><SH t="Planning and Transformation: A Strategic Vision" />
            <p>As the minister in charge of Planning and Transformation, Zeliang has been instrumental in reshaping how the Government of Nagaland approaches long-term developmental planning. His emphasis has been on moving away from fragmented, project-by-project thinking towards a more integrated, data-driven framework that aligns resource allocation with clearly articulated strategic priorities. Under his guidance, the planning department has adopted more rigorous monitoring and evaluation systems, ensuring that public funds are spent efficiently and that the intended beneficiaries of government schemes actually receive the benefits.</p>
            <p className="mt-4">He has also placed a strong emphasis on inter-departmental coordination, recognizing that many of Nagaland's development challenges are cross-cutting in nature and cannot be effectively addressed by any single department working in isolation. By fostering a culture of collaboration across government, he has worked to eliminate the silos that have historically impeded the delivery of public services and the implementation of development projects.</p>
          </section>
          <section><SH t="National Highways: Connecting Nagaland to the Future" />
            <p>Perhaps the most visible dimension of Zeliang's current role is his stewardship of the National Highways portfolio. Nagaland's mountainous terrain has always made infrastructure development exceptionally challenging, but it has also made it exceptionally necessary. Under his watch, significant progress has been made in the construction and improvement of National Highways across the state. He has worked closely with the National Highways Authority of India and the Ministry of Road Transport and Highways to ensure that Nagaland receives its fair share of national road development funding and that projects move forward without unnecessary delays.</p>
          </section>
          <section><SH t="The Road Ahead: Vision for Nagaland" />
            <p>As he continues in his current role, T.R. Zeliang remains as committed as ever to the foundational goals that have guided his entire political career: a peaceful resolution of the Naga political issue, inclusive economic development that reaches the most remote parts of the state, and the empowerment of Nagaland's youth to build prosperous and self-reliant futures. He brings to these goals not only a vision but a lifetime of experience in the art of the possible — an understanding of how change actually happens in a complex political environment.</p>
            <p className="mt-4">His career, spanning more than four decades of unbroken public service, stands as a testament to the power of patient, principled, and persistent leadership. He has seen Nagaland through some of its most difficult periods and has consistently chosen the path of dialogue, consensus, and constructive engagement over confrontation. As Deputy Chief Minister, he carries that legacy forward — still learning, still adapting, and still deeply committed to the people and the state he has served all his life.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'vision' && (
        <SubPage title="Vision and Policy Framework">
          <section><SH t="Peace First: The Naga Political Settlement" />
            <p>Everything else that T.R. Zeliang believes in — development, youth empowerment, economic transformation — rests on a single foundation: peace. The Naga political issue is not merely a constitutional or administrative matter; it is a deeply human question about identity, dignity, and the right of a people to determine their own future. Zeliang has spent his entire political career arguing that this question deserves a serious, sustained, and inclusive answer.</p>
            <p className="mt-4">His position has always been clear: the solution must be honorable, amicable, and acceptable to all Naga groups — not just those at the negotiating table. A settlement that divides Naga society is no settlement at all. He has worked to build bridges between the Government of India, the NSCN factions, and the broader Naga civil society, arguing that durable peace requires not just signatures on paper, but genuine consensus in communities. This, he believes, is the most important unfinished task of Nagaland's political history.</p>
          </section>
          <section><SH t="Connectivity: Roads as the Architecture of Opportunity" />
            <p>Ask any farmer in a remote village of Nagaland what prevents them from selling their produce, and they will point to the road — or rather, its absence. Ask any young graduate why they leave the state for work, and they will describe the same infrastructure gap. Zeliang has long believed that building roads is not just an engineering task — it is an act of economic justice.</p>
            <p className="mt-4">His infrastructure vision centers on completing the National Highway network across Nagaland's difficult terrain, improving inter-district connectivity, and ensuring that no village is more than a reasonable distance from a paved road. This is about more than convenience — it is about integrating Nagaland into the national and regional economy, enabling trade, enabling access to healthcare and education, and enabling the kind of investment that creates jobs and raises incomes.</p>
          </section>
          <section><SH t="Youth: From Job Seekers to Job Creators" />
            <p>Nagaland has one of the youngest populations in India. This demographic reality is either a tremendous opportunity or a ticking crisis — depending entirely on whether the government invests in its young people or leaves them to fend for themselves in a state with limited formal employment. Zeliang is unambiguous about which path he chooses.</p>
            <p className="mt-4">His youth policy vision involves three integrated pillars. First, vocational training — equipping young Nagas with practical, marketable skills in trades, technology, healthcare, and agriculture. Second, entrepreneurship — creating an ecosystem of mentorship, micro-credit, and market access that enables young people to build enterprises rather than wait for government jobs. Third, digital inclusion — ensuring that young Nagas have the connectivity and digital literacy to participate in the knowledge economy, whether they live in Kohima or in a village in Mon district.</p>
          </section>
          <section><SH t="Agriculture and Rural Livelihoods" />
            <p>Nagaland's economy is fundamentally agrarian, yet agriculture receives a fraction of the policy attention it deserves. Zeliang's vision for the sector is ambitious: transform subsistence farming into productive, commercially viable agriculture, while preserving the traditional practices that sustain Naga culture and ecological balance.</p>
            <p className="mt-4">This means investing in technology, irrigation, cold storage, and market linkages. It means connecting farmers to fair-price markets so they are not at the mercy of intermediaries. It means supporting the cultivation of high-value crops — including organic produce, medicinal plants, and horticultural products — for which Nagaland has both the climate advantage and the growing national and international demand.</p>
          </section>
          <section><SH t="Environment and Eco-Tourism: Protecting What Makes Nagaland Extraordinary" />
            <p>Nagaland is one of the world's great biodiversity hotspots. Its forests harbour species found nowhere else on earth. Its landscapes — from the rhododendron forests of the high ranges to the bamboo groves of the valley floors — are of global ecological significance. And its cultural heritage, expressed in the extraordinary diversity of Naga traditions, festivals, music, and craftsmanship, is a treasure that no amount of money can replicate once lost.</p>
            <p className="mt-4">Drawing from his years as Minister for Environment and Forests, Zeliang has developed a sophisticated understanding of the balance between conservation and development. His policy framework champions community-based forest management, where local communities are the primary stewards of the forests they depend on. He sees eco-tourism — built around the Hornbill Festival, wildlife sanctuaries, trekking routes, and cultural experiences — as a high-value, low-impact economic sector that can generate significant income while incentivising conservation rather than destruction.</p>
          </section>
          <section><SH t="Governance Reform: Making the State Work for Its People" />
            <p>Underlying all of Zeliang's policy commitments is a conviction about the fundamental purpose of government: it exists to serve its citizens, not the other way around. Too often, he argues, the relationship between citizen and state in Nagaland has been characterised by distance, opacity, and inefficiency. His governance vision is to change this relationship — to build institutions that are accessible, accountable, and effective.</p>
            <p className="mt-4">This means simplifying processes, reducing bureaucratic friction, improving the delivery of basic services, and investing in the digital infrastructure that enables transparent governance. It means taking corruption seriously — not just rhetorically, but through institutional mechanisms that deter misconduct and protect whistleblowers. And it means ensuring that the voices of ordinary Nagas — farmers, women, young people, the elderly — are heard in the corridors of power, not just during election season.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'initiatives' && (
        <SubPage title="Key Portfolios and Initiatives">
          <section><SH t="Planning and Transformation: A Data-Driven Approach" />
            <p>As the Minister in charge of Planning and Transformation, T.R. Zeliang has introduced a paradigm shift in how developmental projects are conceived and implemented in Nagaland. His focus is on data-driven decision-making and the use of modern technology to ensure transparency and accountability. The department has been revamped to act as a strategic hub for long-term planning, focusing on the efficient allocation of resources to achieve the state's developmental goals. One of the key initiatives is the implementation of a robust monitoring and evaluation system for all government schemes.</p>
          </section>
          <section><SH t="National Highways: The Connectivity Revolution" />
            <p>The Connectivity Revolution is perhaps the most visible and impactful initiative led by T.R. Zeliang. Under his leadership, the Department of National Highways has seen an unprecedented surge in activity. Major projects, such as the four-laning of the Dimapur-Kohima road and the development of the Trans-Nagaland Highway, are at various stages of completion. These projects are not just about building roads — they are about opening up new economic corridors and reducing the isolation of remote districts.</p>
          </section>
          <section><SH t="Agriculture and Rural Development" />
            <p>Recognizing that the majority of Nagaland's population depends on agriculture, T.R. Zeliang has introduced several initiatives to modernize the sector and improve the livelihoods of rural communities. His administration is promoting organic farming, providing better irrigation facilities, and creating market linkages for farmers. Initiatives such as the Nagaland Organic Mission and the development of agri-processing units are aimed at adding value to local produce and increasing the income of farmers.</p>
          </section>
          <section><SH t="Social Welfare and Inclusive Growth" />
            <p>T.R. Zeliang's initiatives in the social welfare sector are aimed at creating a more inclusive and equitable society. His policies focus on the empowerment of women, the protection of children, and the welfare of the elderly and the differently-abled. Key initiatives include the promotion of self-help groups for women, the provision of vocational training for the youth, and the strengthening of social safety nets for the marginalized.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'vision-peace' && (
        <SubPage title="Peace & Unity: The Foundation of Progress">
          <section><SH t="The Centrality of Peace to Nagaland's Future" />
            <p>For T.R. Zeliang, peace is not merely a political goal — it is the essential precondition for every other form of progress. A state that is consumed by internal conflict cannot build roads, schools, or hospitals with any lasting effect. Peace is the soil in which development must be planted, and its absence leaves the fruits of investment vulnerable to erosion. This conviction has been at the heart of his public philosophy for over four decades, and it has only deepened with experience.</p>
            <p className="mt-4">Zeliang witnessed firsthand the toll that prolonged conflict extracts from ordinary people — the farmer who cannot cultivate land that lies near a flashpoint, the child whose schooling is interrupted, the young professional who leaves for another state because the environment at home feels too uncertain. For him, the pursuit of peace has always been inseparable from the pursuit of human dignity.</p>
          </section>
          <section><SH t="A Framework for Lasting Resolution" />
            <p>The Naga political issue is one of the oldest unresolved conflicts in post-independence India. Its roots go deep — into questions of identity, sovereignty, history, and the aspirations of a people who have long sought recognition of their uniqueness. T.R. Zeliang approaches this issue not with impatience or a desire for shortcuts, but with a respect for its complexity and a commitment to an outcome that is genuinely sustainable.</p>
            <p className="mt-4">His framework for resolution is built on three principles: inclusivity, honor, and finality. A solution must be inclusive, meaning it must reflect the aspirations of all sections of Naga society, not just the most vocal or powerful. It must be honorable, respecting the dignity and cultural identity of the Naga people. And it must be final — a settlement that does not merely pause conflict but resolves its underlying causes.</p>
          </section>
          <section><SH t="Unity Among the Naga People" />
            <p>One of the recurring themes of Zeliang's public messaging is the imperative of Naga unity. He has consistently argued that division among Naga groups weakens the collective bargaining position of the Naga people and prolongs the uncertainty that has cost the state so much. He has invested considerable political capital in building bridges between different factions, tribal groups, and political organizations.</p>
            <p className="mt-4">This does not mean he believes in uniformity. Nagaland is home to dozens of distinct tribes, each with its own traditions, language, and perspective. Unity, in his vision, is not about erasing these differences but about finding a shared commitment to the well-being of the state that transcends them. It is a unity of purpose rather than a unity of identity.</p>
          </section>
          <section><SH t="Peace as the Platform for Development" />
            <p>The practical argument for peace, in Zeliang's view, is straightforward: no developmental agenda can be fully realized in a state of persistent conflict. Investors are deterred, talented people leave, and government resources that could go to infrastructure or healthcare are diverted to managing security situations. Peace is not just morally desirable — it is economically rational and strategically necessary.</p>
            <p className="mt-4">When he speaks about the Naga peace process, Zeliang always connects it to the development agenda. A final settlement would unlock new possibilities for Nagaland — greater investment, stronger institutions, and the psychological liberation of a people who have lived under the shadow of an unresolved conflict for generations. That is the vision that drives his continued engagement with the peace process, even when progress is slow and the path is uncertain.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'vision-development' && (
        <SubPage title="Development: Building the Infrastructure of Progress">
          <section><SH t="Infrastructure as the Foundation of Opportunity" />
            <p>T.R. Zeliang's developmental philosophy is grounded in a simple but powerful insight: opportunity cannot reach people who are not connected. The most brilliant policy or the most generous government scheme will fail to deliver its intended benefits if the roads to deliver it are impassable, the power lines to enable it are absent, or the digital networks to transmit it do not exist. Infrastructure is not just one item on the developmental agenda — it is the platform on which all other items rest.</p>
            <p className="mt-4">This conviction explains why, throughout his career, Zeliang has consistently prioritized connectivity above almost everything else. As a legislator, he fought for roads in the Tening constituency. As a Cabinet Minister, he worked on environmental and resource frameworks that would support sustainable infrastructure. As Chief Minister, he launched major highway projects. And as Deputy Chief Minister with the National Highways portfolio, he is now in a position to oversee the most ambitious phase of Nagaland's connectivity transformation.</p>
          </section>
          <section><SH t="The National Highways Programme" />
            <p>The improvement of National Highways in Nagaland is not merely a matter of engineering — it is a matter of economic justice. For too long, the state's mountainous terrain has been treated as an insuperable obstacle, a geographical destiny that condemns its people to relative isolation. Zeliang rejects this fatalism. Every other mountainous region in the world has found ways to build connectivity infrastructure that overcomes natural barriers; Nagaland can and must do the same.</p>
            <p className="mt-4">Under his oversight, significant progress has been made on several key corridors. The improvement of the Dimapur-Kohima highway — the state's primary economic artery — is a flagship project that will reduce travel times, lower transportation costs, and open new commercial possibilities for the region. The Trans-Nagaland Highway, which will link the state's eastern and western extremities, is another transformative initiative that will integrate previously isolated districts into the state's economic mainstream.</p>
          </section>
          <section><SH t="Healthcare and Social Infrastructure" />
            <p>Physical connectivity is necessary but not sufficient. T.R. Zeliang's development vision also encompasses the social infrastructure — healthcare facilities, educational institutions, and community services — that enables people to live healthy, productive, and fulfilled lives. He has consistently advocated for better-equipped district hospitals, more healthcare professionals in rural areas, and stronger public health systems that can respond effectively to both routine and emergency needs.</p>
          </section>
          <section><SH t="Economic Development and Livelihoods" />
            <p>Beyond infrastructure, Zeliang's development agenda addresses the question of livelihoods. Nagaland's economy has historically been heavily dependent on government employment, which is inherently limited in its capacity to absorb the state's growing workforce. His vision is to diversify the economic base by promoting agriculture, tourism, and small enterprise as sustainable sources of income for a broader segment of the population.</p>
            <p className="mt-4">The promotion of organic farming is a particular priority — Nagaland's clean environment and traditional agricultural practices give it a natural advantage in this growing market, and Zeliang has worked to develop the market linkages and processing infrastructure that would allow farmers to capture more of the value chain. Similarly, Nagaland's extraordinary natural beauty and cultural richness make it a natural destination for eco-tourism, and he has supported initiatives to develop this sector in ways that benefit local communities.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'vision-youth' && (
        <SubPage title="Youth & Future: Investing in Nagaland's Greatest Asset">
          <section><SH t="The Youth Imperative" />
            <p>Nagaland is a young state — demographically, historically, and in terms of its unrealized potential. A significant proportion of its population is under the age of thirty-five. This demographic reality is simultaneously Nagaland's greatest challenge and its greatest opportunity. If the state's youth are educated, skilled, and empowered, they can drive an era of unprecedented growth and transformation. If they are underemployed, disengaged, or forced to seek opportunity elsewhere, the state will continue to fall short of its potential.</p>
            <p className="mt-4">T.R. Zeliang has made youth empowerment a central pillar of his political vision, not as a rhetorical gesture but as a substantive commitment backed by policy. He understands that the generation entering the workforce today will determine what Nagaland looks like in 2040 and beyond, and he believes that getting the conditions right for them is one of the most important things that his administration can do.</p>
          </section>
          <section><SH t="From Job Seekers to Job Creators" />
            <p>The most distinctive aspect of Zeliang's youth agenda is his emphasis on entrepreneurship and self-reliance over government employment. For generations, the aspiration of many Naga families has been to secure a government job for their children — a stable salary, benefits, and social status. This is understandable given the limited private sector opportunities available. But Zeliang argues that this mindset, however rational at the individual level, is collectively self-limiting.</p>
            <p className="mt-4">A state in which the best and brightest all aspire to government jobs is a state that is not building the private sector dynamism it needs for long-term prosperity. He wants to change this by creating an ecosystem that makes entrepreneurship a genuinely attractive option — with access to capital, mentorship, market connections, and a supportive regulatory environment. His vision is of young Nagas starting businesses, creating jobs for their peers, and building companies that serve not just the local market but national and international ones.</p>
          </section>
          <section><SH t="Skill Development and Technical Education" />
            <p>Realizing this vision requires a substantial investment in skill development. Zeliang has been a strong advocate for vocational training centers that equip young people with practical, market-relevant skills — in areas like construction, healthcare, information technology, hospitality, and agriculture. He believes that the traditional academic pathway, while important, is not the only route to a productive and fulfilling career, and that technical and vocational education deserves the same respect and investment as university education.</p>
            <p className="mt-4">He has also been an early and consistent advocate for digital literacy. In an economy increasingly shaped by technology, the ability to navigate digital tools is no longer optional — it is a basic competency that all young people need. His administration has worked to expand internet connectivity and digital education programs, particularly in rural areas where the digital divide is most pronounced.</p>
          </section>
          <section><SH t="Preserving Identity in a Changing World" />
            <p>Zeliang's vision for Nagaland's youth is not simply about economic productivity. He is equally committed to ensuring that the next generation remains connected to the rich cultural heritage that makes Naga society unique. Rapid modernization can erode traditional values, languages, and practices — and he believes that a future in which Naga youth have lost touch with their roots is not truly a prosperous one, regardless of the economic statistics.</p>
            <p className="mt-4">His approach is to help young Nagas see their identity not as an obstacle to modernity but as an asset — a source of pride, creativity, and competitive differentiation. The Naga cultural heritage, expressed through music, crafts, cuisine, and community practices, is something that the world is increasingly interested in. He wants to support young entrepreneurs who can build on this heritage, creating products and experiences that are both authentically Naga and globally appealing.</p>
          </section>
        </SubPage>
      )}


      {activeSubpage === 'achievement-cm' && (
        <SubPage title="Twice Chief Minister of Nagaland">
          <p>T.R. Zeliang made history by serving as Chief Minister of Nagaland on two separate occasions — first from 2014 to 2017, and again from 2017 to 2018. As the head of government, he steered Nagaland through critical phases of political transition, economic planning, and peace negotiations. His administration prioritized infrastructure development, with special focus on road connectivity across the state's challenging terrain. He championed inclusive governance, bringing together diverse tribal groups under one vision. His tenure marked a period of increased fiscal discipline and improved public service delivery, earning him widespread respect across the political spectrum.</p>
        </SubPage>
      )}
      {activeSubpage === 'achievement-9time' && (
        <SubPage title="9-Time Elected Representative">
          <p>Zeliang's extraordinary democratic mandate spans over four decades. He has been elected to the Nagaland Legislative Assembly from the Peren constituency nine consecutive times — an achievement that reflects unmatched grassroots trust. From his first election victory in 1982 to his most recent, the people of Peren have consistently chosen him as their voice. This remarkable electoral record is built on decades of consistent constituency service, personal accessibility, and a deep understanding of local needs. Each election brought new developmental commitments that he worked tirelessly to fulfil, cementing a bond between representative and constituents that is rare in Indian politics.</p>
        </SubPage>
      )}
      {activeSubpage === 'achievement-mp' && (
        <SubPage title="Rajya Sabha Member of Parliament">
          <p>Zeliang served as a Member of the Rajya Sabha, the upper house of the Indian Parliament, bringing the voice of Nagaland to the national stage. During his tenure, he raised critical issues pertaining to the Northeast — infrastructure gaps, the unique cultural identity of Naga people, special category status, and the long-standing political settlement process. His parliamentary contributions helped shape national policies that directly impacted Nagaland's development trajectory. He used this platform to advocate for greater central funding for Northeast states and to build bridges with the national leadership on the Naga political issue.</p>
        </SubPage>
      )}
      {activeSubpage === 'achievement-40years' && (
        <SubPage title="40+ Years of Public Service">
          <p>Since entering public life in the early 1980s, T.R. Zeliang has devoted more than four decades to the service of Nagaland. What began as a young leader's commitment to his constituency in Peren has evolved into a legacy of state-level leadership. Through changing governments, coalitions, and political landscapes, Zeliang remained consistent in his dedication — attending to constituents' needs, building institutional capacity, and working across party lines for the betterment of Nagaland. His longevity in public service is a testament to integrity, adaptability, and genuine commitment to the people he represents.</p>
        </SubPage>
      )}
      {activeSubpage === 'achievement-npf' && (
        <SubPage title="Led NPF as Single Largest Party">
          <p>As President of the Naga People's Front (NPF), Zeliang led the party to becoming the single largest party in the Nagaland Legislative Assembly — a landmark achievement that established NPF as a dominant political force. His leadership strategy combined grassroots mobilisation with strategic coalition-building. Under his stewardship, the party articulated a clear development agenda while maintaining its commitment to the Naga political resolution. His ability to manage diverse tribal constituencies under a unified political platform demonstrated rare organizational and diplomatic skill within Nagaland's complex political environment.</p>
        </SubPage>
      )}
      {activeSubpage === 'achievement-uda' && (
        <SubPage title="Chairman, UDA Nagaland">
          <p>As Chairman of the Urban Development Authority (UDA) of Nagaland, Zeliang played a pivotal role in shaping the state's urban landscape. He oversaw key initiatives in town planning, infrastructure modernisation, and housing development across Nagaland's growing urban centres. The UDA under his leadership focused on building sustainable urban systems — improving drainage, roads, public spaces, and civic amenities in Kohima and other towns. This role reinforced his belief that good governance must translate into tangible improvements in citizens' daily lives.</p>
        </SubPage>
      )}
      {activeSubpage === 'achievement-naga' && (
        <SubPage title="Advocate for Naga Resolution">
          <p>Among Zeliang's most defining commitments is his decades-long advocacy for a peaceful, honourable, and lasting resolution to the Naga political issue. He has consistently called for a settlement that respects Naga identity, aspirations, and unique history within the Indian constitutional framework. He engaged constructively with the Government of India's peace interlocutors, the NSCN factions, and civil society organisations to move the peace process forward. His position has always been clear: dialogue, not division; dignity, not dominance. He believes that lasting peace is the foundation for all development in the Northeast.</p>
        </SubPage>
      )}
      {activeSubpage === 'achievement-ne' && (
        <SubPage title="Champion of NE Development">
          <p>Throughout his career, Zeliang has been a vocal champion for the broader development of Northeast India. He consistently lobbied for greater central investment in the region's infrastructure, healthcare, education, and connectivity. He participated in multiple national platforms to highlight the Northeast's strategic importance and its untapped economic potential. From advocating for better road and rail connectivity to pushing for the Act East Policy's effective implementation in Nagaland, Zeliang worked to ensure that the Northeast was not left behind in India's growth story. His contributions helped attract development funding and national attention to the unique challenges and opportunities of the region.</p>
        </SubPage>
      )}
      {activeSubpage === 'value-integrity' && (
        <SubPage title="Integrity in Governance">
          <p>Integrity is not merely a word in Zeliang's political vocabulary — it is the cornerstone of his decades-long public life. He has consistently maintained that governance must be transparent, accountable, and free from corruption. During his tenure as Chief Minister, he introduced measures to improve financial accountability and reduce leakage in government spending. He believed that public servants are trustees of the people's resources and must act accordingly. His personal lifestyle has reflected this conviction — living modestly, remaining accessible to constituents, and never allowing power to distance him from the people he serves. This commitment to ethical leadership has earned him respect even from political opponents.</p>
        </SubPage>
      )}
      {activeSubpage === 'value-unity' && (
        <SubPage title="Unity Across Diversity">
          <p>Nagaland is home to more than sixteen major Naga tribes, each with its own language, customs, and territorial identity. Navigating this diversity requires rare political skill and genuine empathy. Zeliang has throughout his career been a builder of bridges — between tribes, between the hills and the plains, between Nagaland and the rest of India. He consistently emphasised that the Naga people's strength lies in their unity, not in their divisions. As Chief Minister, he convened inclusive dialogues, ensured tribal representation in governance, and worked to prevent inter-tribal conflicts from derailing development. His vision of unity is not enforced sameness but a shared commitment to a better Nagaland.</p>
        </SubPage>
      )}
      {activeSubpage === 'value-progress' && (
        <SubPage title="Progress with Cultural Preservation">
          <p>Zeliang's idea of progress is rooted in a deep respect for Nagaland's rich indigenous heritage. He has always believed that modernization and cultural preservation are not opposites but complements. Under his leadership, development programmes were designed to improve material conditions without eroding the unique identity of Naga communities. He championed road construction and digital connectivity to remote villages, improved healthcare infrastructure in tribal areas, and invested in education systems that preserved local languages while preparing students for the modern economy. Progress, for Zeliang, means that a Naga farmer has better roads, a Naga child has better schools, and a Naga elder can still celebrate the Hornbill Festival with pride.</p>
        </SubPage>
      )}
      {activeSubpage === 'info-born' && (
        <SubPage title="Early Life & Birth">
          <p>T.R. Zeliang was born on February 21, 1952, in Mbaupungwa village, located in the Peren District of Nagaland. He is the son of the late Rangleu Zeliang.</p>
          <p>Growing up in a remote village during a transformative period in Nagaland's history, his early years were shaped by the traditional values of his community and the challenges of rural life. This background instilled in him a deep understanding of the needs and aspirations of the grassroots people, which would later become the cornerstone of his political philosophy.</p>
        </SubPage>
      )}
      {activeSubpage === 'info-constituency' && (
        <SubPage title="Peren Constituency">
          <p>T.R. Zeliang represents the 7-Peren Assembly Constituency in the Nagaland Legislative Assembly. Peren is a significant region in Nagaland, known for its rich cultural heritage and strategic importance.</p>
          <p>Throughout his career, he has been a steadfast advocate for the development of his constituency, focusing on improving infrastructure, healthcare, and educational opportunities for the people of Peren. His long-standing representation of this constituency reflects the deep trust and bond he shares with the local community.</p>
        </SubPage>
      )}
      {activeSubpage === 'info-party' && (
        <SubPage title="Political Affiliation">
          <p>T.R. Zeliang is a prominent leader of the Naga People's Front (NPF) in Nagaland. The NPF is a major regional political party that focuses on the progress, development, and regional identity of Nagaland.</p>
          <p>As a senior leader within the party, he has played a crucial role in shaping its policies and strategies. His leadership has been instrumental in the party's success and its efforts to provide stable and progressive governance to the state of Nagaland.</p>
        </SubPage>
      )}
      {activeSubpage === 'info-education' && (
        <SubPage title="Educational Background">
          <p>T.R. Zeliang completed his early education in Nagaland and later pursued higher studies. He holds a Bachelor of Arts (B.A.) degree from Kohima College, which is one of the premier educational institutions in the state.</p>
          <p>His time in college was not just about academic learning; it was also the period when he became actively involved in student politics and social advocacy. This educational foundation, combined with his early leadership roles in student unions, prepared him for the complexities of public service and statecraft.</p>
        </SubPage>
      )}

      {activeSubpage === 'achievements' && (
        <SubPage title="Milestones and Achievements">
          <section><SH t="Leadership Excellence and Political Longevity" />
            <p>T.R. Zeliang's career is marked by remarkable political longevity and leadership excellence. Being elected as the Chief Minister of Nagaland twice is a testament to the trust and confidence the people have in his leadership. His ability to navigate the complex and often turbulent political landscape of the state with a steady hand and a clear vision has been widely recognized. His record as a nine-time elected representative to the Nagaland Legislative Assembly is a significant milestone in itself, reflecting a deep and enduring connection with the grassroots.</p>
          </section>
          <section><SH t="Legislative Success and Administrative Reforms" />
            <p>One of T.R. Zeliang's most significant achievements is his success in initiating and implementing major administrative reforms. Under his leadership, the state government has moved towards a more transparent and efficient system of governance. He has been instrumental in the passage of several key pieces of legislation aimed at improving the delivery of public services, enhancing accountability, and promoting social justice. His focus on administrative efficiency has led to the modernization of various government departments and the adoption of digital technologies for better governance.</p>
          </section>
          <section><SH t="Impact on Infrastructure and Regional Connectivity" />
            <p>The transformation of Nagaland's infrastructure under T.R. Zeliang's leadership is perhaps his most enduring achievement. From the improvement of National Highways to the expansion of the state's power and water supply systems, his administration has made major strides in improving the quality of life for all citizens. His focus on strategic planning and efficient resource management has led to the successful implementation of several large-scale developmental projects that have created new opportunities for economic growth and made essential services more accessible to people in remote areas.</p>
          </section>
          <section><SH t="The Creation of Peren District" />
            <p>Among his most tangible and lasting achievements is his pivotal role in the creation of Peren as a separate district in 2003. This long-standing demand of the Zeliangrong people became a reality through his persistent advocacy. The establishment of Peren district transformed the administrative landscape of the region, bringing government closer to the people and creating the institutional foundation for focused and sustained development in an area that had long been underserved.</p>
          </section>
        </SubPage>
      )}

      {activeSubpage === 'contact' && (
        <SubPage title="Contact and Office Details">
          <section><SH t="The Office of the Deputy Chief Minister" />
            <p>The primary office of T.R. Zeliang, the Deputy Chief Minister of Nagaland, is located in the state capital, Kohima, at Old Minister's Hill. This office serves as the central hub for administrative coordination and public engagement. It is staffed by a dedicated team of professionals committed to providing efficient and responsive service to the public. The office maintains an open-door policy, encouraging citizens to reach out with their concerns, suggestions, and feedback regarding government policies and initiatives.</p>
          </section>
          <section><SH t="Constituency Engagement: Staying Connected with Peren" />
            <p>In addition to the main office in Kohima, T.R. Zeliang maintains a strong presence in his home constituency of Peren. The constituency office in Peren works tirelessly to address the local issues of the residents and to ensure that the benefits of government programs reach every household. Regular public hearings and community meetings are conducted to gather feedback from the grassroots and to ensure that the developmental needs of the district are prioritized.</p>
          </section>
          <section><SH t="Digital Outreach: Modernizing Citizen Engagement" />
            <p>Recognizing the importance of technology in modern governance, the office of the Deputy Chief Minister has a strong digital presence. This official portal is part of a broader digital outreach strategy aimed at making information more accessible to everyone, regardless of their location. Through various social media platforms and official websites, we provide regular updates on government initiatives, policy changes, and public announcements.</p>
          </section>
          <section><SH t="A Commitment to Responsive and Transparent Governance" />
            <p>Our goal is to build a government that is truly of the people, by the people, and for the people. We are committed to fostering a culture of openness, accountability, and responsiveness in all our administrative actions. "Governance is a shared responsibility. We are here to serve you, and your participation is essential for our success. Let us work together with a spirit of unity and dedication to ensure that the future of Nagaland is bright for all its citizens." — T.R. Zeliang.</p>
          </section>
        </SubPage>
      )}

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-center ${isScrolled ? 'pt-4' : 'pt-0'}`}>
        <div className={`transition-all duration-500 flex justify-between items-center ${isScrolled ? 'w-[92%] max-w-6xl px-8 py-3 rounded-2xl bg-[var(--nav-bg)] backdrop-blur-xl shadow-[0_20px_50px_var(--shadow)] border border-[var(--border)] nav-3d-effect' : 'w-full max-w-7xl px-6 py-8 bg-transparent'}`}>
          <a href="#home" className="flex items-center gap-1 group">
            <span className="font-anton text-2xl tracking-tighter text-[var(--text-primary)]">TR ZELIANG</span>
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 group-hover:scale-150 transition-transform duration-300"></span>
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => openSubpage(link.id, false)} className="font-poppins text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-all duration-300 tracking-wide hover:-translate-y-1 hover:scale-110 active:scale-95 cursor-pointer">
                {link.name}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-[var(--text-primary)] p-2 hover:bg-violet-900/40 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        <div className={`lg:hidden absolute top-full left-1/2 -translate-x-1/2 w-[92%] mt-2 bg-[var(--bg-secondary)] backdrop-blur-xl rounded-2xl shadow-2xl border border-[var(--border)] transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
      <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 lg:pt-40 lg:pb-8" style={{ background: "var(--hero-bg)" }} ref={heroRef}>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl parallax-layer" data-speed="0.1"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl parallax-layer" data-speed="0.2"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="reveal-on-scroll reveal-left text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="text-clamp-hero leading-[0.9] mb-4 font-anton">
              <span className="hero-name-flow">TADITUI RANGKAU</span><br />
              <span className="hero-gold-flow">ZELIANG</span>
            </h1>
            <p className="font-anton text-lg md:text-xl text-[var(--text-muted)] mb-6 tracking-wide">Deputy Chief Minister, Nagaland</p>
            <p className="font-poppins text-sm md:text-base text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed mx-auto lg:mx-0">Two-time Chief Minister · Member of Parliament · 40+ Years of Public Service. A legacy built on peace, progress, and the unwavering spirit of Nagaland.</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button onClick={() => openSubpage('legacy')} className="cursor-pointer flex items-center gap-2" style={{
                fontFamily: 'Anton, sans-serif', letterSpacing: '0.08em', fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
                padding: '0.7rem 1.6rem', borderRadius: '6px',
                background: 'var(--accent-gold)',
                color: '#fff', border: 'none', boxShadow: '0 4px 20px var(--shadow)',
                transition: 'all 0.3s ease', textTransform: 'uppercase',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                Political Journey <ArrowRight size={15} />
              </button>
              <button onClick={() => openSubpage('vision')} className="cursor-pointer" style={{
                fontFamily: 'Anton, sans-serif', letterSpacing: '0.08em', fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
                padding: '0.7rem 1.6rem', borderRadius: '6px',
                background: 'transparent', color: 'var(--accent-gold)',
                border: '1.5px solid var(--accent-gold)',
                boxShadow: '0 2px 12px var(--shadow)',
                transition: 'all 0.3s ease', textTransform: 'uppercase',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                Vision & Policy
              </button>
            </div>
          </div>
          <div className="relative flex justify-center items-center perspective-container reveal-right">
            <div ref={portraitRef} className="relative w-full max-w-[230px] md:max-w-[300px] preserve-3d transition-transform duration-200 ease-out">
              <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ border: "3px solid var(--border)", boxShadow: "0 0 60px var(--shadow), 0 30px 80px rgba(0,0,0,0.4)", height: 'clamp(290px, 52vw, 420px)' }}>
                <img src="https://i.ibb.co/VY8tcdMs/2017-7-largeimg24-Monday-2017-113308648.jpg" alt="Hon. T.R. Zeliang" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 8%', display:'block' }} referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-1 -right-1 translate-z-20" style={{
                background: 'var(--bg-primary)',
                padding: '0.35rem 0.6rem', borderRadius: '8px',
                boxShadow: '0 4px 16px var(--shadow), 0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid var(--border)',
              }}>
                <p className="font-anton text-[var(--accent-gold)] leading-tight" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>SERVING</p>
                <p className="font-anton text-[var(--text-muted)] leading-tight" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>NAGALAND</p>
                <p className="font-poppins text-[var(--text-muted)] uppercase tracking-widest" style={{ fontSize: '0.5rem', marginTop: '2px' }}>Since 1975</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ABOUT ═══════════════════════ */}
      <section id="about" className="py-24 relative overflow-hidden section-1" style={{ background: "var(--bg-primary)", paddingBottom: "140px" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-16">
            <div className="max-w-4xl w-full reveal-on-scroll reveal-heading text-center">
              <h2 className="text-clamp-section mb-8 font-anton"><span className="animate-color-flow">A Journey of</span> <span className="animate-color-flow-alt">Service</span></h2>
              <div className="prose prose-lg max-w-none text-[var(--text-secondary)] font-poppins space-y-6 mx-auto">
                <p>Born in Mbaupungwa village, Peren District, Nagaland, T.R. Zeliang is the son of Lt. Rangleu Zeliang. His journey from a remote village to the corridors of power is a testament to his resilience and dedication to the Naga people.</p>
                <p>Educated at Don Bosco School, Dibrugarh and Kohima College, he entered public life as a student leader, serving as the President of the Zeliangrong Students Union, Kohima. This early involvement in grassroots activism laid the foundation for a political career spanning over four decades.</p>
                <p>Married to Smti. Kevizenuo, and a father of three, he has balanced his personal life with the immense responsibilities of statecraft. A leader who rose through the ranks, he has served in various capacities — from a Minister of State to the Chief Minister of Nagaland twice.</p>
              </div>
            </div>
            <div className="max-w-5xl w-full reveal-on-scroll">
              <div className="premium-3d-card p-8" style={{ border:"1px solid var(--border)", boxShadow:"0 20px 60px var(--shadow)" }}>
                <h3 className="font-anton text-2xl mb-8 pb-4 text-center text-[var(--text-primary)] border-b" style={{ borderColor:"var(--border)" }}>Key Information</h3>
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: <Calendar size={24} />, label: 'Born', value: 'February 21, 1952', id: 'info-born' },
                    { icon: <MapPin size={24} />, label: 'Constituency', value: 'Peren, Nagaland', id: 'info-constituency' },
                    { icon: <Shield size={24} />, label: 'Party', value: 'NPF', id: 'info-party' },
                    { icon: <GraduationCap size={24} />, label: 'Education', value: 'B.A. Kohima College', id: 'info-education' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 cursor-pointer group premium-3d-card p-2" onClick={() => openSubpage(item.id)}>
                      <div className="w-7 h-7 bg-[var(--bg-accent)] rounded-lg flex items-center justify-center text-[var(--accent-gold)] shrink-0 group-hover:bg-[var(--accent-gold)] group-hover:text-white transition-colors icon-accent" style={{ fontSize: '14px' }}>{item.icon}</div>
                      <div className="flex items-baseline gap-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold font-poppins shrink-0">{item.label}:</p>
                        <p className="text-xs font-semibold text-[var(--text-primary)] font-poppins truncate group-hover:text-[var(--accent-gold)] transition-colors">{item.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-full reveal-on-scroll">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { target: 2, suffix: 'x', label: 'Chief Minister' },
                  { target: 9, suffix: 'x', label: 'Elected Representative' },
                  { target: 1, suffix: '', label: 'Rajya Sabha MP' },
                  { target: 40, suffix: '+', label: 'Years in Politics' },
                ].map((s, i) => (
                  <div key={i} className="text-center p-6 premium-3d-card">
                    <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-4 border border-white/40 icon-accent">
                      <span className="font-anton text-2xl" style={{ color: 'var(--card-accent-dark)' }}>{s.target}{s.suffix}</span>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold font-poppins">{s.label}</p>
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
          backgroundSize: '300% 300%',
          animation: theme === 'dark' ? 'skyShift 10s ease infinite' : 'none',
          marginTop: '-80px',
          borderRadius: '60px 60px 0 0',
          paddingTop: '100px',
          paddingBottom: '120px',
          position: 'relative',
          zIndex: 2,
          boxShadow: theme === 'dark' ? '0 -20px 60px rgba(91,33,182,0.3)' : '0 -20px 60px var(--shadow)',
        }}
      >
        {/* animated flowing waves */}
        {theme === 'dark' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden', height: '90px' }}>
            {/* wave 3 - back layer, slowest */}
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow3 9s linear infinite' }}>
              <path d="M0,45 C180,80 360,10 540,45 C720,80 900,10 1080,45 C1260,80 1350,20 1440,45 L1440,0 L0,0 Z" fill="rgba(10,5,22,0.3)" />
            </svg>
            {/* wave 2 - mid layer */}
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow2 6s linear infinite' }}>
              <path d="M0,55 C200,20 400,70 600,40 C800,10 1000,65 1200,35 C1320,18 1380,50 1440,55 L1440,0 L0,0 Z" fill="rgba(10,5,22,0.55)" />
            </svg>
            {/* wave 1 - front layer, fastest */}
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '90px', animation: 'waveFlow1 4s linear infinite' }}>
              <path d="M0,60 C120,30 240,75 360,50 C480,25 600,70 720,45 C840,20 960,65 1080,40 C1200,15 1320,55 1440,60 L1440,0 L0,0 Z" fill="#0a0516" />
            </svg>
          </div>
        )}

        {/* blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', top: '-100px', left: '-100px', borderRadius: '50%', animation: 'blobDrift 12s ease-in-out infinite alternate' }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', bottom: '-80px', right: '-80px', borderRadius: '50%', animation: 'blobDrift 15s ease-in-out infinite alternate-reverse' }}></div>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', width: `${8 + i * 2}px`, height: `${8 + i * 2}px`, borderRadius: '50%', background: `rgba(124,58,237,${0.1 + i * 0.03})`, top: `${10 + i * 13}%`, left: `${5 + i * 14}%`, animation: `floatDot ${9 + i * 1.5}s ease-in-out ${i * 1.2}s infinite alternate` }}></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-20 reveal-on-scroll reveal-heading">
            <h2 className="text-clamp-section mb-4 font-anton"><span className="title-timeline">Political </span><span className="title-timeline-accent">Timeline</span></h2>
            <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(90deg, #ffffff, #ede9fe)' }}></div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { year: '1975–1982', title: 'Student Leader', desc: 'President, Zeliangrong Students Union, Kohima. Began grassroots activism and social advocacy across Nagaland.', subpageId: 'journey-student' },
                { year: '1982', title: 'First Electoral Contest', desc: 'Contested from Tening Constituency for the Nagaland Legislative Assembly. Built lasting voter trust despite the loss.', subpageId: 'journey-1982' },
                { year: '1989', title: 'First Victory', desc: 'Elected as MLA from Tening (Naga People\'s Council). Appointed Minister of State for Relief & Rehabilitation.', subpageId: 'journey-1989' },
                { year: '1993–1998', title: 'Re-elected MLA', desc: 'Minister of State for Relief & Rehabilitation. Deepened rural empowerment and grassroots governance reforms.', subpageId: 'journey-1993' },
                { year: '1998–2003', title: 'Cabinet Minister', desc: 'Minister for Environment, Forests, Geology & Mining under CM S.C. Jamir. Championed sustainable resource use.', subpageId: 'journey-1998' },
                { year: '2004–2008', title: 'Member of Parliament', desc: 'Represented Nagaland in the Rajya Sabha. Elevated Northeast development issues to the national stage.', subpageId: 'journey-parliament' },
                { year: '2014', title: '19th Chief Minister', desc: 'Appointed Chief Minister of Nagaland. Spearheaded the Naga Peace Process and major infrastructure programs.', subpageId: 'journey-2014' },
                { year: '2017', title: 'Second Term as CM', desc: 'Returned as Chief Minister for a second term in July 2017. Continued the Nagaland Vision 2030 developmental agenda.', subpageId: 'journey-2017' },
                { year: '2023–Present', title: 'Deputy Chief Minister', desc: 'Holds Planning & Transformation and National Highway portfolios. Leading Nagaland\'s connectivity revolution.', subpageId: 'journey-deputy' },
              ].map((item, index) => (
                <div key={index} className="reveal-on-scroll">
                  {/* FIX 2: premium pure white 3D card with float animation */}
                  <div
                    onClick={() => openSubpage(item.subpageId)}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={hoveredCard === index ? hoveredCardStyle : {
                      ...cardBase,
                      animation: `${index % 2 === 0 ? 'cardFloatLeft' : 'cardFloatRight'} ${3.2 + (index % 3) * 0.6}s ease-in-out ${index * 0.25}s infinite alternate`,
                    }}
                  >
                    {/* shimmer line */}
                    <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)', borderRadius: '1px' }}></div>
                    <span style={{ fontFamily: 'Anton, sans-serif', color: '#7c3aed', fontSize: '1rem', display: 'block', marginBottom: '0.4rem' }}>{item.year}</span>
                    <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.15rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color:'var(--text-primary)' }}>
                      {item.title}
                      <ArrowRight size={14} style={{ opacity: hoveredCard === index ? 1 : 0, transition: 'opacity 0.3s', color: 'var(--accent-gold)', flexShrink: 0 }} />
                    </h3>
                    <p style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes skyShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
          @keyframes blobDrift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(40px,30px) scale(1.1)} }
          @keyframes floatDot { 0%{transform:translateY(0) scale(1)} 100%{transform:translateY(-20px) scale(1.15)} }
          @keyframes waveFlow1 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes waveFlow2 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes waveFlow3 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes oceanSwell1 {
            0%   { transform: translateX(0) translateY(0); }
            100% { transform: translateX(8%) translateY(-12px); }
          }
          @keyframes oceanSwell2 {
            0%   { transform: translateX(0) translateY(0); }
            100% { transform: translateX(-6%) translateY(-8px); }
          }
          @keyframes oceanSwell3 {
            0%   { transform: translateX(0) translateY(0); }
            100% { transform: translateX(5%) translateY(-5px); }
          }
          @keyframes cardFloatLeft {
            0%   { transform: translateX(0px) rotate(0deg); box-shadow: 0 10px 40px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.04); }
            100% { transform: translateX(-10px) rotate(-0.6deg); box-shadow: -8px 16px 50px rgba(124,58,237,0.20), 0 4px 16px rgba(0,0,0,0.06); }
          }
          @keyframes cardFloatRight {
            0%   { transform: translateX(0px) rotate(0deg); box-shadow: 0 10px 40px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.04); }
            100% { transform: translateX(10px) rotate(0.6deg); box-shadow: 8px 16px 50px rgba(124,58,237,0.20), 0 4px 16px rgba(0,0,0,0.06); }
          }
        `}</style>

        {/* animated flowing waves — bottom exit, crests up into blue, base flush white */}
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
            {/* Extra gradient fade to vision bg */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'120px', background:'linear-gradient(180deg, transparent 0%, #07030f 100%)', pointerEvents:'none' }} />
          </div>
        )}
      </section>

      {/* ═══════════════════════ VISION ═══════════════════════ */}
      <section id="vision" className="py-24 relative section-2" style={{ background: "var(--bg-primary)" }}>
        {/* Top blend from timeline */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'80px', background: theme === 'dark' ? 'linear-gradient(180deg,#07030f 0%,transparent 100%)' : 'transparent', pointerEvents:'none', zIndex:1 }} />
        <div className="max-w-7xl mx-auto px-6" style={{ position:"relative" }}>
          <div data-parallax="0.08" style={{ position:"absolute", top:"-60px", right:"-80px", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none", zIndex:0 }} />
          <div className="text-center mb-20 reveal-on-scroll reveal-heading">
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
          <div className="grid md:grid-cols-3 gap-8 mb-20" id="vision-cards-grid">
            {[
              { icon: <Shield size={32} />, title: 'Peace & Unity', desc: 'Committed to an amicable and lasting solution to the Naga political issue that respects Naga aspirations and ensures lasting peace.', subpageId: 'vision-peace' },
              { icon: <Zap size={32} />, title: 'Development', desc: 'Championing road connectivity, healthcare, education, and economic growth across every district of Nagaland.', subpageId: 'vision-development' },
              { icon: <Heart size={32} />, title: 'Youth & Future', desc: 'Empowering youth to be job creators, not job seekers. Fostering entrepreneurship, skill development, and self-reliance.', subpageId: 'vision-youth' },
            ].map((pillar, index) => (
              <div
                key={index}
                className={`vision-card-${index} premium-3d-card p-10 text-center cursor-pointer`}
                ref={el => {
                  if (!el) return;
                  const obs = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) { el.classList.add('flip-visible'); obs.disconnect(); }
                  }, { threshold: 0.15 });
                  obs.observe(el);
                }}
                onClick={() => openSubpage(pillar.subpageId)}>
                <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-6 border border-white/40 icon-accent">
                  <span style={{ color: 'var(--card-accent-dark)' }}>{pillar.icon}</span>
                </div>
                <h3 className="font-anton text-2xl mb-4 tracking-wide">{pillar.title}</h3>
                <p className="font-poppins text-sm leading-relaxed opacity-90">{pillar.desc}</p>
                <p className="font-poppins text-[10px] tracking-widest mt-6 border-t border-white/20 pt-4 uppercase hover:underline">TAP TO EXPLORE →</p>
              </div>
            ))}
          </div>
          <div className="reveal-on-scroll reveal-fade">
            <div className="max-w-4xl mx-auto px-8 py-4 text-center">
              <h2 className="font-anton text-clamp-section leading-tight" style={{
                background: 'linear-gradient(90deg, #ffffff 0%, #f59e0b 10%, #d4a843 18%, #4a90d9 28%, #8b5cf6 38%, #3a9e6a 48%, #c94060 58%, #d4732a 68%, #f59e0b 78%, #4a90d9 88%, #ffffff 100%)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'quoteColorFlow 8s ease infinite',
              }}>"TOGETHER WE CAN BUILD A SOCIETY THAT IS STRONG, RESILIENT, JUST, INCLUSIVE AND PROSPEROUS."</h2>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ INITIATIVES ═══════════════════════ */}
      <section id="initiatives" className="py-24 section-3" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 reveal-on-scroll reveal-heading">
            <div>
              <h2 className="font-anton text-clamp-section text-[var(--text-primary)]">Key <span className="text-[var(--accent-gold)]">Initiatives</span></h2>
              <p className="font-poppins text-[var(--text-muted)] mt-2">Strategic portfolios for state transformation</p>
            </div>
            <div className="hidden md:block w-32 h-px bg-[var(--accent-gold)]"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto md:max-w-none">
            {[
              { title: 'Planning & Transformation', desc: 'Steering Nagaland\'s long-term development blueprint through strategic resource allocation and modern governance frameworks.', icon: <Target /> },
              { title: 'National Highway Development', desc: 'Improving connectivity across the state\'s difficult terrain to foster trade, tourism, and accessibility for all citizens.', icon: <MapPin /> },
              { title: 'Agriculture & Allied Sectors', desc: 'Promoting rural livelihoods and food security by empowering farmers with modern technology and market linkages.', icon: <Users /> },
              { title: 'Education & Skill Development', desc: 'Investing in Nagaland\'s human capital by modernizing schools and creating vocational training centers for the youth.', icon: <GraduationCap /> },
            ].map((item, index) => (
              <div key={index} className="premium-3d-card flex gap-6 items-start p-8 cursor-pointer reveal-on-scroll" onClick={() => {}}>
                <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center shrink-0 border border-white/40 icon-accent">
                  <span style={{ color: 'var(--card-accent-dark)' }}>{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-anton mb-2 tracking-wide" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}>{item.title}</h3>
                  <p className="font-poppins text-sm leading-relaxed opacity-90">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ACHIEVEMENTS ═══════════════════════ */}
      <section id="achievements" className="py-28 text-navy section-4" style={{ position:'relative', overflow:'hidden', background: theme === 'dark' ? 'linear-gradient(180deg, #00000f 0%, #01010f 30%, #000005 60%, #000000 100%)' : 'var(--bg-primary)' }}>
        {/* Starfield layer 1 — tiny distant stars */}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 22% 8%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 35% 25%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 48% 5%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 58% 18%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 70% 12%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1px 1px at 82% 28%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 91% 7%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 15% 42%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 27% 55%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 40% 38%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 53% 62%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 65% 45%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1px 1px at 77% 58%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 88% 40%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 5% 72%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 18% 80%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 32% 88%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 44% 75%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 56% 82%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1px 1px at 68% 90%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 79% 70%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 93% 85%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 3% 33%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 97% 50%, rgba(255,255,255,0.6) 0%, transparent 100%)`, pointerEvents:'none', zIndex:0 }} />}
        {/* Starfield layer 2 — medium stars with slight twinkle */}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1.5px 1.5px at 8% 20%, rgba(255,255,240,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 25% 35%, rgba(200,220,255,0.95) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 42% 10%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 60% 30%, rgba(255,240,220,0.9) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 75% 22%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 90% 15%, rgba(220,220,255,0.95) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 12% 60%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 38% 68%, rgba(200,230,255,0.9) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 55% 52%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 72% 75%, rgba(255,248,230,0.95) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 85% 62%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 20% 88%, rgba(220,210,255,0.9) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 48% 92%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 65% 85%, rgba(255,255,240,0.95) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 95% 78%, rgba(255,255,255,1) 0%, transparent 100%)`, animation:'starTwinkle1 4s ease-in-out infinite alternate', pointerEvents:'none', zIndex:0 }} />}
        {/* Starfield layer 3 — bright large stars */}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(2px 2px at 15% 12%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 40%, transparent 100%), radial-gradient(2px 2px at 33% 48%, rgba(255,248,200,1) 0%, rgba(255,248,200,0.3) 40%, transparent 100%), radial-gradient(2px 2px at 50% 20%, rgba(200,220,255,1) 0%, rgba(200,220,255,0.3) 40%, transparent 100%), radial-gradient(2px 2px at 67% 65%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 40%, transparent 100%), radial-gradient(2px 2px at 84% 35%, rgba(255,240,180,1) 0%, rgba(255,240,180,0.3) 40%, transparent 100%), radial-gradient(2px 2px at 6% 78%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 40%, transparent 100%), radial-gradient(2px 2px at 92% 55%, rgba(210,200,255,1) 0%, rgba(210,200,255,0.3) 40%, transparent 100%), radial-gradient(3px 3px at 28% 22%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) 50%, transparent 100%), radial-gradient(3px 3px at 73% 80%, rgba(255,248,220,1) 0%, rgba(255,248,220,0.2) 50%, transparent 100%), radial-gradient(3px 3px at 45% 90%, rgba(200,230,255,1) 0%, rgba(200,230,255,0.2) 50%, transparent 100%)`, animation:'starTwinkle2 6s ease-in-out infinite alternate-reverse', pointerEvents:'none', zIndex:0 }} />}
        {/* Milky way nebula glow — subtle purple/blue haze */}
        {theme === 'dark' && <div style={{ position:'absolute', top:'15%', left:'-10%', width:'70%', height:'60%', background:'radial-gradient(ellipse at center, rgba(80,40,160,0.12) 0%, rgba(40,20,100,0.06) 50%, transparent 75%)', transform:'rotate(-15deg)', pointerEvents:'none', zIndex:0 }} />}
        {theme === 'dark' && <div style={{ position:'absolute', bottom:'5%', right:'-5%', width:'50%', height:'50%', background:'radial-gradient(ellipse at center, rgba(60,30,140,0.1) 0%, rgba(20,10,80,0.05) 50%, transparent 75%)', transform:'rotate(10deg)', pointerEvents:'none', zIndex:0 }} />}
        {/* Shooting star */}
        {theme === 'dark' && <div style={{ position:'absolute', top:'18%', left:'-5%', width:'200px', height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)', transform:'rotate(-20deg)', animation:'shootingStar 8s linear infinite', pointerEvents:'none', zIndex:0 }} />}
        {theme === 'dark' && <div style={{ position:'absolute', top:'45%', right:'-5%', width:'150px', height:'1px', background:'linear-gradient(270deg, transparent, rgba(255,248,200,0.7), transparent)', transform:'rotate(-15deg)', animation:'shootingStar2 12s linear infinite 4s', pointerEvents:'none', zIndex:0 }} />}
        {/* Top fade from initiatives section */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'120px', background: theme === 'dark' ? 'linear-gradient(180deg, #07030f 0%, transparent 100%)' : 'transparent', pointerEvents:'none', zIndex:1 }} />

        <div className="max-w-7xl mx-auto px-6" style={{ position:'relative', zIndex:1 }}>
          <div className="text-center mb-16 reveal-on-scroll reveal-heading">
            <p className="font-poppins text-xs uppercase tracking-[0.3em] mb-3 text-[var(--text-muted)]">A life in service</p>
            <h2 className="font-anton mb-4" style={{ fontSize:'clamp(2rem,6vw,3.5rem)', letterSpacing:'0.02em', color: 'var(--text-primary)' }}><span className="title-milestone">MILESTONES OF </span><span className="title-milestone-accent">SERVICE</span></h2>
            <div style={{ width:'60px', height:'3px', background: 'var(--accent-gold)', margin:'0 auto', borderRadius:'2px' }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label:'Twice Chief Minister', sub:'of Nagaland', id:'achievement-cm', num:'2×' },
              { label:'Elected Representative', sub:'Nine consecutive terms', id:'achievement-9time', num:'9×' },
              { label:'Member of Parliament', sub:'Rajya Sabha', id:'achievement-mp', num:'RS' },
              { label:'Years of Service', sub:'Unbroken dedication', id:'achievement-40years', num:'40+' },
              { label:'Led NPF', sub:'As single largest party', id:'achievement-npf', num:'①' },
              { label:'Chairman, UDA', sub:'Urban Development Authority', id:'achievement-uda', num:'UDA' },
              { label:'Naga Resolution', sub:'Lifelong advocate', id:'achievement-naga', num:'☮' },
              { label:'NE Development', sub:'Champion of the region', id:'achievement-ne', num:'NE' },
            ].map((item, index) => (
              <div key={index} onClick={() => openSubpage(item.id)} className="reveal-on-scroll reveal-zoom cursor-pointer premium-3d-card p-8 text-center">
                {/* Number badge */}
                <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-4 border border-white/40 icon-accent">
                  <span className="font-anton text-lg" style={{ color: 'var(--card-accent-dark)' }}>{item.num}</span>
                </div>
                <h4 className="font-anton text-lg mb-1 tracking-wider uppercase">{item.label}</h4>
                <p className="font-poppins text-xs opacity-90 mb-4">{item.sub}</p>
                <p className="font-poppins text-[10px] tracking-widest border-t border-white/20 pt-4 uppercase hover:underline">TAP TO EXPLORE →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VALUES ═══════════════════════ */}
      <section className="py-24 relative overflow-hidden section-2" style={{ background: theme === 'dark' ? 'linear-gradient(180deg, #000000 0%, #00000a 50%, #00000f 100%)' : 'var(--bg-primary)' }}>
        {/* Continuous starfield — same stars as achievements for seamless sky */}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1px 1px at 5% 10%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 18% 28%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 30% 5%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 44% 18%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 55% 35%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 67% 8%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 78% 22%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1px 1px at 90% 14%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 12% 50%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 25% 65%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 38% 42%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 52% 78%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 63% 55%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1px 1px at 76% 70%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 88% 45%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 7% 82%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 21% 92%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 35% 85%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 48% 95%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 60% 88%, rgba(255,255,255,0.75) 0%, transparent 100%), radial-gradient(1px 1px at 72% 92%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 84% 80%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1px 1px at 95% 90%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1px 1px at 2% 38%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 97% 60%, rgba(255,255,255,0.6) 0%, transparent 100%)`, pointerEvents:'none', zIndex:0 }} />}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1.5px 1.5px at 9% 25%, rgba(255,255,240,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 28% 40%, rgba(200,220,255,0.95) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 45% 12%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 62% 55%, rgba(255,240,220,0.9) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 80% 30%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 14% 68%, rgba(220,220,255,0.95) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 40% 75%, rgba(255,255,255,1) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 70% 85%, rgba(200,230,255,0.9) 0%, transparent 100%), radial-gradient(2px 2px at 22% 15%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) 50%, transparent 100%), radial-gradient(2px 2px at 58% 32%, rgba(255,248,200,1) 0%, rgba(255,248,200,0.2) 50%, transparent 100%), radial-gradient(2px 2px at 85% 65%, rgba(200,220,255,1) 0%, rgba(200,220,255,0.2) 50%, transparent 100%), radial-gradient(3px 3px at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`, animation:'starTwinkle1 5s ease-in-out infinite alternate', pointerEvents:'none', zIndex:0 }} />}
        {/* Faint nebula glow */}
        {theme === 'dark' && <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'60%', height:'80%', background:'radial-gradient(ellipse at center, rgba(60,20,120,0.08) 0%, transparent 70%)', transform:'rotate(12deg)', pointerEvents:'none', zIndex:0 }} />}
        <div className="max-w-7xl mx-auto px-6 relative" style={{ zIndex:1 }}>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Integrity', id: 'value-integrity', desc: 'Unwavering commitment to honest governance and ethical leadership in every decision made for the state.' },
              { title: 'Unity', id: 'value-unity', desc: 'Bringing together diverse voices and tribes to work towards a common goal of a peaceful and prosperous Nagaland.' },
              { title: 'Progress', id: 'value-progress', desc: 'A relentless drive to modernize infrastructure, economy, and social systems while preserving our rich heritage.' },
            ].map((value, index) => (
              <div key={index} className="reveal-on-scroll cursor-pointer premium-3d-card p-10 text-center" onClick={() => openSubpage(value.id)}>
                <h3 className="font-anton text-3xl mb-6 tracking-wide">{value.title}</h3>
                <p className="font-poppins leading-relaxed text-lg opacity-90">{value.desc}</p>
                <p className="font-poppins text-[10px] tracking-widest mt-8 border-t border-white/20 pt-4 uppercase hover:underline">Read more →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CONTACT ═══════════════════════ */}
      <section id="contact" className="py-24 relative overflow-hidden section-3" style={{ background: theme === 'dark' ? 'linear-gradient(180deg, #00000f 0%, #030010 60%, #07030f 100%)' : 'var(--bg-secondary)' }}>
        {/* Sparse star layer for contact */}
        {theme === 'dark' && <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(1px 1px at 8% 20%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 20% 60%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 35% 15%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 50% 40%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 65% 75%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 78% 25%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 92% 55%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 14% 80%, rgba(255,248,220,0.9) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 55% 90%, rgba(200,220,255,0.85) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 88% 10%, rgba(255,255,255,1) 0%, transparent 100%)`, pointerEvents:'none', zIndex:0 }} />}
        <div className="max-w-7xl mx-auto px-6 relative" style={{ zIndex:1 }}>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="reveal-on-scroll reveal-left">
              <h2 className="font-anton text-clamp-section mb-8 text-[var(--text-primary)]">Connect with the <span className="text-[var(--accent-gold)]">Office</span></h2>
              <div className="space-y-6">
                {[
                  { icon: <MapPin size={24} />, title: 'Office Address', value: "Old Minister's Hill, Kohima, Nagaland", rowClass: 'office-row-1' },
                  { icon: <Briefcase size={24} />, title: 'Constituency', value: 'Peren District, Nagaland', rowClass: 'office-row-2' },
                  { icon: <Shield size={24} />, title: 'Political Party', value: 'Naga People\'s Front (NPF)', rowClass: 'office-row-3' },
                ].map((item, i) => (
                  <div key={i} className={`premium-3d-card p-6 flex items-start gap-6 ${item.rowClass}`}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 icon-accent">
                      <span style={{ color: 'var(--card-accent-dark)' }}>{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-anton text-xl mb-1">{item.title}</h4>
                      <p className="font-poppins text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center md:justify-start mt-10 pt-4">
                <a href="https://www.facebook.com/TRZeliang/" target="_blank" rel="noopener noreferrer" style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(145deg, #1877f2, #0d5abf)',
                  boxShadow: '0 4px 15px rgba(24,119,242,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(24,119,242,0.7), inset 0 1px 0 rgba(255,255,255,0.45)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(24,119,242,0.5), inset 0 1px 0 rgba(255,255,255,0.35)'; }}>
                  <span style={{ position:'absolute', top:0, left:0, width:'65%', height:'55%', background:'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 70%)', borderRadius:'50% 0 0 0', pointerEvents:'none' }} />
                  <Facebook size={20} color="white" />
                </a>
                <a href="https://www.instagram.com/trzeliang?igsh=ZTM1aTNrcWg5Y3dr" target="_blank" rel="noopener noreferrer" style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(145deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888)',
                  boxShadow: '0 4px 15px rgba(220,39,67,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(220,39,67,0.7), inset 0 1px 0 rgba(255,255,255,0.45)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(220,39,67,0.5), inset 0 1px 0 rgba(255,255,255,0.35)'; }}>
                  <span style={{ position:'absolute', top:0, left:0, width:'65%', height:'55%', background:'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 70%)', borderRadius:'50% 0 0 0', pointerEvents:'none' }} />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="reveal-on-scroll reveal-right">
              <div className="premium-3d-card p-10" style={{ border: "1px solid var(--border)" }}>
                <h3 className="font-anton text-2xl mb-8" style={{ color: '#ffffff' }}>Send a Message</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Your Name" className="contact-input w-full bg-transparent py-4 outline-none transition-colors duration-300 font-poppins" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'} />
                  <input type="email" placeholder="Your Email" className="contact-input w-full bg-transparent py-4 outline-none transition-colors duration-300 font-poppins" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'} />
                  <input type="text" placeholder="Subject" className="contact-input w-full bg-transparent py-4 outline-none transition-colors duration-300 font-poppins" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'} />
                  <textarea placeholder="Your Message" rows={4} className="contact-input w-full bg-transparent py-4 outline-none transition-colors duration-300 font-poppins resize-none" style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', color: '#ffffff', caretColor: '#ffffff' }} onFocus={e => (e.target as HTMLTextAreaElement).style.borderBottomColor = 'rgba(255,255,255,0.9)'} onBlur={e => (e.target as HTMLTextAreaElement).style.borderBottomColor = 'rgba(255,255,255,0.4)'}></textarea>
                  <button type="submit" className="w-full mt-4 font-anton uppercase tracking-widest py-3 px-6 rounded-lg text-white cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--accent-gold)", boxShadow: "0 4px 20px var(--shadow)" }}>Submit Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="py-12 border-t" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Name & title */}
          <h2 className="font-anton text-3xl text-[var(--accent-gold)] mb-1">T.R. ZELIANG</h2>
          <p className="font-poppins text-sm text-[var(--text-muted)] tracking-widest uppercase mb-8">Deputy Chief Minister, Nagaland</p>
          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => openSubpage(link.id, false)} className="font-poppins text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors text-xs uppercase tracking-widest cursor-pointer">
                {link.name}
              </button>
            ))}
          </div>
          {/* Copyright */}
          <p className="font-poppins text-[var(--text-muted)] text-xs mb-3">© 2026 Office of T.R. Zeliang. All rights reserved.</p>
          {/* Developer credit */}
          <p className="font-poppins text-[var(--text-muted)] text-xs tracking-wider">Developed by<br />          <span className="text-[var(--accent-gold)] font-semibold">NITI Technologies</span></p>
        </div>
      </footer>

      <a href="#home" className={`fixed bottom-8 right-8 w-12 h-12 bg-[var(--accent-gold)] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-40 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <ChevronRight size={24} className="-rotate-90" />
      </a>
    </div>
  );
}
