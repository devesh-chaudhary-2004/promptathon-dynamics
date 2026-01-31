import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { 
  Search, 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Filter,
  Trophy,
  Sparkles,
  CheckCircle,
  PlayCircle,
  Lock,
  Crown,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const categories = ["All", "Development", "Design", "Data Science", "Marketing", "Business", "AI & ML"];

const mockCourses = [
  {
    id: 1,
    title: "Complete React & Next.js Developer Course",
    description: "Master modern React patterns, hooks, TypeScript, and build production-ready apps with Next.js",
    instructor: "Sarah Chen",
    avatar: "SC",
    rating: 4.9,
    students: 2847,
    duration: "42 hours",
    lessons: 156,
    level: "Intermediate",
    category: "Development",
    price: 1500,
    originalPrice: 2500,
    isPremium: true,
    isBestseller: true,
    thumbnail: "/courses/react.jpg",
    topics: ["React Hooks", "Next.js 14", "TypeScript", "State Management", "Testing"],
    progress: 0,
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    description: "Learn design thinking, Figma, prototyping, and create stunning user experiences",
    instructor: "Alex Kumar",
    avatar: "AK",
    rating: 4.8,
    students: 1923,
    duration: "36 hours",
    lessons: 128,
    level: "Beginner",
    category: "Design",
    price: 0,
    originalPrice: 0,
    isPremium: false,
    isBestseller: false,
    thumbnail: "/courses/design.jpg",
    topics: ["Figma", "Design Systems", "Prototyping", "User Research"],
    progress: 0,
  },
  {
    id: 3,
    title: "Data Structures & Algorithms Complete Guide",
    description: "Crack coding interviews with comprehensive DSA training covering all important patterns",
    instructor: "Michael Zhang",
    avatar: "MZ",
    rating: 5.0,
    students: 4521,
    duration: "58 hours",
    lessons: 234,
    level: "Advanced",
    category: "Development",
    price: 2000,
    originalPrice: 3500,
    isPremium: true,
    isBestseller: true,
    thumbnail: "/courses/dsa.jpg",
    topics: ["Arrays", "Trees", "Graphs", "Dynamic Programming", "System Design"],
    progress: 0,
  },
  {
    id: 4,
    title: "Machine Learning & AI Fundamentals",
    description: "Learn ML concepts, Python, TensorFlow, and build real-world AI applications",
    instructor: "Dr. Emily Rodriguez",
    avatar: "ER",
    rating: 4.9,
    students: 3156,
    duration: "48 hours",
    lessons: 167,
    level: "Intermediate",
    category: "AI & ML",
    price: 1800,
    originalPrice: 2800,
    isPremium: true,
    isBestseller: false,
    thumbnail: "/courses/ml.jpg",
    topics: ["Python", "TensorFlow", "Neural Networks", "Computer Vision"],
    progress: 35,
  },
  {
    id: 5,
    title: "Digital Marketing Mastery",
    description: "Master SEO, social media marketing, content strategy, and growth hacking",
    instructor: "James Wilson",
    avatar: "JW",
    rating: 4.7,
    students: 1678,
    duration: "28 hours",
    lessons: 98,
    level: "Beginner",
    category: "Marketing",
    price: 800,
    originalPrice: 1200,
    isPremium: false,
    isBestseller: false,
    thumbnail: "/courses/marketing.jpg",
    topics: ["SEO", "Social Media", "Content Strategy", "Analytics"],
    progress: 0,
  },
  {
    id: 6,
    title: "Full Stack Web Development Bootcamp",
    description: "Build full-stack applications with Node.js, React, MongoDB, and deploy to cloud",
    instructor: "David Park",
    avatar: "DP",
    rating: 4.8,
    students: 5234,
    duration: "72 hours",
    lessons: 289,
    level: "Beginner",
    category: "Development",
    price: 2500,
    originalPrice: 4000,
    isPremium: true,
    isBestseller: true,
    thumbnail: "/courses/fullstack.jpg",
    topics: ["Node.js", "React", "MongoDB", "Express", "Deployment"],
    progress: 68,
  },
];

const myCourses = mockCourses.filter(c => c.progress > 0);

export function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | "my-courses">("all");

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
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
                <BookOpen className="mr-1 h-3 w-3" />
                Learn at Your Pace
              </Badge>
              <h1 className="mb-2 text-4xl font-bold text-white">
                Skill <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Courses</span>
              </h1>
              <p className="text-gray-400">Comprehensive courses created by top mentors</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">150+</div>
                <div className="text-sm text-gray-400">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.8</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 border-b border-white/10 pb-4">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className={activeTab === "all" ? "bg-purple-500" : "text-gray-400 hover:text-white"}
            >
              All Courses
            </Button>
            <Button
              variant={activeTab === "my-courses" ? "default" : "ghost"}
              onClick={() => setActiveTab("my-courses")}
              className={activeTab === "my-courses" ? "bg-purple-500" : "text-gray-400 hover:text-white"}
            >
              My Courses
              {myCourses.length > 0 && (
                <Badge className="ml-2 bg-purple-500/20">{myCourses.length}</Badge>
              )}
            </Button>
          </div>
        </motion.div>

        {activeTab === "all" ? (
          <>
            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 space-y-4"
            >
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Featured Course */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8">
                      <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Trophy className="mr-1 h-3 w-3" />
                        Featured Course
                      </Badge>
                      <h2 className="mb-4 text-2xl font-bold text-white">
                        {mockCourses[0].title}
                      </h2>
                      <p className="mb-4 text-gray-300">{mockCourses[0].description}</p>
                      
                      <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          {mockCourses[0].rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {mockCourses[0].students.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {mockCourses[0].duration}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Learning
                        </Button>
                        <div className="text-white">
                          <span className="text-2xl font-bold">{mockCourses[0].price}</span>
                          <span className="text-gray-400 ml-1">Credits</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center min-h-[250px]">
                      <div className="text-center">
                        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
                          <Play className="h-10 w-10 text-white ml-1" />
                        </div>
                        <p className="text-white/80">Preview Course</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/courses/${course.id}`}>
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-purple-500/50 hover:bg-white/10 transition-all h-full overflow-hidden group">
                      {/* Thumbnail */}
                      <div className="relative h-40 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white/50" />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {course.isBestseller && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs">
                              Bestseller
                            </Badge>
                          )}
                          {course.isPremium && (
                            <Badge className="bg-purple-500/80 text-xs">
                              <Crown className="mr-1 h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                            <Play className="h-6 w-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <Badge className="mb-3 bg-blue-500/20 text-blue-300 border-0 text-xs">
                          {course.category}
                        </Badge>
                        
                        <h3 className="mb-2 font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {course.title}
                        </h3>
                        
                        <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Instructor */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white">
                            {course.avatar}
                          </div>
                          <span className="text-sm text-gray-300">{course.instructor}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            {course.rating}
                          </span>
                          <span>{course.students.toLocaleString()} students</span>
                        </div>

                        {/* Duration & Lessons */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" />
                            {course.lessons} lessons
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          {course.price > 0 ? (
                            <div>
                              <span className="text-xl font-bold text-white">{course.price}</span>
                              <span className="text-gray-400 ml-1 text-sm">Credits</span>
                              {course.originalPrice > course.price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  {course.originalPrice}
                                </span>
                              )}
                            </div>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border-0">
                              Free Course
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                            {course.level}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* My Courses Tab */
          <div className="space-y-6">
            {myCourses.length > 0 ? (
              myCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-purple-500/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Thumbnail */}
                        <div className="w-full md:w-48 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-12 w-12 text-white/50" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge className="mb-2 bg-blue-500/20 text-blue-300 border-0 text-xs">
                                {course.category}
                              </Badge>
                              <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                              <p className="text-sm text-gray-400 mt-1">by {course.instructor}</p>
                            </div>
                            <Badge className="bg-purple-500/20 text-purple-300">
                              {course.progress}% Complete
                            </Badge>
                          </div>

                          {/* Progress */}
                          <div className="mb-4">
                            <Progress value={course.progress} className="h-2" />
                            <p className="text-sm text-gray-400 mt-2">
                              {Math.round(course.lessons * course.progress / 100)} of {course.lessons} lessons completed
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                              <Play className="mr-2 h-4 w-4" />
                              Continue Learning
                            </Button>
                            <span className="text-sm text-gray-400">
                              Last accessed 2 days ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20">
                    <BookOpen className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">No courses yet</h3>
                  <p className="mb-6 text-gray-400">
                    Start learning by enrolling in a course
                  </p>
                  <Button 
                    onClick={() => setActiveTab("all")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
