import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import {
  Award,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Zap,
  Star,
  BookOpen,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  Trophy,
  Flame,
  Crown,
  Gift,
  Sparkles,
  Play,
  Video,
  CalendarDays,
  Send,
  RefreshCw,
  ChevronRight,
  PieChart,
  Activity
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const mockUser = {
  name: "John Doe",
  avatar: "JD",
  level: "Pro User",
  credits: 2450,
  rating: 4.8,
  totalSwaps: 47,
  successRate: 98,
  joinDate: "Jan 2025",
  streak: 12,
  rank: 156,
  xp: 8450,
  nextLevelXp: 10000,
};

const mockStats = [
  { label: "Active Swaps", value: "5", icon: Users, color: "from-blue-500 to-cyan-500", change: "+2", trend: "up" },
  { label: "Skill Credits", value: mockUser.credits.toLocaleString(), icon: Zap, color: "from-purple-500 to-pink-500", change: "+450", trend: "up" },
  { label: "Total Hours", value: "124", icon: Clock, color: "from-green-500 to-emerald-500", change: "+18", trend: "up" },
  { label: "Avg Rating", value: mockUser.rating, icon: Star, color: "from-yellow-500 to-orange-500", change: "+0.2", trend: "up" },
];

const mockActiveSwaps = [
  {
    id: 1,
    user: "Sarah Chen",
    avatar: "SC",
    skill: "React Development",
    yourSkill: "UI/UX Design",
    status: "Accepted",
    nextSession: "Feb 2, 2026",
    time: "10:00 AM",
    progress: 60,
    totalSessions: 8,
    completedSessions: 5,
  },
  {
    id: 2,
    user: "Alex Kumar",
    avatar: "AK",
    skill: "Machine Learning",
    yourSkill: "Web Development",
    status: "Pending",
    nextSession: "Feb 5, 2026",
    time: "2:00 PM",
    progress: 0,
    totalSessions: 6,
    completedSessions: 0,
  },
  {
    id: 3,
    user: "Michael Zhang",
    avatar: "MZ",
    skill: "Data Structures",
    yourSkill: "System Design",
    status: "In Progress",
    nextSession: "Feb 1, 2026",
    time: "4:00 PM",
    progress: 80,
    totalSessions: 10,
    completedSessions: 8,
  },
];

const mockSwapRequests = [
  { id: 1, user: "Emma Wilson", avatar: "EW", skill: "Python Programming", theirSkill: "Graphic Design", time: "2h ago" },
  { id: 2, user: "David Park", avatar: "DP", skill: "Mobile Development", theirSkill: "Content Writing", time: "5h ago" },
];

const mockMessages = [
  { id: 1, user: "Sarah Chen", avatar: "SC", message: "Thanks for the session!", time: "2h ago", unread: true },
  { id: 2, user: "Alex Kumar", avatar: "AK", message: "Can we reschedule to Monday?", time: "5h ago", unread: true },
  { id: 3, user: "Michael Zhang", avatar: "MZ", message: "Great explanation on algorithms!", time: "1d ago", unread: false },
];

const monthlyProgress = [
  { month: "Sep", hours: 12, swaps: 4, credits: 180 },
  { month: "Oct", hours: 18, swaps: 6, credits: 320 },
  { month: "Nov", hours: 24, swaps: 8, credits: 450 },
  { month: "Dec", hours: 32, swaps: 12, credits: 580 },
  { month: "Jan", hours: 38, swaps: 15, credits: 720 },
];

const skillProgress = [
  { skill: "React Development", progress: 85, totalHours: 42, level: "Advanced" },
  { skill: "UI/UX Design", progress: 70, totalHours: 28, level: "Intermediate" },
  { skill: "Python", progress: 45, totalHours: 18, level: "Beginner" },
  { skill: "Data Analysis", progress: 30, totalHours: 12, level: "Beginner" },
];

const recentActivity = [
  { id: 1, type: "swap", text: "Completed session with Sarah Chen", time: "2h ago", icon: CheckCircle, color: "text-green-400" },
  { id: 2, type: "credit", text: "Earned 50 credits for teaching", time: "2h ago", icon: Zap, color: "text-purple-400" },
  { id: 3, type: "badge", text: "Unlocked 'Quick Learner' badge", time: "1d ago", icon: Award, color: "text-yellow-400" },
  { id: 4, type: "message", text: "New message from Alex Kumar", time: "5h ago", icon: MessageSquare, color: "text-blue-400" },
];

const upcomingSessions = [
  { id: 1, user: "Michael Zhang", skill: "Data Structures", date: "Today", time: "4:00 PM", isToday: true },
  { id: 2, user: "Sarah Chen", skill: "React Development", date: "Feb 2", time: "10:00 AM", isToday: false },
  { id: 3, user: "Alex Kumar", skill: "Machine Learning", date: "Feb 5", time: "2:00 PM", isToday: false },
];

const achievements = [
  { id: 1, name: "First Swap", icon: "🎯", unlocked: true },
  { id: 2, name: "10 Sessions", icon: "🔥", unlocked: true },
  { id: 3, name: "Top Rated", icon: "⭐", unlocked: true },
  { id: 4, name: "Mentor", icon: "👨‍🏫", unlocked: false },
  { id: 5, name: "Polyglot", icon: "🌐", unlocked: false },
];

export function DashboardPage() {
  const [activeReportTab, setActiveReportTab] = useState<"hours" | "credits" | "swaps">("hours");

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-purple-500/30">
                <AvatarImage src="" alt={mockUser.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xl text-white">
                  {mockUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">Welcome back, {mockUser.name}!</h1>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Crown className="mr-1 h-3 w-3" />
                    {mockUser.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-400" />
                    {mockUser.streak} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    Rank #{mockUser.rank}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    {mockUser.rating} rating
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Bell className="mr-2 h-4 w-4" />
                <span className="relative">
                  Notifications
                  <span className="absolute -top-2 -right-4 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">3</span>
                </span>
              </Button>
              <Link to="/profile/1">
                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Level Progress</span>
              <span className="text-sm text-gray-400">{mockUser.xp.toLocaleString()} / {mockUser.nextLevelXp.toLocaleString()} XP</span>
            </div>
            <Progress value={(mockUser.xp / mockUser.nextLevelXp) * 100} className="h-3" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-purple-400">{Math.round((mockUser.xp / mockUser.nextLevelXp) * 100)}% to next level</span>
              <span className="text-sm text-gray-500">{(mockUser.nextLevelXp - mockUser.xp).toLocaleString()} XP needed</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-purple-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                      <div className={`flex items-center gap-1 mt-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {stat.change} this month
                      </div>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Swap Requests */}
            {mockSwapRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <CardTitle className="text-white">Pending Swap Requests</CardTitle>
                      </div>
                      <Badge className="bg-orange-500">{mockSwapRequests.length} new</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockSwapRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                              {request.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{request.user}</p>
                            <p className="text-sm text-gray-400">
                              Wants to learn <span className="text-orange-400">{request.skill}</span> · Teaches <span className="text-green-400">{request.theirSkill}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{request.time}</span>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Active Swaps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Active Swaps</CardTitle>
                      <CardDescription className="text-gray-400">
                        Your ongoing skill exchanges
                      </CardDescription>
                    </div>
                    <Link to="/marketplace">
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        New Swap
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockActiveSwaps.map((swap) => (
                    <motion.div
                      key={swap.id}
                      whileHover={{ scale: 1.01 }}
                      className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-purple-500/50"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="" alt={swap.user} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              {swap.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{swap.user}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span className="text-purple-400">Learning: {swap.skill}</span>
                              <span>·</span>
                              <span className="text-green-400">Teaching: {swap.yourSkill}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            swap.status === "Accepted"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : swap.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }
                        >
                          {swap.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span>{swap.nextSession}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4 text-purple-400" />
                          <span>{swap.time}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress ({swap.completedSessions}/{swap.totalSessions} sessions)</span>
                          <span className="text-white font-semibold">{swap.progress}%</span>
                        </div>
                        <Progress value={swap.progress} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Video className="mr-2 h-4 w-4" />
                          Join Session
                        </Button>
                        <Link to="/messages">
                          <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                          <CalendarDays className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Progress Report */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        Monthly Progress Report
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Your learning statistics over the past 5 months
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {(["hours", "credits", "swaps"] as const).map((tab) => (
                        <Button
                          key={tab}
                          size="sm"
                          variant={activeReportTab === tab ? "default" : "ghost"}
                          onClick={() => setActiveReportTab(tab)}
                          className={activeReportTab === tab ? "bg-purple-500" : "text-gray-400 hover:text-white"}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-end justify-between gap-3">
                    {monthlyProgress.map((month, index) => {
                      const value = activeReportTab === "hours" ? month.hours : activeReportTab === "credits" ? month.credits / 10 : month.swaps;
                      const maxValue = activeReportTab === "hours" ? 40 : activeReportTab === "credits" ? 80 : 20;
                      return (
                        <motion.div
                          key={month.month}
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / maxValue) * 100}%` }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                          className="flex flex-1 flex-col items-center"
                        >
                          <div className="mb-2 text-sm font-semibold text-white">
                            {activeReportTab === "hours" ? `${month.hours}h` : activeReportTab === "credits" ? month.credits : month.swaps}
                          </div>
                          <div className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition-colors cursor-pointer" style={{ height: '100%' }} />
                          <div className="mt-2 text-sm text-gray-400">{month.month}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">124h</div>
                      <div className="text-sm text-gray-400">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">2,250</div>
                      <div className="text-sm text-gray-400">Credits Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">45</div>
                      <div className="text-sm text-gray-400">Total Swaps</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skill Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    Skill Progress
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Track your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillProgress.map((skill, index) => (
                    <motion.div
                      key={skill.skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{skill.skill}</span>
                          <Badge className={
                            skill.level === "Advanced" ? "bg-purple-500/20 text-purple-300" :
                            skill.level === "Intermediate" ? "bg-blue-500/20 text-blue-300" :
                            "bg-green-500/20 text-green-300"
                          }>
                            {skill.level}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-400">{skill.totalHours}h learned</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={skill.progress} className="h-2 flex-1" />
                        <span className="text-sm font-semibold text-white w-12 text-right">{skill.progress}%</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Upcoming Sessions</CardTitle>
                    <CalendarDays className="h-5 w-5 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg border transition-all ${
                        session.isToday
                          ? "border-green-500/30 bg-green-500/10"
                          : "border-white/10 bg-white/5 hover:border-purple-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${session.isToday ? "text-green-400" : "text-white"}`}>
                          {session.date}
                        </span>
                        <span className="text-sm text-gray-400">{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-[10px] text-white">
                            {session.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{session.user}</p>
                          <p className="text-xs text-gray-400 truncate">{session.skill}</p>
                        </div>
                        {session.isToday && (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 h-7 px-2">
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Skill Credits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-white/10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Skill Credits
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Earn by teaching, spend by learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 text-center">
                    <div className="relative inline-block">
                      <motion.div 
                        className="text-5xl font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                      >
                        {mockUser.credits.toLocaleString()}
                      </motion.div>
                      <Sparkles className="absolute -top-2 -right-6 h-6 w-6 text-yellow-400 animate-pulse" />
                    </div>
                    <p className="text-sm text-gray-300 mt-1">Available Credits</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-white">Earned this month</span>
                      </div>
                      <span className="font-semibold text-green-400">+450</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-white">Spent this month</span>
                      </div>
                      <span className="font-semibold text-red-400">-200</span>
                    </div>
                  </div>

                  <Button className="mt-4 w-full bg-white text-purple-600 hover:bg-gray-100">
                    View Transactions
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Messages Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Messages</CardTitle>
                    <Badge className="bg-purple-500">2 new</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockMessages.slice(0, 3).map((message) => (
                    <div
                      key={message.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-all hover:border-purple-500/50 ${
                        message.unread
                          ? "border-purple-500/30 bg-purple-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={message.user} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xs text-white">
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{message.user}</p>
                          <p className="text-xs text-gray-400">{message.time}</p>
                        </div>
                        {message.unread && (
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{message.message}</p>
                    </div>
                  ))}

                  <Link to="/messages">
                    <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View All Messages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className={`${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        whileHover={{ scale: 1.1 }}
                        className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all ${
                          achievement.unlocked
                            ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                            : "bg-white/5 border border-white/10 grayscale opacity-50"
                        }`}
                        title={achievement.name}
                      >
                        {achievement.icon}
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-3">
                    {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/add-skill">
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Add New Skill
                    </Button>
                  </Link>
                  <Link to="/marketplace">
                    <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Users className="mr-2 h-4 w-4" />
                      Find Skills to Learn
                    </Button>
                  </Link>
                  <Link to="/courses">
                    <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Courses
                    </Button>
                  </Link>
                  <Link to="/workshops">
                    <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Video className="mr-2 h-4 w-4" />
                      Upcoming Workshops
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
