import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Skeleton } from "@/app/components/ui/skeleton";
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
  Sparkles,
  Play,
  Video,
  CalendarDays,
  RefreshCw,
  ChevronRight,
  Activity,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardAPI, swapsAPI, messagesAPI } from "@/lib/api";

interface DashboardData {
  user: {
    name: string;
    avatar?: string;
    level: string;
    credits: number;
    rating: number;
    totalSwaps: number;
    successRate: number;
    streak: number;
    rank: number;
    xp: number;
    nextLevelXp: number;
  };
  stats: {
    activeSwaps: number;
    totalHours: number;
    creditsEarned: number;
    creditsSpent: number;
  };
  activeSwaps: Array<{
    _id: string;
    provider: { _id: string; name: string; avatar?: string };
    requester: { _id: string; name: string; avatar?: string };
    skillOffered?: { title: string };
    skillWanted?: { title: string };
    status: string;
    schedule?: { date: string; time: string };
    progress: number;
    totalSessions: number;
    completedSessions: number;
  }>;
  swapRequests: Array<{
    _id: string;
    requester: { _id: string; name: string; avatar?: string };
    skillOffered?: { title: string };
    skillWanted?: { title: string };
    createdAt: string;
  }>;
  recentMessages: Array<{
    _id: string;
    user: { _id: string; name: string; avatar?: string };
    lastMessage: string;
    time: string;
    unread: boolean;
  }>;
  recentActivity: Array<{
    _id: string;
    type: string;
    text: string;
    time: string;
  }>;
  upcomingSessions: Array<{
    _id: string;
    user: { name: string };
    skill: string;
    date: string;
    time: string;
    isToday: boolean;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
  }>;
}

const activityIcons: Record<string, { icon: React.ElementType; color: string }> = {
  swap: { icon: CheckCircle, color: "text-green-400" },
  credit: { icon: Zap, color: "text-purple-400" },
  badge: { icon: Award, color: "text-yellow-400" },
  message: { icon: MessageSquare, color: "text-blue-400" },
  default: { icon: Activity, color: "text-gray-400" },
};

export function DashboardPage() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<"hours" | "credits" | "swaps">("hours");
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardRes, swapsRes, messagesRes] = await Promise.all([
        dashboardAPI.get().catch(() => ({ data: null })),
        swapsAPI.getAll({ status: 'pending' }).catch(() => ({ data: { swaps: [] } })),
        messagesAPI.getConversations({ limit: 3 }).catch(() => ({ data: { conversations: [] } })),
      ]);

      // Default data structure if API returns empty
      const defaultUser = {
        name: authUser?.name || "User",
        avatar: authUser?.avatar || "",
        level: "Member",
        credits: authUser?.credits || 1000,
        rating: authUser?.rating?.average || 5.0,
        totalSwaps: 0,
        successRate: 100,
        streak: 0,
        rank: 1,
        xp: 0,
        nextLevelXp: 1000,
      };

      setData({
        user: dashboardRes.data?.user || defaultUser,
        stats: dashboardRes.data?.stats || {
          activeSwaps: 0,
          totalHours: 0,
          creditsEarned: 0,
          creditsSpent: 0,
        },
        activeSwaps: dashboardRes.data?.activeSwaps || [],
        swapRequests: swapsRes.data?.swaps?.filter((s: any) => s.status === 'pending') || [],
        recentMessages: messagesRes.data?.conversations?.map((c: any) => ({
          _id: c._id,
          user: c.participants?.find((p: any) => p._id !== authUser?._id) || { name: "Unknown" },
          lastMessage: c.lastMessage?.content || "No messages yet",
          time: c.lastMessage?.createdAt ? formatTime(c.lastMessage.createdAt) : "",
          unread: c.unreadCount > 0,
        })) || [],
        recentActivity: dashboardRes.data?.recentActivity || [],
        upcomingSessions: dashboardRes.data?.upcomingSessions || [],
        achievements: dashboardRes.data?.achievements || [
          { id: "1", name: "First Swap", icon: "🎯", unlocked: false },
          { id: "2", name: "10 Sessions", icon: "🔥", unlocked: false },
          { id: "3", name: "Top Rated", icon: "⭐", unlocked: false },
          { id: "4", name: "Mentor", icon: "👨‍🏫", unlocked: false },
          { id: "5", name: "Polyglot", icon: "🌐", unlocked: false },
        ],
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSwap = async (swapId: string) => {
    try {
      await swapsAPI.accept(swapId);
      fetchDashboardData();
    } catch (err) {
      console.error("Error accepting swap:", err);
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      await swapsAPI.reject(swapId);
      fetchDashboardData();
    } catch (err) {
      console.error("Error rejecting swap:", err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const user = data?.user || {
    name: authUser?.name || "User",
    avatar: "",
    level: "Member",
    credits: 1000,
    rating: 5.0,
    totalSwaps: 0,
    successRate: 100,
    streak: 0,
    rank: 1,
    xp: 0,
    nextLevelXp: 1000,
  };

  const stats = [
    { label: "Active Swaps", value: data?.stats?.activeSwaps?.toString() || "0", icon: Users, color: "from-blue-500 to-cyan-500", change: "+0", trend: "up" },
    { label: "Skill Credits", value: user.credits?.toLocaleString() || "1000", icon: Zap, color: "from-purple-500 to-pink-500", change: `+${data?.stats?.creditsEarned || 0}`, trend: "up" },
    { label: "Total Hours", value: data?.stats?.totalHours?.toString() || "0", icon: Clock, color: "from-green-500 to-emerald-500", change: "+0", trend: "up" },
    { label: "Avg Rating", value: user.rating?.toFixed(1) || "5.0", icon: Star, color: "from-yellow-500 to-orange-500", change: "+0", trend: "up" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 bg-white/10" />
                <Skeleton className="h-4 w-32 bg-white/10" />
              </div>
            </div>
            <Skeleton className="h-16 w-full bg-white/10 rounded-xl" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl bg-white/10" />
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-xl bg-white/10" />
              <Skeleton className="h-96 rounded-xl bg-white/10" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-xl bg-white/10" />
              <Skeleton className="h-64 rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <Card className="border-red-500/30 bg-red-500/10 backdrop-blur-xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={fetchDashboardData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Avatar className="h-16 w-16 ring-4 ring-teal-500/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-xl text-white">
                  {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white font-heading">Welcome back, {user.name?.split(" ")[0]}!</h1>
                  <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500">
                    <Crown className="mr-1 h-3 w-3" />
                    {user.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-400" />
                    {user.streak} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    Rank #{user.rank}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    {user.rating?.toFixed(1)} rating
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Bell className="mr-2 h-4 w-4" />
                <span className="relative">
                  Notifications
                  {(data?.swapRequests?.length || 0) > 0 && (
                    <span className="absolute -top-2 -right-4 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
                      {data?.swapRequests?.length}
                    </span>
                  )}
                </span>
              </Button>
              <Link to={`/profile/${authUser?._id}`}>
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
              <span className="text-sm text-gray-400">{user.xp?.toLocaleString()} / {user.nextLevelXp?.toLocaleString()} XP</span>
            </div>
            <Progress value={(user.xp / user.nextLevelXp) * 100} className="h-3" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-teal-400">{Math.round((user.xp / user.nextLevelXp) * 100)}% to next level</span>
              <span className="text-sm text-gray-500">{(user.nextLevelXp - user.xp).toLocaleString()} XP needed</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-teal-500/30 transition-all">
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
            {(data?.swapRequests?.length || 0) > 0 && (
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
                      <Badge className="bg-orange-500">{data?.swapRequests?.length} new</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data?.swapRequests?.map((request) => (
                      <div
                        key={request._id}
                        className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.requester?.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                              {request.requester?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{request.requester?.name}</p>
                            <p className="text-sm text-gray-400">
                              Wants to learn <span className="text-orange-400">{request.skillWanted?.title || "Unknown"}</span>
                              {request.skillOffered && (
                                <> · Teaches <span className="text-green-400">{request.skillOffered.title}</span></>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{formatTime(request.createdAt)}</span>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleAcceptSwap(request._id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20" onClick={() => handleRejectSwap(request._id)}>
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
                    <Link to="/skills">
                      <Button size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-500">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        New Swap
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(data?.activeSwaps?.length || 0) > 0 ? (
                    data?.activeSwaps?.map((swap) => (
                      <motion.div
                        key={swap._id}
                        whileHover={{ scale: 1.01 }}
                        className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-teal-500/50"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={swap.provider?.avatar} alt={swap.provider?.name} />
                              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                                {swap.provider?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-white">{swap.provider?.name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                {swap.skillWanted && (
                                  <span className="text-teal-400">Learning: {swap.skillWanted.title}</span>
                                )}
                                {swap.skillOffered && (
                                  <>
                                    <span>·</span>
                                    <span className="text-green-400">Teaching: {swap.skillOffered.title}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={
                              swap.status === "accepted"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : swap.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            }
                          >
                            {swap.status}
                          </Badge>
                        </div>

                        {swap.schedule && (
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="h-4 w-4 text-teal-400" />
                              <span>{new Date(swap.schedule.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="h-4 w-4 text-teal-400" />
                              <span>{swap.schedule.time}</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress ({swap.completedSessions || 0}/{swap.totalSessions || 1} sessions)</span>
                            <span className="text-white font-semibold">{swap.progress || 0}%</span>
                          </div>
                          <Progress value={swap.progress || 0} className="h-2" />
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No active swaps yet</p>
                      <Link to="/skills">
                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500">
                          Find Skills to Learn
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link to="/add-skill">
                    <Button className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                      <Sparkles className="h-5 w-5" />
                      <span>Add Skill</span>
                    </Button>
                  </Link>
                  <Link to="/skills">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Users className="h-5 w-5" />
                      <span>Find Skills</span>
                    </Button>
                  </Link>
                  <Link to="/workshops">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Video className="h-5 w-5" />
                      <span>Workshops</span>
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <MessageSquare className="h-5 w-5" />
                      <span>Messages</span>
                    </Button>
                  </Link>
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
                    <CalendarDays className="h-5 w-5 text-teal-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(data?.upcomingSessions?.length || 0) > 0 ? (
                    data?.upcomingSessions?.map((session) => (
                      <div
                        key={session._id}
                        className={`p-3 rounded-lg border transition-all ${
                          session.isToday
                            ? "border-green-500/30 bg-green-500/10"
                            : "border-white/10 bg-white/5 hover:border-teal-500/30"
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
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-[10px] text-white">
                              {session.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{session.user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{session.skill}</p>
                          </div>
                          {session.isToday && (
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 h-7 px-2">
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-4">No upcoming sessions</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Skill Credits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-white/10 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl">
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
                        {user.credits?.toLocaleString()}
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
                      <span className="font-semibold text-green-400">+{data?.stats?.creditsEarned || 0}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-white">Spent this month</span>
                      </div>
                      <span className="font-semibold text-red-400">-{data?.stats?.creditsSpent || 0}</span>
                    </div>
                  </div>

                  <Button className="mt-4 w-full bg-white text-teal-600 hover:bg-gray-100">
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
                    {data?.recentMessages?.some(m => m.unread) && (
                      <Badge className="bg-teal-500">{data?.recentMessages?.filter(m => m.unread).length} new</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(data?.recentMessages?.length || 0) > 0 ? (
                    data?.recentMessages?.map((message) => (
                      <div
                        key={message._id}
                        className={`cursor-pointer rounded-lg border p-3 transition-all hover:border-teal-500/50 ${
                          message.unread
                            ? "border-teal-500/30 bg-teal-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.user?.avatar} alt={message.user?.name} />
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-xs text-white">
                              {message.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white">{message.user?.name}</p>
                            <p className="text-xs text-gray-400">{message.time}</p>
                          </div>
                          {message.unread && (
                            <div className="h-2 w-2 rounded-full bg-teal-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{message.lastMessage}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-4">No messages yet</p>
                  )}

                  <Link to="/messages">
                    <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View All Messages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
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
                    {data?.achievements?.map((achievement) => (
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
                    {data?.achievements?.filter(a => a.unlocked).length || 0}/{data?.achievements?.length || 0} unlocked
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
