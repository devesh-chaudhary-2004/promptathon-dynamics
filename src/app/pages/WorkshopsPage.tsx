import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Video,
  Filter,
  CalendarDays,
  Sparkles,
  Trophy,
  Zap,
  Star,
  ArrowRight,
  Bell,
  CheckCircle,
  Globe,
  Laptop
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const categories = ["All", "Development", "Design", "AI & ML", "Data Science", "Career", "Soft Skills"];

const mockWorkshops = [
  {
    id: 1,
    title: "Build a Full-Stack App in 3 Hours",
    description: "Live coding session where we build a complete MERN stack application from scratch with authentication and deployment",
    instructor: "Sarah Chen",
    avatar: "SC",
    date: "2025-02-15",
    time: "10:00 AM - 1:00 PM",
    duration: "3 hours",
    attendees: 156,
    maxAttendees: 200,
    category: "Development",
    price: 500,
    isLive: false,
    isFeatured: true,
    tags: ["React", "Node.js", "MongoDB"],
    mode: "Online",
    level: "Intermediate",
  },
  {
    id: 2,
    title: "UI/UX Design Sprint",
    description: "Hands-on design workshop covering user research, wireframing, prototyping, and creating a complete design system",
    instructor: "Alex Kumar",
    avatar: "AK",
    date: "2025-02-18",
    time: "2:00 PM - 6:00 PM",
    duration: "4 hours",
    attendees: 89,
    maxAttendees: 100,
    category: "Design",
    price: 0,
    isLive: false,
    isFeatured: false,
    tags: ["Figma", "Design Thinking", "Prototyping"],
    mode: "Online",
    level: "Beginner",
  },
  {
    id: 3,
    title: "Machine Learning Bootcamp",
    description: "Intensive workshop on building and deploying ML models with Python, TensorFlow, and real-world datasets",
    instructor: "Dr. Emily Rodriguez",
    avatar: "ER",
    date: "2025-02-20",
    time: "9:00 AM - 5:00 PM",
    duration: "8 hours",
    attendees: 234,
    maxAttendees: 300,
    category: "AI & ML",
    price: 1000,
    isLive: true,
    isFeatured: true,
    tags: ["Python", "TensorFlow", "Deep Learning"],
    mode: "Hybrid",
    level: "Advanced",
  },
  {
    id: 4,
    title: "System Design Interview Prep",
    description: "Master system design concepts and practice designing scalable systems for tech interviews",
    instructor: "Michael Zhang",
    avatar: "MZ",
    date: "2025-02-22",
    time: "11:00 AM - 2:00 PM",
    duration: "3 hours",
    attendees: 178,
    maxAttendees: 200,
    category: "Career",
    price: 750,
    isLive: false,
    isFeatured: false,
    tags: ["System Design", "Interviews", "Architecture"],
    mode: "Online",
    level: "Advanced",
  },
  {
    id: 5,
    title: "Public Speaking for Tech",
    description: "Build confidence and learn techniques for presenting technical topics, demos, and conference talks",
    instructor: "Lisa Park",
    avatar: "LP",
    date: "2025-02-25",
    time: "4:00 PM - 6:00 PM",
    duration: "2 hours",
    attendees: 67,
    maxAttendees: 80,
    category: "Soft Skills",
    price: 300,
    isLive: false,
    isFeatured: false,
    tags: ["Communication", "Presentation", "Leadership"],
    mode: "Online",
    level: "Beginner",
  },
  {
    id: 6,
    title: "Data Engineering Pipeline Workshop",
    description: "Build production-grade data pipelines using Apache Spark, Airflow, and cloud services",
    instructor: "James Wilson",
    avatar: "JW",
    date: "2025-02-28",
    time: "10:00 AM - 4:00 PM",
    duration: "6 hours",
    attendees: 145,
    maxAttendees: 150,
    category: "Data Science",
    price: 800,
    isLive: false,
    isFeatured: true,
    tags: ["Apache Spark", "Airflow", "AWS"],
    mode: "Online",
    level: "Intermediate",
  },
];

const myRegistrations = [mockWorkshops[2]];

export function WorkshopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"upcoming" | "registered">("upcoming");

  const filteredWorkshops = mockWorkshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || workshop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredWorkshop = mockWorkshops.find(w => w.isLive) || mockWorkshops[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
              <Badge className="mb-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30">
                <Zap className="mr-1 h-3 w-3" />
                Live & Interactive
              </Badge>
              <h1 className="mb-2 text-4xl font-bold text-white">
                Skill <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Workshops</span>
              </h1>
              <p className="text-gray-400">Interactive live sessions with industry experts</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">25+</div>
                <div className="text-sm text-gray-400">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15K+</div>
                <div className="text-sm text-gray-400">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9</div>
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
              variant={activeTab === "upcoming" ? "default" : "ghost"}
              onClick={() => setActiveTab("upcoming")}
              className={activeTab === "upcoming" ? "bg-orange-500" : "text-gray-400 hover:text-white"}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Upcoming Workshops
            </Button>
            <Button
              variant={activeTab === "registered" ? "default" : "ghost"}
              onClick={() => setActiveTab("registered")}
              className={activeTab === "registered" ? "bg-orange-500" : "text-gray-400 hover:text-white"}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              My Registrations
              {myRegistrations.length > 0 && (
                <Badge className="ml-2 bg-orange-500/20">{myRegistrations.length}</Badge>
              )}
            </Button>
          </div>
        </motion.div>

        {activeTab === "upcoming" ? (
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
                    placeholder="Search workshops..."
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
                        ? "bg-gradient-to-r from-orange-500 to-red-500"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Live Now Banner */}
            {featuredWorkshop.isLive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Card className="border-red-500/50 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xl font-bold text-white">
                            {featuredWorkshop.avatar}
                          </div>
                          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 ring-2 ring-black">
                            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-red-500 text-white animate-pulse">
                              🔴 LIVE NOW
                            </Badge>
                            <Badge className="bg-white/10">{featuredWorkshop.attendees} watching</Badge>
                          </div>
                          <h3 className="text-xl font-bold text-white">{featuredWorkshop.title}</h3>
                          <p className="text-gray-300">with {featuredWorkshop.instructor}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1" />
                      
                      <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                        <Video className="mr-2 h-4 w-4" />
                        Join Live Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Featured Workshop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="border-white/10 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8">
                      <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Trophy className="mr-1 h-3 w-3" />
                        Featured Workshop
                      </Badge>
                      <h2 className="mb-4 text-2xl font-bold text-white">
                        {mockWorkshops[0].title}
                      </h2>
                      <p className="mb-4 text-gray-300">{mockWorkshops[0].description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mockWorkshops[0].tags.map(tag => (
                          <Badge key={tag} className="bg-white/10 text-gray-300">{tag}</Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-400" />
                          {formatDate(mockWorkshops[0].date)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-400" />
                          {mockWorkshops[0].time}
                        </span>
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-orange-400" />
                          {mockWorkshops[0].attendees}/{mockWorkshops[0].maxAttendees}
                        </span>
                        <span className="flex items-center gap-2">
                          <Laptop className="h-4 w-4 text-orange-400" />
                          {mockWorkshops[0].mode}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                          <Bell className="mr-2 h-4 w-4" />
                          Register Now
                        </Button>
                        <div className="text-white">
                          <span className="text-2xl font-bold">{mockWorkshops[0].price}</span>
                          <span className="text-gray-400 ml-1">Credits</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center min-h-[300px]">
                      <div className="text-center">
                        <div className="mb-4 text-6xl">🚀</div>
                        <p className="text-2xl font-bold text-white mb-2">
                          {formatDate(mockWorkshops[0].date)}
                        </p>
                        <p className="text-white/80">{mockWorkshops[0].time}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Workshop Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-orange-500/50 hover:bg-white/10 transition-all h-full overflow-hidden group">
                    {/* Date Banner */}
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-white/80" />
                        <span className="font-semibold text-white">{formatDate(workshop.date)}</span>
                      </div>
                      <Badge className={workshop.isLive ? "bg-red-500 animate-pulse" : "bg-white/20"}>
                        {workshop.isLive ? "🔴 LIVE" : workshop.mode}
                      </Badge>
                    </div>

                    <CardContent className="p-5">
                      <Badge className="mb-3 bg-orange-500/20 text-orange-300 border-0 text-xs">
                        {workshop.category}
                      </Badge>
                      
                      <h3 className="mb-2 font-semibold text-white group-hover:text-orange-300 transition-colors">
                        {workshop.title}
                      </h3>
                      
                      <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                        {workshop.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {workshop.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} className="bg-white/5 text-gray-400 text-xs">{tag}</Badge>
                        ))}
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-xs font-semibold text-white">
                          {workshop.avatar}
                        </div>
                        <span className="text-sm text-gray-300">{workshop.instructor}</span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {workshop.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {workshop.attendees}/{workshop.maxAttendees}
                        </span>
                      </div>

                      {/* Progress bar for spots */}
                      <div className="mb-4">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                            style={{ width: `${(workshop.attendees / workshop.maxAttendees) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {workshop.maxAttendees - workshop.attendees} spots remaining
                        </p>
                      </div>

                      {/* Price & Register */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        {workshop.price > 0 ? (
                          <div>
                            <span className="text-xl font-bold text-white">{workshop.price}</span>
                            <span className="text-gray-400 ml-1 text-sm">Credits</span>
                          </div>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400 border-0">
                            Free Workshop
                          </Badge>
                        )}
                        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                          Register
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* My Registrations Tab */
          <div className="space-y-6">
            {myRegistrations.length > 0 ? (
              myRegistrations.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Date Card */}
                        <div className="w-full md:w-32 text-center bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 flex-shrink-0">
                          <p className="text-white/80 text-sm uppercase">
                            {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                          <p className="text-white text-4xl font-bold">
                            {new Date(workshop.date).getDate()}
                          </p>
                          <p className="text-white/80 text-sm">
                            {new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-500/20 text-green-400">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Registered
                                </Badge>
                                {workshop.isLive && (
                                  <Badge className="bg-red-500 animate-pulse">🔴 LIVE</Badge>
                                )}
                              </div>
                              <h3 className="text-xl font-semibold text-white">{workshop.title}</h3>
                              <p className="text-sm text-gray-400 mt-1">by {workshop.instructor}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-orange-400" />
                              {workshop.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Laptop className="h-4 w-4 text-orange-400" />
                              {workshop.mode}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-orange-400" />
                              {workshop.attendees} attending
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {workshop.tags.map(tag => (
                              <Badge key={tag} className="bg-white/10 text-gray-300">{tag}</Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            {workshop.isLive ? (
                              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                                <Video className="mr-2 h-4 w-4" />
                                Join Live Session
                              </Button>
                            ) : (
                              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                                <Calendar className="mr-2 h-4 w-4" />
                                Add to Calendar
                              </Button>
                            )}
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                              View Details
                            </Button>
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
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20">
                    <CalendarDays className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">No registrations yet</h3>
                  <p className="mb-6 text-gray-400">
                    Browse and register for upcoming workshops
                  </p>
                  <Button 
                    onClick={() => setActiveTab("upcoming")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Browse Workshops
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Workshop Calendar Preview */}
        {activeTab === "upcoming" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Workshop Calendar</h3>
                    <p className="text-gray-400">Plan your learning journey</p>
                  </div>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Full Calendar
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm text-gray-500 py-2">{day}</div>
                  ))}
                  {Array.from({ length: 28 }, (_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors
                        ${[4, 7, 9, 14, 17, 21].includes(i) 
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold' 
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }
                      `}
                    >
                      {i + 1}
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                    <span className="text-sm text-gray-400">Workshop Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                    <span className="text-sm text-gray-400">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
