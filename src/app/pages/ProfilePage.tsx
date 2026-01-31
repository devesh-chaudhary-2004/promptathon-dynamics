import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Progress } from "@/app/components/ui/progress";
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
} from "lucide-react";
import { Link } from "react-router";

const mockProfile = {
  name: "Sarah Chen",
  avatar: "SC",
  email: "sarah.chen@example.com",
  city: "San Francisco, CA",
  college: "Stanford University",
  joinDate: "January 2024",
  bio: "Senior Frontend Developer passionate about React, TypeScript, and modern web technologies. Love teaching and helping others grow in their development journey.",
  level: "Pro User",
  rating: 4.9,
  totalSwaps: 89,
  credits: 2450,
  socialLinks: {
    github: "sarahchen",
    linkedin: "sarah-chen",
    portfolio: "sarahchen.dev",
  },
  skills: [
    {
      id: 1,
      name: "React Development",
      level: "Expert",
      students: 45,
      rating: 4.9,
      isPremium: true,
    },
    {
      id: 2,
      name: "TypeScript",
      level: "Advanced",
      students: 32,
      rating: 4.8,
      isPremium: true,
    },
    {
      id: 3,
      name: "Next.js",
      level: "Advanced",
      students: 28,
      rating: 5.0,
      isPremium: false,
    },
  ],
  learning: [
    { name: "Machine Learning", progress: 60, teacher: "David Park" },
    { name: "System Design", progress: 80, teacher: "Michael Zhang" },
    { name: "DevOps", progress: 40, teacher: "Alex Kumar" },
  ],
  achievements: [
    { icon: Award, title: "Pro User", description: "Reached Pro status with 10+ successful swaps" },
    { icon: Star, title: "5-Star Mentor", description: "Maintained 4.9+ rating for 6 months" },
    { icon: Users, title: "Community Leader", description: "Helped 45+ students" },
    { icon: Zap, title: "Quick Responder", description: "Average response time < 1 hour" },
  ],
  reviews: [
    {
      id: 1,
      user: "John Smith",
      avatar: "JS",
      rating: 5,
      skill: "React Development",
      comment: "Excellent teacher! Sarah explains complex concepts clearly.",
      date: "2 weeks ago",
    },
    {
      id: 2,
      user: "Emily Davis",
      avatar: "ED",
      rating: 5,
      skill: "TypeScript",
      comment: "Best TypeScript course I've taken. Highly recommend!",
      date: "1 month ago",
    },
  ],
};

export function ProfilePage() {
  const isOwnProfile = true; // This would be determined by comparing with logged-in user

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
                    <AvatarImage src="" alt={mockProfile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-4xl text-white">
                      {mockProfile.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-white">{mockProfile.name}</h1>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Award className="mr-1 h-4 w-4" />
                        {mockProfile.level}
                      </Badge>
                    </div>

                    <p className="mb-4 text-gray-300">{mockProfile.bio}</p>

                    <div className="mb-4 grid gap-2 text-sm text-gray-400 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {mockProfile.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {mockProfile.college}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Joined {mockProfile.joinDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {mockProfile.email}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2">
                      {mockProfile.socialLinks.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                          asChild
                        >
                          <a href={`https://github.com/${mockProfile.socialLinks.github}`} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {mockProfile.socialLinks.linkedin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                          asChild
                        >
                          <a href={`https://linkedin.com/in/${mockProfile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {mockProfile.socialLinks.portfolio && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                          asChild
                        >
                          <a href={`https://${mockProfile.socialLinks.portfolio}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="mr-2 h-4 w-4" />
                            Portfolio
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Link to="/messages">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1 text-2xl font-bold text-white">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    {mockProfile.rating}
                  </div>
                  <p className="text-sm text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-white">{mockProfile.totalSwaps}</div>
                  <p className="text-sm text-gray-400">Total Swaps</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-purple-400">{mockProfile.credits}</div>
                  <p className="text-sm text-gray-400">Skill Credits</p>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl font-bold text-white">{mockProfile.skills.length}</div>
                  <p className="text-sm text-gray-400">Skills Teaching</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="skills" className="data-[state=active]:bg-purple-500">
              Teaching
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-purple-500">
              Learning
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-500">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-500">
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* Teaching Tab */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProfile.skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-purple-500/50">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="mb-1 text-lg font-semibold text-white">{skill.name}</h3>
                          <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                            {skill.level}
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
                            <span>{skill.students} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-white">{skill.rating}</span>
                          </div>
                        </div>
                      </div>

                      <Link to={`/skill/${skill.id}`}>
                        <Button className="mt-4 w-full bg-purple-500 hover:bg-purple-600">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {isOwnProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mockProfile.skills.length * 0.1 }}
                >
                  <Link to="/add-skill">
                    <Card className="flex h-full min-h-[200px] cursor-pointer items-center justify-center border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:bg-white/10">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4 text-4xl text-purple-400">+</div>
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
              {mockProfile.learning.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-lg font-semibold text-white">{skill.name}</h3>
                      <p className="mb-4 text-sm text-gray-400">Learning from {skill.teacher}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{skill.progress}%</span>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {mockProfile.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-white/10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                          <achievement.icon className="h-6 w-6 text-white" />
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
              {mockProfile.reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="" alt={review.user} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              {review.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{review.user}</p>
                            <p className="text-sm text-gray-400">
                              {review.skill} • {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
