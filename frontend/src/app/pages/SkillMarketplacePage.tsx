import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar } from "@/app/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Skeleton } from "@/app/components/ui/skeleton";
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
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { 
  Search, 
  Star,
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
  Users,
  MessageSquare,
  AlertCircle,
  Crown,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { skillsAPI, swapsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  expertise: string;
  price: number;
  isPremium: boolean;
  teachingMode: string;
  rating: { average: number; count: number };
  stats: { students: number; swaps: number };
  user: {
    _id: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
    city?: string;
  };
  createdAt: string;
}

const categories = ["All", "development", "design", "dsa", "marketing", "music", "ai-ml", "cloud", "business", "languages", "science", "other"];
const modes = ["All Modes", "online", "offline", "hybrid"];
const levels = ["All Levels", "beginner", "intermediate", "advanced", "expert"];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

interface SwapRequestFormData {
  selectedDate: Date | undefined;
  selectedTime: string;
  message: string;
  duration: string;
}

function SkillCardSkeleton() {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-6 w-24 bg-white/10" />
          <Skeleton className="h-6 w-16 bg-white/10" />
        </div>
        <Skeleton className="h-7 w-full mb-2 bg-white/10" />
        <Skeleton className="h-4 w-full mb-1 bg-white/10" />
        <Skeleton className="h-4 w-3/4 mb-4 bg-white/10" />
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="h-3 w-20 bg-white/10" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 bg-white/10" />
          <Skeleton className="h-9 w-28 bg-white/10" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkillMarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: authUser } = useAuth();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const urlCategory = searchParams.get("category")?.toLowerCase() || "All";
  const [selectedCategory, setSelectedCategory] = useState(
    categories.includes(urlCategory) ? urlCategory : "All"
  );
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const [savedSkills, setSavedSkills] = useState<string[]>([]);
  const [swapRequestSkill, setSwapRequestSkill] = useState<Skill | null>(null);
  const [swapRequestOpen, setSwapRequestOpen] = useState(false);
  const [swapFormData, setSwapFormData] = useState<SwapRequestFormData>({
    selectedDate: undefined,
    selectedTime: "",
    message: "",
    duration: "60",
  });
  const [requestSent, setRequestSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory, selectedMode, selectedLevel, sortBy, page]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchSkills();
      } else {
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page,
        limit: 12,
        sortBy,
      };
      
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedMode !== "All Modes") params.mode = selectedMode;
      if (selectedLevel !== "All Levels") params.expertise = selectedLevel;
      
      const response = await skillsAPI.getAll(params);
      setSkills(response.data.skills || []);
      setTotalCount(response.data.total || 0);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkill = async (skillId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (savedSkills.includes(skillId)) {
        setSavedSkills(savedSkills.filter(id => id !== skillId));
        toast.success("Removed from saved skills");
      } else {
        await skillsAPI.save(skillId);
        setSavedSkills([...savedSkills, skillId]);
        toast.success("Saved to your list");
      }
    } catch (err) {
      toast.error("Failed to save skill");
    }
  };

  const handleShareSkill = (skill: Skill, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/skills/${skill._id}`);
    toast.success("Link copied to clipboard!");
  };

  const handleSwapRequest = (skill: Skill, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authUser) {
      toast.error("Please log in to request a swap");
      return;
    }
    
    if (skill.user._id === authUser._id) {
      toast.error("You can't swap with yourself");
      return;
    }
    
    setSwapRequestSkill(skill);
    setSwapRequestOpen(true);
    setRequestSent(false);
    setSwapFormData({
      selectedDate: undefined,
      selectedTime: "",
      message: "",
      duration: "60",
    });
  };

  const submitSwapRequest = async () => {
    if (!swapFormData.selectedDate || !swapFormData.selectedTime || !swapRequestSkill) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      await swapsAPI.create({
        provider: swapRequestSkill.user._id,
        skillWanted: swapRequestSkill._id,
        message: swapFormData.message || `I'd like to learn ${swapRequestSkill.title} from you.`,
        proposedSchedule: {
          date: swapFormData.selectedDate.toISOString(),
          time: swapFormData.selectedTime,
          duration: parseInt(swapFormData.duration),
        },
        creditAmount: swapRequestSkill.price,
      });
      
      setRequestSent(true);
      toast.success("Swap request sent successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send swap request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

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
              <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">
                <Sparkles className="mr-1 h-3 w-3" />
                {totalCount}+ Skills Available
              </Badge>
              <h1 className="mb-2 text-4xl font-bold font-heading text-white">
                Skill <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Marketplace</span>
              </h1>
              <p className="text-gray-400">Discover and exchange skills with talented peers</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                  {skills.filter(s => s.isPremium).length}
                </div>
                <div className="text-sm text-gray-400">Premium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  <Users className="h-5 w-5 text-cyan-400" />
                  {skills.reduce((a, s) => a + (s.stats?.swaps || 0), 0)}
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
              className={`border-white/10 bg-white/5 text-white hover:bg-white/10 ${showFilters ? "bg-teal-500/20 border-teal-500/50" : ""}`}
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
                onClick={() => handleCategoryChange(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10 capitalize"
                }
              >
                {category === "All" ? category : category.replace("-", " ")}
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
                  <Select value={selectedMode} onValueChange={setSelectedMode}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="All Modes" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {modes.map((mode) => (
                        <SelectItem key={mode} value={mode} className="capitalize">
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {levels.map((level) => (
                        <SelectItem key={level} value={level} className="capitalize">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedMode("All Modes");
                      setSelectedLevel("All Levels");
                      setSortBy("newest");
                      setSearchQuery("");
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchSkills} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(6)].map((_, i) => <SkillCardSkeleton key={i} />)
          ) : skills.length > 0 ? (
            skills.map((skill, index) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/skill/${skill._id}`}>
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-teal-500/50 hover:bg-white/10 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-white/10 text-white capitalize">
                          {skill.category.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {skill.isPremium && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                              <Crown className="mr-1 h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-teal-400 transition-colors line-clamp-2">
                        {skill.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                        {skill.description}
                      </p>

                      {/* User Info */}
                      <div className="mb-4 flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={skill.user?.avatar} alt={skill.user?.name} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-sm">
                            {skill.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white flex items-center gap-1">
                            {skill.user?.name}
                            {skill.user?.isVerified && (
                              <CheckCircle className="h-3 w-3 text-teal-400" />
                            )}
                          </p>
                          <p className="text-xs text-gray-400">{skill.user?.city || "Remote"}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mb-4 flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-white">{skill.rating?.average?.toFixed(1) || "New"}</span>
                          <span>({skill.rating?.count || 0})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{skill.stats?.students || 0}</span>
                        </div>
                        <Badge className="bg-white/10 text-xs capitalize">{skill.expertise}</Badge>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="text-lg font-bold text-white">
                          {skill.price > 0 ? (
                            <span className="flex items-center gap-1">
                              <Zap className="h-4 w-4 text-yellow-400" />
                              {skill.price} <span className="text-sm text-gray-400 font-normal">credits</span>
                            </span>
                          ) : (
                            <span className="text-teal-400">Free</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`h-8 w-8 text-gray-400 hover:text-white ${savedSkills.includes(skill._id) ? "text-red-400" : ""}`}
                            onClick={(e) => handleSaveSkill(skill._id, e)}
                          >
                            <Heart className={`h-4 w-4 ${savedSkills.includes(skill._id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400 hover:text-white"
                            onClick={(e) => handleShareSkill(skill, e)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                            onClick={(e) => handleSwapRequest(skill, e)}
                          >
                            Request
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : !loading && (
            <div className="col-span-3 text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No skills found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
                <Link to="/add-skill">
                  <Button className="bg-gradient-to-r from-teal-500 to-cyan-500">
                    Add Your Skill
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalCount > 12 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-gray-400">
              Page {page} of {Math.ceil(totalCount / 12)}
            </span>
            <Button
              variant="outline"
              disabled={page >= Math.ceil(totalCount / 12)}
              onClick={() => setPage(page + 1)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        )}

        {/* Swap Request Dialog */}
        <Dialog open={swapRequestOpen} onOpenChange={setSwapRequestOpen}>
          <DialogContent className="border-white/10 bg-slate-900 text-white max-w-md">
            {!requestSent ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-heading">Request Skill Swap</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send a swap request to {swapRequestSkill?.user?.name} for "{swapRequestSkill?.title}"
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
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
                          {swapFormData.selectedDate
                            ? swapFormData.selectedDate.toLocaleDateString()
                            : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-white/10 bg-slate-900">
                        <Calendar
                          mode="single"
                          selected={swapFormData.selectedDate}
                          onSelect={(date) => setSwapFormData({ ...swapFormData, selectedDate: date })}
                          disabled={(date) => date < new Date()}
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label className="text-gray-300">Preferred Time *</Label>
                    <Select
                      value={swapFormData.selectedTime}
                      onValueChange={(value) => setSwapFormData({ ...swapFormData, selectedTime: value })}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label className="text-gray-300">Session Duration</Label>
                    <Select
                      value={swapFormData.duration}
                      onValueChange={(value) => setSwapFormData({ ...swapFormData, duration: value })}
                    >
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
                      placeholder="Introduce yourself and explain what you'd like to learn..."
                      value={swapFormData.message}
                      onChange={(e) => setSwapFormData({ ...swapFormData, message: e.target.value })}
                      className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 min-h-[100px]"
                    />
                  </div>

                  {/* Credits Info */}
                  {swapRequestSkill && swapRequestSkill.price > 0 && (
                    <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30">
                      <div className="flex items-center gap-2 text-sm text-teal-300">
                        <Zap className="h-4 w-4" />
                        <span>This will cost <strong>{swapRequestSkill.price} credits</strong></span>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSwapRequestOpen(false)}
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitSwapRequest}
                    disabled={submitting}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Request
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Request Sent!</h3>
                <p className="text-gray-400 mb-6">
                  Your swap request has been sent to {swapRequestSkill?.user?.name}.
                  They'll be notified and can accept or propose a different time.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSwapRequestOpen(false)}
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Close
                  </Button>
                  <Link to="/messages">
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-500">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View Messages
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
