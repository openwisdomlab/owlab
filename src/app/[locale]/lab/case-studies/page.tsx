"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  Users,
  Cpu,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  category: "research" | "enterprise" | "startup" | "education";
  size: string;
  image: string;
  description: string;
  features: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "OpenAI Research Lab",
    company: "OpenAI",
    category: "research",
    size: "5000 sqft",
    image: "/images/case-openai.jpg",
    description: "State-of-the-art AI research facility with distributed GPU clusters and collaborative spaces.",
    features: ["GPU Cluster", "Meeting Pods", "Open Workspace", "Server Room"],
  },
  {
    id: "2",
    title: "DeepMind London HQ",
    company: "DeepMind",
    category: "research",
    size: "8000 sqft",
    image: "/images/case-deepmind.jpg",
    description: "Multi-floor research center combining theoretical and applied AI research spaces.",
    features: ["Research Labs", "Library", "Presentation Hall", "Gaming Area"],
  },
  {
    id: "3",
    title: "Startup AI Lab",
    company: "AI Startup",
    category: "startup",
    size: "1500 sqft",
    image: "/images/case-startup.jpg",
    description: "Compact, efficient lab design optimized for early-stage AI companies.",
    features: ["Shared Workspace", "Mini Server", "Brainstorm Room", "Kitchen"],
  },
  {
    id: "4",
    title: "University ML Center",
    company: "MIT",
    category: "education",
    size: "3000 sqft",
    image: "/images/case-university.jpg",
    description: "Academic research lab designed for teaching and advanced ML research.",
    features: ["Lecture Hall", "Student Labs", "Faculty Offices", "Equipment Room"],
  },
  {
    id: "5",
    title: "Enterprise AI Division",
    company: "Fortune 500",
    category: "enterprise",
    size: "12000 sqft",
    image: "/images/case-enterprise.jpg",
    description: "Large-scale enterprise AI department with multiple specialized zones.",
    features: ["Data Center", "Executive Suite", "Training Center", "Showroom"],
  },
];

const categories = [
  { id: "all", label: "All", icon: Filter },
  { id: "research", label: "Research", icon: Cpu },
  { id: "enterprise", label: "Enterprise", icon: Building2 },
  { id: "startup", label: "Startup", icon: Users },
  { id: "education", label: "Education", icon: BookOpen },
];

export default function CaseStudiesPage() {
  const t = useTranslations("lab.caseStudies");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudies = caseStudies.filter((study) => {
    const matchesCategory =
      selectedCategory === "all" || study.category === selectedCategory;
    const matchesSearch =
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--neon-green)]/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-[var(--neon-green)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-[var(--muted-foreground)]">{t("description")}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                    : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Case Study Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group cursor-pointer hover:border-[var(--neon-cyan)] transition-all"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-violet)]/20 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-[var(--muted-foreground)]" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                    {study.category}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {study.size}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-1">{study.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-3">
                  {study.company}
                </p>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                  {study.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 text-xs rounded bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                    >
                      {feature}
                    </span>
                  ))}
                  {study.features.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                      +{study.features.length - 3}
                    </span>
                  )}
                </div>

                {/* View Button */}
                <button className="flex items-center gap-2 text-[var(--neon-cyan)] font-medium group-hover:gap-3 transition-all">
                  <span>{t("viewDetails")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--muted-foreground)]">{t("noResults")}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
