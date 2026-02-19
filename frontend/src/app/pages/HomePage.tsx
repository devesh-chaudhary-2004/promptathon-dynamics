import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import { 
  Search, 
  Code, 
  Palette, 
  Music, 
  PenTool, 
  Rocket, 
  FlaskConical,
  Database,
  Zap,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  BookOpen,
  GraduationCap,
  Trophy,
  Briefcase,
  Globe,
  CheckCircle,
  Video,
  Calendar,
  Crown,
  Flame,
  ArrowUpRight,
  Cpu,
  CloudLightning,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { skillsAPI, workshopsAPI } from "@/lib/api";

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  development: Code,
  design: Palette,
  music: Music,
  writing: PenTool,
  science: FlaskConical,
  dsa: Database,
  "data-science": Database,
  marketing: TrendingUp,
  "ai-ml": Cpu,
  cloud: CloudLightning,
  business: Briefcase,
  languages: Globe,
  other: Rocket,
};

const categoryColors: Record<string, string> = {
  development: "from-teal-500 to-cyan-500",
  design: "from-teal-400 to-emerald-500",
  music: "from-cyan-500 to-teal-500",
  writing: "from-emerald-500 to-teal-500",
  science: "from-teal-600 to-emerald-500",
  dsa: "from-cyan-600 to-teal-500",
  "data-science": "from-teal-500 to-cyan-600",
  marketing: "from-emerald-500 to-cyan-500",
  "ai-ml": "from-teal-500 to-cyan-400",
  cloud: "from-cyan-500 to-teal-600",
  business: "from-teal-400 to-emerald-400",
  languages: "from-emerald-500 to-cyan-500",
  other: "from-teal-500 to-emerald-500",
};

const howItWorks = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up and list the skills you can teach and want to learn",
    icon: GraduationCap,
    color: "from-teal-500 to-cyan-500",
  },
  {
    step: 2,
    title: "Find Your Match",
    description: "Browse thousands of skills and find the perfect learning partner",
    icon: Search,
    color: "from-cyan-500 to-teal-400",
  },
  {
    step: 3,
    title: "Start Swapping",
    description: "Schedule sessions, exchange knowledge, and grow together",
    icon: Zap,
    color: "from-emerald-500 to-teal-500",
  },
  {
    step: 4,
    title: "Earn & Learn",
    description: "Earn credits by teaching, spend them on premium skills",
    icon: Trophy,
    color: "from-teal-400 to-emerald-500",
  },
];

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-teal-500/30"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, "-100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// Skill card skeleton
function SkillCardSkeleton() {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="h-2 w-full bg-gradient-to-r from-gray-700 to-gray-600" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-6 w-24 bg-white/10" />
            <Skeleton className="h-5 w-16 bg-white/10" />
          </div>
          <Skeleton className="h-6 w-full mb-2 bg-white/10" />
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
          </div>
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-5 w-16 bg-white/10" />
            <Skeleton className="h-5 w-16 bg-white/10" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20 bg-white/10" />
            <Skeleton className="h-8 w-24 bg-white/10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Skill {
  _id: string;
  title: string;
  category: string;
  expertise: string;
  price: number;
  isPremium: boolean;
  teachingMode: string;
  rating: { average: number; count: number };
  stats: { students: number };
  user: {
    _id: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

interface Workshop {
  _id: string;
  title: string;
  category: string;
  scheduledDate: string;
  startTime: string;
  duration: number;
  price: number;
  isFree: boolean;
  stats: { registrations: number };
  host: {
    _id: string;
    name: string;
  };
}

interface Stats {
  totalUsers?: number;
  totalSkills?: number;
  totalSwaps?: number;
  totalWorkshops?: number;
}

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([]);
  const [categories, setCategories] = useState<{ _id: string; count: number }[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [skillsRes, workshopsRes, categoriesRes] = await Promise.all([
        skillsAPI.getFeatured().catch(() => ({ data: { skills: [] } })),
        workshopsAPI.getUpcoming().catch(() => ({ data: { workshops: [] } })),
        skillsAPI.getCategories().catch(() => ({ data: { categories: [] } })),
      ]);

      setFeaturedSkills(skillsRes.data.skills || []);
      setUpcomingWorkshops(workshopsRes.data.workshops || []);
      setCategories(categoriesRes.data.categories || []);
      
      // Calculate stats from fetched data
      const totalSkills = categoriesRes.data.categories?.reduce((acc: number, cat: { count: number }) => acc + cat.count, 0) || 0;
      setStats({
        totalUsers: 50000 + totalSkills * 10,
        totalSkills: totalSkills || 5000,
        totalSwaps: 125000 + totalSkills * 25,
        totalWorkshops: workshopsRes.data.workshops?.length || 100,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const displayStats = [
    { label: "Active Students", value: stats.totalUsers ? `${Math.floor(stats.totalUsers / 1000)}K+` : "50K+", icon: Users, color: "from-teal-500 to-cyan-500" },
    { label: "Skills Available", value: stats.totalSkills ? `${stats.totalSkills}+` : "5K+", icon: Zap, color: "from-teal-400 to-emerald-500" },
    { label: "Success Rate", value: "98%", icon: Award, color: "from-emerald-500 to-teal-500" },
    { label: "Workshops", value: stats.totalWorkshops ? `${stats.totalWorkshops}+` : "100+", icon: Crown, color: "from-cyan-500 to-teal-400" },
  ];

  // Default categories if API returns empty
  const defaultCategories = [
    { _id: "development", count: 1247 },
    { _id: "design", count: 892 },
    { _id: "music", count: 634 },
    { _id: "writing", count: 521 },
    { _id: "science", count: 445 },
    { _id: "dsa", count: 789 },
    { _id: "ai-ml", count: 567 },
    { _id: "cloud", count: 423 },
    { _id: "business", count: 312 },
    { _id: "languages", count: 478 },
    { _id: "marketing", count: 298 },
    { _id: "other", count: 356 },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 blob-bg">
        <FloatingParticles />
        
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full filter blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full filter blur-[100px] animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-[100px] animate-blob" style={{ animationDelay: "4s" }} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container relative mx-auto text-center z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 inline-block"
          >
            <Badge className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 px-6 py-3 text-sm backdrop-blur-xl">
              <Sparkles className="mr-2 h-4 w-4 text-teal-400 animate-pulse" />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent font-heading font-semibold">
                Join {stats.totalUsers ? `${Math.floor(stats.totalUsers / 1000)}K+` : "50K+"} Students Learning Together
              </span>
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-5xl font-bold font-heading md:text-7xl lg:text-8xl"
          >
            <span className="bg-gradient-to-r from-white via-teal-100 to-white bg-clip-text text-transparent">
              Swap Skills,
            </span>
            <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Grow Together
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 md:text-xl"
          >
            Exchange knowledge with students worldwide. Learn what you want by teaching what you know.
            No money needed — just skills!
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSearch}
            className="mx-auto mb-8 max-w-2xl"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
                <Search className="ml-4 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for skills like 'React', 'Design', 'Python'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0"
                />
                <Button type="submit" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl px-6">
                  Search
                </Button>
              </div>
            </div>
          </motion.form>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 gap-2 text-white font-heading font-semibold px-8 rounded-xl shadow-lg shadow-teal-500/25">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/skills">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 gap-2 text-white font-heading rounded-xl">
                <BookOpen className="h-4 w-4" />
                Browse Skills
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 border-y border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold font-heading text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-teal-500/10 text-teal-400 border-teal-500/20">
              <Flame className="mr-2 h-4 w-4" />
              Explore Categories
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">
              Learn Anything You Want
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From coding to creativity, find the perfect skill to master
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {loading ? (
              [...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />
              ))
            ) : (
              displayCategories.map((category, index) => {
                const Icon = categoryIcons[category._id] || Rocket;
                const color = categoryColors[category._id] || "from-teal-500 to-cyan-500";
                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/skills?category=${category._id}`}>
                      <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group cursor-pointer h-full">
                        <CardContent className="p-6 text-center">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${color} mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-heading font-semibold text-white capitalize mb-1">
                            {category._id.replace("-", " ")}
                          </h3>
                          <p className="text-sm text-gray-400">{category.count} skills</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <Badge className="mb-4 bg-teal-500/10 text-teal-400 border-teal-500/20">
                <Star className="mr-2 h-4 w-4" />
                Featured Skills
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">
                Top Rated by Students
              </h2>
            </div>
            <Link to="/skills">
              <Button variant="ghost" className="text-teal-400 hover:text-teal-300 gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {error && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-red-400 mb-4">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
              <Button onClick={fetchData} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => <SkillCardSkeleton key={i} />)
            ) : featuredSkills.length > 0 ? (
              featuredSkills.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/skills/${skill._id}`}>
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group cursor-pointer overflow-hidden">
                      <CardContent className="p-0">
                        <div className={`h-2 w-full bg-gradient-to-r ${categoryColors[skill.category] || "from-teal-500 to-cyan-500"}`} />
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <Badge className="bg-white/10 text-white capitalize">
                              {skill.category.replace("-", " ")}
                            </Badge>
                            {skill.isPremium && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                <Crown className="mr-1 h-3 w-3" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-heading font-semibold text-white mb-3 group-hover:text-teal-400 transition-colors line-clamp-2">
                            {skill.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                              {skill.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                            </div>
                            <div>
                              <p className="text-sm text-white flex items-center gap-1">
                                {skill.user?.name || "Unknown"}
                                {skill.user?.isVerified && (
                                  <CheckCircle className="h-3 w-3 text-teal-400" />
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-white">{skill.rating?.average?.toFixed(1) || "New"}</span>
                              <span>({skill.rating?.count || 0})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{skill.stats?.students || 0} students</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-white">
                              {skill.price > 0 ? (
                                <span>{skill.price} <span className="text-sm text-gray-400">credits</span></span>
                              ) : (
                                <span className="text-teal-400">Free</span>
                              )}
                            </div>
                            <Button size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400 mb-4">No featured skills available yet. Be the first to add one!</p>
                <Link to="/add-skill">
                  <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 gap-2">
                    Add Your Skill
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Workshops Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                <Video className="mr-2 h-4 w-4" />
                Live Workshops
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">
                Upcoming Sessions
              </h2>
            </div>
            <Link to="/workshops">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl bg-white/5" />
              ))
            ) : upcomingWorkshops.length > 0 ? (
              upcomingWorkshops.slice(0, 3).map((workshop, index) => (
                <motion.div
                  key={workshop._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/workshops/${workshop._id}`}>
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge className="bg-white/10 text-white capitalize">
                            {workshop.category?.replace("-", " ") || "General"}
                          </Badge>
                          {workshop.isFree ? (
                            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                              Free
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              {workshop.price} credits
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-heading font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                          {workshop.title}
                        </h3>

                        <p className="text-sm text-gray-400 mb-4">
                          By {workshop.host?.name || "TBA"}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(workshop.scheduledDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {workshop.startTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {workshop.stats?.registrations || 0}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400 mb-4">No upcoming workshops scheduled yet.</p>
                <Link to="/workshops">
                  <Button variant="outline" className="gap-2">
                    Browse Workshops
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Sparkles className="mr-2 h-4 w-4" />
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">
              How SkillX Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start learning and teaching in just a few simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-center p-8 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} mb-6 shadow-lg`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of students who are already swapping skills and growing together. 
                Your first skill exchange is just a click away!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 gap-2 font-heading font-semibold px-8 rounded-xl shadow-lg">
                    Create Free Account
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/skills">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 font-heading rounded-xl">
                    <BookOpen className="h-5 w-5" />
                    Explore Skills
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
