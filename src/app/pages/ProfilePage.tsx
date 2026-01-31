import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Progress } from "@/app/components/ui/progress";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Star,
  MapPin,
  Calendar,
  Award,
  Users,
  Zap,
  BookOpen,
  Github,
  Linkedin,
  Globe,
  Mail,
  Edit,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usersAPI, skillsAPI } from "@/lib/api";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  city?: string;
  college?: string;
  bio?: string;
  credits: number;
  level?: string;
  rating: { average: number; count: number };
  totalSwaps?: number;
  joinDate?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  skills?: Array<{
    _id: string;
    title: string;
    category: string;
    expertise: string;
    price: number;
    isPremium: boolean;
    rating: { average: number; count: number };
    stats: { students: number };
  }>;
  learning?: Array<{
    _id: string;
    title: string;
    progress: number;
    teacher?: { name: string };
  }>;
  achievements?: Array<{
    _id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  reviews?: Array<{
    _id: string;
    reviewer: { _id: string; name: string; avatar?: string };
    rating: number;
    content: string;
    skill?: { title: string };
    createdAt: string;
  }>;
}

export function ProfilePage() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isOwnProfile = !id || id === authUser?._id;
  const userId = id || authUser?._id;

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [profileRes, skillsRes, reviewsRes] = await Promise.all([
        usersAPI.getById(userId).catch(() => ({ data: null })),
        skillsAPI.getByUser(userId).catch(() => ({ data: { skills: [] } })),
        usersAPI.getReviews(userId).catch(() => ({ data: { reviews: [] } })),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
      } else if (isOwnProfile && authUser) {
        // Use auth user data as fallback
        setProfile({
          _id: authUser._id,
          name: authUser.name,
          email: authUser.email,
          avatar: authUser.avatar,
          city: authUser.city,
          college: authUser.college,
          bio: authUser.bio || "No bio yet.",
          credits: authUser.credits || 1000,
          rating: authUser.rating || { average: 5.0, count: 0 },
          joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently joined",
        });
      }
      
      setSkills(skillsRes.data?.skills || []);
      setReviews(reviewsRes.data?.reviews || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // Default achievements
  const defaultAchievements = [
    { _id: "1", title: "New Member", description: "Welcome to SkillX!", icon: "🎯" },
    { _id: "2", title: "First Step", description: "Complete your profile", icon: "👋" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6 md:flex-row">
                <Skeleton className="h-32 w-32 rounded-full bg-white/10" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-64 bg-white/10" />
                  <Skeleton className="h-4 w-full max-w-lg bg-white/10" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-4 w-32 bg-white/10" />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 bg-white/10" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <Card className="border-red-500/30 bg-red-500/10 backdrop-blur-xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {error || "Profile Not Found"}
            </h2>
            <p className="text-gray-400 mb-6">
              {error || "The profile you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchProfileData} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Link to="/">
                <Button>Go Home</Button>
              </Link>
            </div>
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
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-6 md:flex-row">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-4xl text-white">
                      {profile.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl font-bold font-heading text-white">{profile.name}</h1>
                      <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500">
                        <Award className="mr-1 h-4 w-4" />
                        {profile.level || "Member"}
                      </Badge>
                    </div>

                    <p className="mb-4 text-gray-300">{profile.bio || "No bio yet."}</p>

                    <div className="mb-4 grid gap-2 text-sm text-gray-400 md:grid-cols-2">
                      {profile.city && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-teal-400" />
                          {profile.city}
                        </div>
                      )}
                      {profile.college && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-teal-400" />
                          {profile.college}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-teal-400" />
                        Joined {profile.joinDate || "Recently"}
                      </div>
                      {isOwnProfile && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-teal-400" />
                          {profile.email}
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {profile.socialLinks && (
                      <div className="flex gap-2 flex-wrap">
                        {profile.socialLinks.github && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                            asChild
                          >
                            <a href={`https://github.com/${profile.socialLinks.github}`} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        {profile.socialLinks.linkedin && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                            asChild
                          >
                            <a href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="mr-2 h-4 w-4" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {profile.socialLinks.portfolio && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                            asChild
                          >
                            <a href={`https://${profile.socialLinks.portfolio}`} target="_blank" rel="noopener noreferrer">
                              <Globe className="mr-2 h-4 w-4" />
                              Portfolio
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Link to="/settings">
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/messages?user=${profile._id}`}>
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1 text-2xl font-bold text-white">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    {profile.rating?.average?.toFixed(1) || "5.0"}
                  </div>
                  <p className="text-sm text-gray-400">Rating ({profile.rating?.count || 0})</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-white">{profile.totalSwaps || 0}</div>
                  <p className="text-sm text-gray-400">Total Swaps</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-teal-400">{profile.credits?.toLocaleString() || 0}</div>
                  <p className="text-sm text-gray-400">Skill Credits</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-white">{skills.length}</div>
                  <p className="text-sm text-gray-400">Skills Teaching</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="skills" className="data-[state=active]:bg-teal-500">
              Teaching ({skills.length})
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-teal-500">
              Learning
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-teal-500">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-teal-500">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Teaching Tab */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/skills/${skill._id}`}>
                      <Card className="border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-teal-500/50 cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <h3 className="mb-1 text-lg font-semibold text-white">{skill.title}</h3>
                              <Badge variant="outline" className="border-teal-500/50 bg-teal-500/10 text-teal-300 capitalize">
                                {skill.expertise}
                              </Badge>
                            </div>
                            {skill.isPremium && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{skill.stats?.students || 0} students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-white">{skill.rating?.average?.toFixed(1) || "New"}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className="bg-white/10 capitalize">{skill.category}</Badge>
                              <span className="text-teal-400 font-semibold">
                                {skill.price > 0 ? `${skill.price} credits` : "Free"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    {isOwnProfile ? "You haven't added any skills yet." : "No skills to show."}
                  </p>
                  {isOwnProfile && (
                    <Link to="/add-skill">
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-500">
                        Add Your First Skill
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {isOwnProfile && skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: skills.length * 0.1 }}
                >
                  <Link to="/add-skill">
                    <Card className="flex h-full min-h-[200px] cursor-pointer items-center justify-center border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-xl transition-all hover:border-teal-500/50 hover:bg-white/10">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4 text-4xl text-teal-400">+</div>
                        <p className="font-semibold text-white">Add New Skill</p>
                        <p className="text-sm text-gray-400">Share your expertise</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )}
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {(profile.learning?.length || 0) > 0 ? (
                profile.learning?.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-white">{skill.title}</h3>
                        <p className="mb-4 text-sm text-gray-400">
                          Learning from {skill.teacher?.name || "TBA"}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{skill.progress || 0}%</span>
                          </div>
                          <Progress value={skill.progress || 0} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    {isOwnProfile ? "You're not learning any skills yet." : "No learning progress to show."}
                  </p>
                  {isOwnProfile && (
                    <Link to="/skills">
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-500">
                        Explore Skills to Learn
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {(profile.achievements || defaultAchievements).map((achievement, index) => (
                <motion.div
                  key={achievement._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-white/10 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl">
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{achievement.title}</h3>
                          <p className="text-sm text-gray-300">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.reviewer?.avatar} alt={review.reviewer?.name} />
                              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                                {review.reviewer?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-white">{review.reviewer?.name}</p>
                              <p className="text-sm text-gray-400">
                                {review.skill?.title && `${review.skill.title} • `}
                                {formatTimeAgo(review.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300">{review.content}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No reviews yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
