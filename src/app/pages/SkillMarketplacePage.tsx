import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar } from "@/app/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { 
  Search, 
  SlidersHorizontal, 
  Star,
  MapPin,
  Clock,
  Sparkles,
  TrendingUp,
  CalendarIcon,
  Send,
  CheckCircle,
  Zap,
  RefreshCw,
  Heart,
  Share2,
  Filter,
  ArrowUpDown,
  Video,
  Users,
  Mail,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

const mockSkills = [
  {
    id: 1,
    title: "Advanced React & TypeScript Development",
    description: "Master modern React patterns, hooks, TypeScript integration, and state management with real-world projects.",
    user: "Sarah Chen",
    avatar: "SC",
    email: "sarah.chen@example.com",
    rating: 4.9,
    reviews: 127,
    level: "Advanced",
    mode: "Online",
    category: "Development",
    isPremium: true,
    price: 500,
    location: "San Francisco, CA",
    responseTime: "< 1 hour",
    trending: true,
    totalSwaps: 45,
    availableSlots: ["Mon 10AM", "Wed 2PM", "Fri 4PM"],
    skillsWanted: ["UI/UX Design", "Data Science", "Marketing"],
  },
  {
    id: 2,
    title: "UI/UX Design & Figma Mastery",
    description: "Learn design thinking, prototyping, user research, and advanced Figma techniques from industry expert.",
    user: "Alex Kumar",
    avatar: "AK",
    email: "alex.kumar@example.com",
    rating: 4.8,
    reviews: 98,
    level: "Intermediate",
    mode: "Hybrid",
    category: "Design",
    isPremium: false,
    price: 0,
    location: "New York, NY",
    responseTime: "< 2 hours",
    trending: false,
    totalSwaps: 32,
    availableSlots: ["Tue 11AM", "Thu 3PM", "Sat 10AM"],
    skillsWanted: ["React Development", "Python", "Data Analysis"],
  },
  {
    id: 3,
    title: "Data Structures & Algorithms Mastery",
    description: "Crack coding interviews with comprehensive DSA training. Covers all important patterns and problem-solving strategies.",
    user: "Michael Zhang",
    avatar: "MZ",
    email: "michael.zhang@example.com",
    rating: 5.0,
    reviews: 203,
    level: "Advanced",
    mode: "Online",
    category: "DSA",
    isPremium: true,
    price: 750,
    location: "Seattle, WA",
    responseTime: "< 30 min",
    trending: true,
    totalSwaps: 89,
    availableSlots: ["Mon 9AM", "Wed 9AM", "Fri 9AM", "Sun 2PM"],
    skillsWanted: ["System Design", "Cloud Computing", "DevOps"],
  },
  {
    id: 4,
    title: "Digital Marketing & SEO Fundamentals",
    description: "Complete guide to digital marketing, SEO optimization, content strategy, and social media marketing.",
    user: "Emily Rodriguez",
    avatar: "ER",
    email: "emily.rodriguez@example.com",
    rating: 4.7,
    reviews: 84,
    level: "Beginner",
    mode: "Online",
    category: "Marketing",
    isPremium: false,
    price: 0,
    location: "Austin, TX",
    responseTime: "< 3 hours",
    trending: false,
    totalSwaps: 21,
    availableSlots: ["Mon 2PM", "Thu 10AM"],
    skillsWanted: ["Web Development", "Graphic Design", "Video Editing"],
  },
  {
    id: 5,
    title: "Machine Learning with Python",
    description: "Hands-on ML course covering supervised/unsupervised learning, neural networks, and real-world applications.",
    user: "David Park",
    avatar: "DP",
    email: "david.park@example.com",
    rating: 4.9,
    reviews: 156,
    level: "Advanced",
    mode: "Online",
    category: "Science",
    isPremium: true,
    price: 800,
    location: "Boston, MA",
    responseTime: "< 1 hour",
    trending: true,
    totalSwaps: 67,
    availableSlots: ["Tue 4PM", "Thu 4PM", "Sat 11AM"],
    skillsWanted: ["Data Engineering", "MLOps", "Statistics"],
  },
  {
    id: 6,
    title: "Guitar for Beginners - Rock & Blues",
    description: "Learn guitar basics, chords, strumming patterns, and play your favorite rock and blues songs.",
    user: "James Wilson",
    avatar: "JW",
    email: "james.wilson@example.com",
    rating: 4.6,
    reviews: 72,
    level: "Beginner",
    mode: "Offline",
    category: "Music",
    isPremium: false,
    price: 0,
    location: "Los Angeles, CA",
    responseTime: "< 4 hours",
    trending: false,
    totalSwaps: 28,
    availableSlots: ["Sat 2PM", "Sun 10AM", "Sun 4PM"],
    skillsWanted: ["Piano", "Music Production", "Singing"],
  },
];

const categories = ["All", "Development", "Design", "DSA", "Marketing", "Science", "Music", "Art", "Writing"];
const modes = ["All Modes", "Online", "Offline", "Hybrid"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"];
const sortOptions = ["Most Relevant", "Highest Rated", "Most Reviews", "Newest", "Price: Low to High", "Price: High to Low"];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

const mySkills = [
  "Web Development", "JavaScript", "Node.js", "Python", "Data Analysis"
];

interface SwapRequestFormData {
  selectedDate: Date | undefined;
  selectedTime: string;
  message: string;
  skillToOffer: string;
  duration: string;
  sendEmailNotification: boolean;
}

export function SkillMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [savedSkills, setSavedSkills] = useState<number[]>([]);
  const [swapRequestSkill, setSwapRequestSkill] = useState<typeof mockSkills[0] | null>(null);
  const [swapRequestOpen, setSwapRequestOpen] = useState(false);
  const [swapFormData, setSwapFormData] = useState<SwapRequestFormData>({
    selectedDate: undefined,
    selectedTime: "",
    message: "",
    skillToOffer: "",
    duration: "60",
    sendEmailNotification: true,
  });
  const [requestSent, setRequestSent] = useState(false);

  const handleSaveSkill = (skillId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedSkills.includes(skillId)) {
      setSavedSkills(savedSkills.filter(id => id !== skillId));
      toast.success("Removed from saved skills");
    } else {
      setSavedSkills([...savedSkills, skillId]);
      toast.success("Saved to your list");
    }
  };

  const handleShareSkill = (skill: typeof mockSkills[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`Check out this skill: ${skill.title} on SkillSwap!`);
    toast.success("Link copied to clipboard!");
  };

  const handleSwapRequest = (skill: typeof mockSkills[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSwapRequestSkill(skill);
    setSwapRequestOpen(true);
    setRequestSent(false);
    setSwapFormData({
      selectedDate: undefined,
      selectedTime: "",
      message: "",
      skillToOffer: "",
      duration: "60",
      sendEmailNotification: true,
    });
  };

  const submitSwapRequest = () => {
    if (!swapFormData.selectedDate || !swapFormData.selectedTime || !swapFormData.skillToOffer) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Simulate sending request
    setRequestSent(true);
    toast.success("Swap request sent successfully!");
    
    // Simulate email notification
    if (swapFormData.sendEmailNotification) {
      console.log(`Email notification would be sent to ${swapRequestSkill?.email}`);
    }
  };

  const filteredSkills = mockSkills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Sparkles className="mr-1 h-3 w-3" />
                {mockSkills.length}+ Skills Available
              </Badge>
              <h1 className="mb-2 text-4xl font-bold text-white">
                Skill <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Marketplace</span>
              </h1>
              <p className="text-gray-400">Discover and exchange skills with talented peers</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  {mockSkills.filter(s => s.trending).length}
                </div>
                <div className="text-sm text-gray-400">Trending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  <Users className="h-5 w-5 text-blue-400" />
                  {mockSkills.reduce((a, s) => a + s.totalSwaps, 0)}
                </div>
                <div className="text-sm text-gray-400">Total Swaps</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for skills, technologies, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              variant="outline"
              className={`border-white/10 bg-white/5 text-white hover:bg-white/10 ${showFilters ? "bg-purple-500/20 border-purple-500/50" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-4"
              >
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Mode</label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="All Modes" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {modes.map((mode) => (
                        <SelectItem key={mode} value={mode.toLowerCase()}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Level</label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {levels.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase()}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Price Type</label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="free">Free Swaps Only</SelectItem>
                      <SelectItem value="premium">Premium Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Sort By</label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="Most Relevant" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {sortOptions.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center justify-between"
        >
          <p className="text-gray-400">
            Showing <span className="font-semibold text-white">{filteredSkills.length}</span> skills
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400">{filteredSkills.filter(s => s.trending).length} trending</span>
            </div>
            {savedSkills.length > 0 && (
              <Badge className="bg-pink-500/20 text-pink-300">
                <Heart className="mr-1 h-3 w-3 fill-current" />
                {savedSkills.length} saved
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/skill/${skill.id}`}>
                <Card className="group h-full border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:bg-white/10 overflow-hidden">
                  <CardContent className="p-6">
                    {/* Header Badges & Actions */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex flex-wrap gap-2">
                        {skill.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-pink-500">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Trending
                          </Badge>
                        )}
                        {skill.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 text-gray-400 hover:text-pink-400 hover:bg-pink-500/20 ${savedSkills.includes(skill.id) ? "text-pink-400" : ""}`}
                          onClick={(e) => handleSaveSkill(skill.id, e)}
                        >
                          <Heart className={`h-4 w-4 ${savedSkills.includes(skill.id) ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20"
                          onClick={(e) => handleShareSkill(skill, e)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-purple-400 line-clamp-2">
                      {skill.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 line-clamp-2 text-sm text-gray-400">{skill.description}</p>

                    {/* User Info */}
                    <div className="mb-4 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-sm text-white">
                          {skill.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{skill.user}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-white">{skill.rating}</span>
                          </div>
                          <span>({skill.reviews})</span>
                          <span>•</span>
                          <span>{skill.totalSwaps} swaps</span>
                        </div>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="mb-4 flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">Responds {skill.responseTime}</span>
                    </div>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs">
                        {skill.level}
                      </Badge>
                      <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-300 text-xs">
                        <Video className="mr-1 h-3 w-3" />
                        {skill.mode}
                      </Badge>
                      <Badge variant="outline" className="border-pink-500/50 bg-pink-500/10 text-pink-300 text-xs">
                        {skill.category}
                      </Badge>
                    </div>

                    {/* Location */}
                    <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {skill.location}
                    </div>

                    {/* Skills Wanted */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Looking for:</p>
                      <div className="flex flex-wrap gap-1">
                        {skill.skillsWanted.slice(0, 3).map(s => (
                          <Badge key={s} className="bg-white/5 text-gray-400 text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between">
                        {skill.isPremium ? (
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            <span className="text-lg font-bold text-white">
                              {skill.price}
                            </span>
                            <span className="text-sm text-gray-400">credits</span>
                          </div>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400 border-0">
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Free Swap
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          onClick={(e) => handleSwapRequest(skill, e)}
                        >
                          <Send className="mr-1 h-3 w-3" />
                          Request
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            Load More Skills
          </Button>
        </motion.div>
      </div>

      {/* Swap Request Dialog */}
      <Dialog open={swapRequestOpen} onOpenChange={setSwapRequestOpen}>
        <DialogContent className="border-white/10 bg-slate-900/95 text-white backdrop-blur-xl max-w-lg">
          {!requestSent ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-purple-400" />
                  Request Skill Swap
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Send a swap request to {swapRequestSkill?.user}
                </DialogDescription>
              </DialogHeader>

              {/* Skill Info */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                      {swapRequestSkill?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{swapRequestSkill?.title}</p>
                    <p className="text-sm text-gray-400">by {swapRequestSkill?.user}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 py-4">
                {/* Skill to Offer */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Skill you'll offer in exchange *</Label>
                  <Select value={swapFormData.skillToOffer} onValueChange={(v) => setSwapFormData({...swapFormData, skillToOffer: v})}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="Select your skill" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {mySkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {swapRequestSkill?.skillsWanted && (
                    <p className="text-xs text-gray-500">
                      They're looking for: {swapRequestSkill.skillsWanted.join(", ")}
                    </p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Preferred Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {swapFormData.selectedDate ? swapFormData.selectedDate.toLocaleDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-white/10 bg-slate-900" align="start">
                      <Calendar
                        mode="single"
                        selected={swapFormData.selectedDate}
                        onSelect={(date) => setSwapFormData({...swapFormData, selectedDate: date})}
                        disabled={(date) => date < new Date()}
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  {swapRequestSkill?.availableSlots && (
                    <p className="text-xs text-gray-500">
                      Available: {swapRequestSkill.availableSlots.join(", ")}
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Preferred Time *</Label>
                  <Select value={swapFormData.selectedTime} onValueChange={(v) => setSwapFormData({...swapFormData, selectedTime: v})}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Session Duration</Label>
                  <Select value={swapFormData.duration} onValueChange={(v) => setSwapFormData({...swapFormData, duration: v})}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Message (optional)</Label>
                  <Textarea
                    value={swapFormData.message}
                    onChange={(e) => setSwapFormData({...swapFormData, message: e.target.value})}
                    placeholder="Introduce yourself and explain what you'd like to learn..."
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 min-h-[80px]"
                  />
                </div>

                {/* Email Notification */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">
                    An email notification will be sent to {swapRequestSkill?.user}
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSwapRequestOpen(false)}
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitSwapRequest}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Request
                </Button>
              </DialogFooter>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mb-4 mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
              <p className="text-gray-400 mb-6">
                Your swap request has been sent to {swapRequestSkill?.user}. 
                They'll receive an email notification and you'll be notified once they respond.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setSwapRequestOpen(false)}
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Close
                </Button>
                <Link to="/messages">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Messages
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
