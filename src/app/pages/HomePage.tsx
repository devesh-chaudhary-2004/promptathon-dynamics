import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
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
  Play,
  Star,
  Clock,
  BookOpen,
  GraduationCap,
  Trophy,
  Target,
  Briefcase,
  Globe,
  Shield,
  CheckCircle,
  MessageSquare,
  Video,
  Calendar,
  CreditCard,
  Crown,
  Flame,
  Heart,
  ArrowUpRight,
  BarChart3,
  Layers,
  Cpu,
  CloudLightning
} from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";

const categories = [
  { name: "Development", icon: Code, color: "from-teal-500 to-cyan-500", count: 1247, trending: true },
  { name: "Art & Design", icon: Palette, color: "from-teal-400 to-emerald-500", count: 892 },
  { name: "Music", icon: Music, color: "from-cyan-500 to-teal-500", count: 634 },
  { name: "Writing", icon: PenTool, color: "from-emerald-500 to-teal-500", count: 521 },
  { name: "Science", icon: FlaskConical, color: "from-teal-600 to-emerald-500", count: 445 },
  { name: "DSA", icon: Database, color: "from-cyan-600 to-teal-500", count: 789, trending: true },
  { name: "Deployment", icon: Rocket, color: "from-teal-500 to-cyan-600", count: 356 },
  { name: "Marketing", icon: TrendingUp, color: "from-emerald-500 to-cyan-500", count: 298 },
  { name: "AI & ML", icon: Cpu, color: "from-teal-500 to-cyan-400", count: 567, trending: true },
  { name: "Cloud", icon: CloudLightning, color: "from-cyan-500 to-teal-600", count: 423 },
  { name: "Business", icon: Briefcase, color: "from-teal-400 to-emerald-400", count: 312 },
  { name: "Languages", icon: Globe, color: "from-emerald-500 to-cyan-500", count: 478 },
];

const stats = [
  { label: "Active Students", value: "50K+", icon: Users, color: "from-teal-500 to-cyan-500" },
  { label: "Skills Swapped", value: "125K+", icon: Zap, color: "from-teal-400 to-emerald-500" },
  { label: "Success Rate", value: "98%", icon: Award, color: "from-emerald-500 to-teal-500" },
  { label: "Pro Mentors", value: "5K+", icon: Crown, color: "from-cyan-500 to-teal-400" },
];

const featuredSkills = [
  {
    id: 1,
    title: "Advanced React & Next.js Development",
    user: "Sarah Chen",
    avatar: "SC",
    rating: 4.9,
    reviews: 127,
    level: "Advanced",
    mode: "Online",
    category: "Development",
    isPremium: true,
    price: 500,
    students: 89,
    verified: true,
  },
  {
    id: 2,
    title: "UI/UX Design & Figma Mastery",
    user: "Alex Kumar",
    avatar: "AK",
    rating: 4.8,
    reviews: 98,
    level: "Intermediate",
    mode: "Hybrid",
    category: "Design",
    isPremium: false,
    price: 0,
    students: 67,
    verified: true,
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    user: "Michael Zhang",
    avatar: "MZ",
    rating: 5.0,
    reviews: 203,
    level: "Advanced",
    mode: "Online",
    category: "DSA",
    isPremium: true,
    price: 750,
    students: 156,
    verified: true,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Emily Rodriguez",
    avatar: "ER",
    role: "Computer Science Student",
    college: "MIT",
    content: "SkillX transformed my learning journey. I traded my graphic design skills for Python programming and it was the best decision ever!",
    rating: 5,
  },
  {
    id: 2,
    name: "David Park",
    avatar: "DP",
    role: "Software Developer",
    college: "Stanford",
    content: "The skill credit system is genius! I've earned enough credits to take premium courses just by teaching web development.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Sharma",
    avatar: "PS",
    role: "Design Student",
    college: "Parsons",
    content: "Found amazing mentors in the community. The scheduling feature makes it so easy to manage sessions across time zones.",
    rating: 5,
  },
];

const upcomingWorkshops = [
  {
    id: 1,
    title: "Master System Design",
    instructor: "John Chen",
    date: "Feb 15, 2026",
    time: "6:00 PM EST",
    attendees: 234,
    price: 500,
    category: "Development",
  },
  {
    id: 2,
    title: "AI/ML Fundamentals",
    instructor: "Dr. Sarah Kim",
    date: "Feb 18, 2026",
    time: "4:00 PM EST",
    attendees: 189,
    price: 750,
    category: "AI & ML",
  },
  {
    id: 3,
    title: "Product Design Sprint",
    instructor: "Mike Johnson",
    date: "Feb 20, 2026",
    time: "5:00 PM EST",
    attendees: 145,
    price: 0,
    category: "Design",
  },
];

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

const trendingSkills = [
  { name: "React.js", growth: "+45%", searches: 12500 },
  { name: "Machine Learning", growth: "+67%", searches: 9800 },
  { name: "System Design", growth: "+52%", searches: 8700 },
  { name: "UI/UX Design", growth: "+38%", searches: 7600 },
  { name: "Data Science", growth: "+41%", searches: 6900 },
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

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
                Join 50,000+ Students Learning Together
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
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Grow Together
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mb-12 max-w-3xl text-lg text-gray-300 md:text-xl leading-relaxed"
          >
            The world's first peer-to-peer skill exchange platform for students.
            <br className="hidden md:block" />
            Trade your expertise, earn credits, and unlock unlimited learning opportunities.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-8 max-w-3xl"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-5 h-6 w-6 text-gray-400" />
                <Input
                  placeholder="Search for skills like React, Guitar, Photography..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="h-16 border-white/10 bg-slate-900/80 backdrop-blur-xl pl-14 pr-36 text-white placeholder:text-gray-400 rounded-2xl text-lg focus:ring-2 focus:ring-teal-500/50"
                />
                <Button className="absolute right-2 h-12 px-8 btn-primary rounded-xl font-heading font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25">
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-400">Popular:</span>
              {["React", "Python", "UI Design", "Machine Learning", "DSA"].map((skill) => (
                <button
                  key={skill}
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium"
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/add-skill">
              <Button size="lg" className="h-14 px-8 btn-primary rounded-xl font-heading font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25">
                <Zap className="mr-2 h-5 w-5" />
                Add Your Skill
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl font-heading font-semibold text-lg backdrop-blur-xl transition-all hover:scale-105">
                <Search className="mr-2 h-5 w-5" />
                Explore Skills
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl font-heading font-semibold text-lg backdrop-blur-xl transition-all hover:scale-105">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span>Verified Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-400" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-white/10 bg-gradient-to-r from-purple-900/20 via-slate-900/50 to-pink-900/20 px-4 py-16 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-purple-500/20`}
                >
                  <stat.icon className="h-10 w-10 text-white" />
                </motion.div>
                <motion.div 
                  className="mb-2 text-4xl font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Simple Process
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400 text-lg">
              Get started in minutes and begin your skill exchange journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connection Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent" />
                )}
                
                <motion.div
                  whileHover={{ y: -10 }}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:bg-white/10"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-lg font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  
                  <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-24 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              Diverse Categories
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Explore <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400 text-lg">
              Find the perfect skill match in your area of interest
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link to={`/marketplace?category=${category.name}`}>
                  <Card className="relative border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:bg-white/10 overflow-hidden group">
                    {category.trending && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-xs px-2 py-0.5">
                          <Flame className="mr-1 h-3 w-3" />
                          Hot
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}
                        whileHover={{ rotate: 10 }}
                      >
                        <category.icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <h3 className="mb-1 font-semibold text-white group-hover:text-purple-300 transition-colors">{category.name}</h3>
                      <p className="text-sm text-gray-400">{category.count} skills</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Skills Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
                <TrendingUp className="mr-1 h-3 w-3" />
                Trending Now
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Most In-Demand Skills
              </h2>
              <p className="mb-8 text-gray-400">
                Stay ahead of the curve with the most sought-after skills in our marketplace
              </p>
              
              <div className="space-y-4">
                {trendingSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-semibold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-white group-hover:text-purple-300 transition-colors">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">{(skill.searches / 1000).toFixed(1)}k searches</span>
                      <Badge className="bg-green-500/20 text-green-400 border-0">
                        {skill.growth}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Featured Skills Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Featured Skills</h3>
              {featuredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <Link to={`/skill/${skill.id}`}>
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-purple-500/50 hover:bg-white/10 transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-semibold text-white flex-shrink-0">
                            {skill.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {skill.isPremium && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs px-2 py-0">
                                  <Sparkles className="mr-1 h-3 w-3" />
                                  Premium
                                </Badge>
                              )}
                              {skill.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-400" />
                              )}
                            </div>
                            <h4 className="font-semibold text-white truncate">{skill.title}</h4>
                            <div className="flex items-center gap-3 mt-2 text-sm">
                              <span className="text-gray-400">{skill.user}</span>
                              <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="h-4 w-4 fill-current" />
                                {skill.rating}
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-400">{skill.students} students</span>
                            </div>
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Workshops Section */}
      <section className="px-4 py-24 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                <Calendar className="mr-1 h-3 w-3" />
                Live Events
              </Badge>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Upcoming <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Workshops</span>
              </h2>
            </div>
            <Link to="/workshops">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                View All Workshops
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {upcomingWorkshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-green-500/50 hover:bg-white/10 transition-all h-full">
                  <CardContent className="p-6">
                    <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-0">
                      {workshop.category}
                    </Badge>
                    
                    <h3 className="mb-3 text-xl font-semibold text-white">{workshop.title}</h3>
                    <p className="mb-4 text-gray-400">by {workshop.instructor}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {workshop.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        {workshop.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        {workshop.attendees} attending
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {workshop.price > 0 ? (
                        <span className="text-lg font-bold text-purple-400">{workshop.price} Credits</span>
                      ) : (
                        <span className="text-lg font-bold text-green-400">Free</span>
                      )}
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30">
              <Heart className="mr-1 h-3 w-3" />
              Testimonials
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Loved by <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Students</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 italic">
                      "{testimonials[activeTestimonial].content}"
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-semibold text-white">
                        {testimonials[activeTestimonial].avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white">{testimonials[activeTestimonial].name}</div>
                        <div className="text-sm text-gray-400">
                          {testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].college}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Layers className="mr-1 h-3 w-3" />
              Platform Features
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Everything You Need to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Excel</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CreditCard, title: "Skill Credits System", description: "Earn credits by teaching, spend them on learning premium skills", color: "from-purple-500 to-pink-500" },
              { icon: Video, title: "Video Sessions", description: "Built-in video calls for seamless online learning sessions", color: "from-blue-500 to-cyan-500" },
              { icon: MessageSquare, title: "Real-time Chat", description: "Instant messaging with your swap partners and mentors", color: "from-green-500 to-emerald-500" },
              { icon: Calendar, title: "Smart Scheduling", description: "Easy calendar integration for session management", color: "from-orange-500 to-amber-500" },
              { icon: BarChart3, title: "Progress Tracking", description: "Monthly reports and learning analytics dashboard", color: "from-pink-500 to-rose-500" },
              { icon: Shield, title: "Verified Profiles", description: "College verification and trust badges for safety", color: "from-indigo-500 to-blue-500" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-purple-500/50 hover:bg-white/10 transition-all h-full">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient bg-[length:200%_auto]" />
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            
            {/* Floating shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 animate-float" />
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/10 animate-float" style={{ animationDelay: "2s" }} />
            
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring" }}
                className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl"
              >
                <Rocket className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Ready to Start Your Journey?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
                Join thousands of students exchanging skills every day. Your next learning opportunity is just a swap away.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="h-14 px-10 bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold text-lg transition-all hover:scale-105">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="h-14 px-10 border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-xl font-semibold text-lg backdrop-blur-xl transition-all hover:scale-105">
                    Browse Courses
                  </Button>
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-white/70">
                No credit card required • Free forever plan available
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Stats */}
      <section className="border-t border-white/10 bg-slate-950/50 px-4 py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">150+</div>
              <div className="text-gray-400">Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">25+</div>
              <div className="text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">500K+</div>
              <div className="text-gray-400">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">$2M+</div>
              <div className="text-gray-400">Credits Exchanged</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
