import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ContactWidget from "../components/ContactWidget";
import { XMarkIcon, ArrowDownRightIcon } from "@heroicons/react/24/solid";
import { ArrowUpRightIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

// Static portfolio details
const PROFILE = {
    initials: "AM",
    firstLine: "Akinkunmi",
    secondLine: "Matthew Olanrewaju",
    fullName: "Akinkunmi Matthew Olanrewaju",
    roleTitle: "UI/UX Designer",
    availability: "AVAILABLE FOR HIRE",
    heroTagline:
        "I design thoughtful digital products that make complex experiences feel simple, useful and intuitive.",
    avatarUrl: "https://nihvlpualzqyghiquimb.supabase.co/storage/v1/object/public/project-images/Profile/profile.png",
    cvUrl: "",
    aboutParagraphs: [
        "I'm Akinkunmi Matthew, a UI/UX Designer interested in creating useful digital experiences.",
        "I enjoy understanding problems, structuring information and translating ideas into clear, thoughtful interfaces.",
        "My approach combines problem-solving, user-centred thinking and visual design to create products that are functional, intuitive and accessible.",
    ],
    experience: {
        label: "RECENT EXPERIENCE",
        role: "UI/UX Designer",
        period: "Jan 2026 – Nov 2026",
        org: "Office of the Head of Service, Government House Umuahia",
        points: [
            "Contributed to the design of internal digital products, focusing on identifying user needs, understanding existing challenges and translating them into practical design solutions. Worked on user flows, information architecture and interface design, creating clear and intuitive experiences that simplify everyday tasks.",
            "Collaborated with developers to communicate design decisions and ensure the proposed interfaces aligned with the intended product functionality.",
        ],
    },
    capabilities: [
        "Product Design",
        "UI/UX Design",
        "UX Research",
        "User Flows",
        "Information Architecture",
        "Wireframing",
        "Prototyping",
        "Design Systems",
        "Responsive Design",
        "Developer Handoff",
    ],
    testimonials: [
        {
            quote: "Testimonial placeholder",
            subtext: "Verified testimonial, name, role and organisation to be added.",
            author: "",
            role: "",
        },
        {
            quote: "Testimonial placeholder",
            subtext: "Verified testimonial, name, role and organisation to be added.",
            author: "",
            role: "",
        },
        {
            quote: "Testimonial placeholder",
            subtext: "Verified testimonial, name, role and organisation to be added.",
            author: "",
            role: "",
        },
    ],
    ctaText:
        "I'm always interested in meaningful products, thoughtful collaborations and opportunities to solve real problems through design.",
    email: "akinkunmi.mat@gmail.com",
    whatsappNumber: "2348000000000",
    linkedinUrl: "",
    xUrl: "",
};

export default function PortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [activeCaseStudy, setActiveCaseStudy] = useState(null);
    const [widgetSignal, setWidgetSignal] = useState(0);

    useEffect(() => {
        async function loadProjects() {
            try {
                const { data, error } = await supabase
                    .from("projects")
                    .select("*")
                    .order("sort_order", { ascending: true })
                    .order("created_at", { ascending: false });

                if (!error) {
                    setProjects(data || []);
                }
            } finally {
                setLoadingProjects(false);
            }
        }

        loadProjects();
    }, []);

    return (
        <div
            id="home"
            className="min-h-screen bg-[#120c16] text-white selection:bg-[#181120] selection:text-white"
        >
            {/* Floating Pill Navbar */}
            <header className="sticky top-5 z-40 px-4">
                <nav className="max-w-4xl mx-auto rounded-full bg-[#1b1220]/95 backdrop-blur-md border border-white/10 px-3 py-2 flex items-center justify-between shadow-xl">
                    <a href="#home" className="flex items-center gap-2.5">
                        {PROFILE.avatarUrl ? (
                            <img
                                src={PROFILE.avatarUrl}
                                alt={PROFILE.fullName}
                                className="h-9 w-9 rounded-full object-cover border border-white/15"
                            />
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-[#e85d04]/20 border border-[#e85d04]/50 flex items-center justify-center text-xs font-bold text-[#ff7b29]">
                                {PROFILE.initials}
                            </div>
                        )}
                    </a>

                    <div className="hidden sm:flex items-center gap-7 text-xs font-medium text-zinc-300">
                        <a href="#home" className="text-white hover:text-[#e85d04] transition">
                            Home
                        </a>
                        <a href="#work" className="hover:text-[#e85d04] transition">
                            Work
                        </a>
                        <a href="#about" className="hover:text-[#e85d04] transition">
                            About
                        </a>
                        <button
                            type="button"
                            onClick={() => setWidgetSignal((n) => n + 1)}
                            className="hover:text-[#e85d04] transition"
                        >
                            Contact
                        </button>
                    </div>

                    {PROFILE.cvUrl ? (
                        <a
                            href={PROFILE.cvUrl}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="rounded-full bg-[#e85d04] hover:bg-[#f46a0e] px-4 py-2 text-xs font-semibold text-white transition"
                        >
                            Download CV
                        </a>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setWidgetSignal((n) => n + 1)}
                            className="rounded-full bg-[#e85d04] hover:bg-[#f46a0e] px-4 py-2 text-xs font-semibold text-white transition"
                        >
                            Download CV
                        </button>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <section className="max-w-5xl mx-auto px-6 pt-16 pb-24">
                <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-zinc-400 mb-6">
                    <span className="h-2 w-2 rounded-full bg-[#e85d04]" />
                    <span>{PROFILE.availability}</span>
                </div>

                <h1 className="font-sans font-bold tracking-tight leading-[0.98] text-5xl sm:text-7xl md:text-8xl">
                    <span className="block text-white">{PROFILE.firstLine}</span>
                    <span
                        className="block text-transparent mt-1"
                        style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.75)" }}
                    >
                        {PROFILE.secondLine}
                    </span>
                </h1>

                <div className="mt-10 pt-8 border-t border-white/10 grid md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-5 text-lg sm:text-xl font-semibold text-zinc-200">
                        {PROFILE.roleTitle}
                    </div>
                    <div className="md:col-span-7 space-y-6">
                        <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
                            {PROFILE.heroTagline}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#work"
                                className="inline-flex items-center gap-3 rounded-full bg-[#e85d04] hover:bg-[#f46a0e] px-6 py-3 text-sm font-semibold text-white transition"
                            >
                                <span>Explore My Work</span>
                                <ArrowUpRightIcon className="w-3 h-3" />
                            </a>
                            <a
                                href="#about"
                                className="rounded-full inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 text-sm font-medium text-zinc-200 transition"
                            >
                                <span> More About Me</span>
                             <ArrowRightIcon className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Selected Work Section */}
            <section id="work" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                <div className="grid md:grid-cols-12 gap-6 items-end mb-14">
                    <div className="md:col-span-4 text-[11px] tracking-[0.2em] uppercase text-zinc-400">
                        — SELECTED WORK
                    </div>
                    <div className="md:col-span-8">
                        <h2 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight">
                            A selection of <span className="text-[#e85d04]">my work</span>
                        </h2>
                        <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                            Exploring ideas, solving problems and designing meaningful digital experiences.
                        </p>
                    </div>
                </div>

                {loadingProjects ? (
                    <div className="text-sm text-zinc-400 py-8">Loading projects...</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project, index) => {
                            const coverImage = project.images?.[0]?.url;
                            const num = String(index + 1).padStart(2, "0");

                            return (
                                <article key={project.id} className="group flex flex-col">
                                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#1a1120] border border-white/10 flex items-center justify-center">
                                        {coverImage ? (
                                            <img
                                                src={coverImage}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                                            />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full border border-[#e85d04]/40 flex items-center justify-center text-2xl font-bold text-white">
                                                {project.title?.[0]?.toUpperCase() || "P"}
                                            </div>
                                        )}

                                        <span className="absolute bottom-3 left-3 text-xs font-mono text-zinc-400 bg-black/50 px-2.5 py-1 rounded-md">
                                            {num}
                                        </span>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between text-[11px] tracking-[0.16em] uppercase text-[#e85d04] font-semibold">
                                        <span>{project.category || "PROJECT"}</span>
                                        <span className="text-zinc-500 font-mono">{num}</span>
                                    </div>

                                    <h3 className="mt-1.5 text-2xl font-bold text-white">{project.title}</h3>
                                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed line-clamp-3">
                                        {project.summary || project.description}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-5 text-xs font-medium">
                                        <button
                                            type="button"
                                            onClick={() => setActiveCaseStudy(project)}
                                            className="text-white hover:text-[#e85d04] transition"
                                        >
                                            View Case Study →
                                        </button>

                                        {project.is_private ? (
                                            <span className="text-zinc-500">URL PENDING</span>
                                        ) : (
                                            project.live_url && (
                                                <a
                                                    href={project.live_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-zinc-300 hover:text-white transition"
                                                >
                                                    View Live ↗
                                                </a>
                                            )
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* About Me Section */}
            <section id="about" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                <div className="text-[11px] tracking-[0.2em] uppercase text-zinc-400 mb-4">
                    — ABOUT ME
                </div>
                <h2 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight mb-12">
                    A little <span className="text-[#e85d04]">about me</span>
                </h2>

                <div className="grid md:grid-cols-12 gap-10 items-start">
                    <div className="md:col-span-5">
                        <div className="aspect-[4/4.5] rounded-3xl overflow-hidden bg-[#1a1120] border border-white/10">
                            {PROFILE.avatarUrl ? (
                                <img
                                    src={PROFILE.avatarUrl}
                                    alt={PROFILE.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
                                    {PROFILE.fullName}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-7 space-y-6">
                        <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
                            {PROFILE.aboutParagraphs.map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-2">
                            <div className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#e85d04]">
                                <span>{PROFILE.experience.label}</span>
                                <span className="text-zinc-400">{PROFILE.experience.period}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{PROFILE.experience.role}</h3>
                            <p className="text-xs text-zinc-400">{PROFILE.experience.org}</p>
                            <ul className="space-y-2 text-xs sm:text-sm text-zinc-400 pt-1">
                                {PROFILE.experience.points.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <p className="text-[11px] tracking-[0.18em] uppercase text-[#e85d04] mb-3">
                                CAPABILITIES
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {PROFILE.capabilities.map((cap, i) => (
                                    <span
                                        key={i}
                                        className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-zinc-300"
                                    >
                                        {cap}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                <div className="grid md:grid-cols-12 gap-6 items-end mb-12">
                    <div className="md:col-span-4 text-[11px] tracking-[0.2em] uppercase text-zinc-400">
                        — TESTIMONIALS
                    </div>
                    <div className="md:col-span-8">
                        <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight">
                            Words from people <span className="text-[#e85d04]">I&apos;ve worked with</span>
                        </h2>
                        <p className="text-zinc-400 mt-2 text-sm">
                            A few thoughts and experiences from people I&apos;ve had the opportunity to collaborate with.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {PROFILE.testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="rounded-xl bg-[#18101c] border border-white/10 p-6 flex flex-col justify-between min-h-[210px]"
                        >
                            <div>
                                <div className="text-2xl font-bold text-[#e85d04] mb-3">“</div>
                                <p className="text-sm font-semibold text-white">{t.quote}</p>
                                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{t.subtext}</p>
                            </div>
                            <div className="mt-6 pt-3 border-t border-white/5 flex items-center gap-3">
                                <div className="h-7 w-7 rounded-full bg-white/10 shrink-0" />
                                <div className="space-y-1">
                                    {t.author && <p className="text-xs font-semibold text-zinc-200">{t.author}</p>}
                                    {t.role && <p className="text-[11px] text-zinc-500">{t.role}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Burnt-Orange CTA Banner */}
            <section className="bg-[#d9530f] text-white py-20 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7">
                        <p className="text-[11px] tracking-[0.2em] uppercase text-white/80 mb-4">
                            — GET IN TOUCH
                        </p>
                        <h2 className="text-5xl sm:text-7xl font-sans font-bold tracking-tight leading-[0.98]">
                            <span className="block">Have a product in</span>
                            <span
                                className="block text-transparent mt-1"
                                style={{ WebkitTextStroke: "1.5px #ffffff" }}
                            >
                                mind?
                            </span>
                        </h2>
                    </div>

                    <div className="md:col-span-5 space-y-5">
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                            {PROFILE.ctaText}
                        </p>

                        <button
                            type="button"
                            onClick={() => setWidgetSignal((n) => n + 1)}
                            className="rounded-full bg-[#120c16] inline-flex gap-4 items-center hover:bg-black text-white px-6 py-3 text-sm font-semibold transition"
                        >
                                <span>Explore My Work</span>
                                <ArrowUpRightIcon className="w-3 h-3" />
                           
                        </button>

                        <div className="pt-2">
                            <a
                                href={`mailto:${PROFILE.email}`}
                                className="text-sm underline underline-offset-4 text-white/95 hover:text-white"
                            >
                                {PROFILE.email}
                            </a>
                        </div>

                        <div className="space-y-1 pt-1">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-white/75">
                                SOCIAL PROFILES COMING SOON:
                            </p>
                            <div className="flex gap-4 text-xs uppercase tracking-wider text-white/90">
                                {PROFILE.linkedinUrl ? (
                                    <a href={PROFILE.linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                        LINKEDIN
                                    </a>
                                ) : (
                                    <span>LINKEDIN</span>
                                )}
                                {PROFILE.xUrl ? (
                                    <a href={PROFILE.xUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                        X
                                    </a>
                                ) : (
                                    <span>X</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#120c16] border-t border-white/10 py-8 px-6 text-xs text-zinc-400">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-white">
                            {PROFILE.initials}
                        </div>
                        <div>
                            <div className="font-semibold text-[#e85d04]">{PROFILE.fullName}</div>
                            <div className="text-[11px] text-zinc-500">{PROFILE.roleTitle}</div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <a href="#home" className="hover:text-white">
                            Home
                        </a>
                        <a href="#work" className="hover:text-white">
                            Work
                        </a>
                        <a href="#about" className="hover:text-white">
                            About
                        </a>
                        <button
                            type="button"
                            onClick={() => setWidgetSignal((n) => n + 1)}
                            className="hover:text-white"
                        >
                            Contact
                        </button>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1 text-[11px] text-zinc-500">
                        <div>© 2026 {PROFILE.firstLine}. All rights reserved.</div>
                        <div>
                            Engineered by{" "}
                            <a
                                href="https://samplexweb-portfolio.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#e85d04] hover:underline font-semibold"
                            >
                                Samplex Web Solutions
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Case Study / Files Modal */}
            {activeCaseStudy && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setActiveCaseStudy(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#18101c] border border-white/15 p-6 space-y-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#e85d04]">
                                    {activeCaseStudy.category}
                                </p>
                                <h3 className="text-2xl font-bold mt-1">{activeCaseStudy.title}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveCaseStudy(null)}
                                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {(activeCaseStudy.images || []).length > 0 && (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {activeCaseStudy.images.map((img) => (
                                    <img
                                        key={img.path || img.url}
                                        src={img.url}
                                        alt={img.name || activeCaseStudy.title}
                                        className="w-full h-44 object-cover rounded-xl border border-white/10"
                                    />
                                ))}
                            </div>
                        )}

                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                            {activeCaseStudy.case_study || activeCaseStudy.summary || activeCaseStudy.description}
                        </p>

                        {(activeCaseStudy.attachments || []).length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-white/10">
                                <p className="text-xs uppercase tracking-wider text-zinc-400">
                                    Attached Files
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {activeCaseStudy.attachments.map((file) => (
                                        <a
                                            key={file.path || file.url}
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            download={file.name}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-zinc-200 hover:border-[#e85d04]"
                                        >
                                            {file.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating WhatsApp + EmailJS Modal Widget */}
            <ContactWidget
                whatsappNumber={PROFILE.whatsappNumber}
                externalOpenSignal={widgetSignal}
            />
        </div>
    );
}