import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Star,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "react-router";

const mockSkill = {
  id: 1,
  title: "Advanced React & TypeScript Development",
  description: "Master modern React patterns, hooks, TypeScript integration, and state management with real-world projects. This comprehensive course covers everything from basic concepts to advanced patterns used in production applications.",
  fullDescription: `This skill swap offers a deep dive into modern React development with TypeScript. We'll cover:

• Advanced React Hooks (useMemo, useCallback, custom hooks)
• TypeScript best practices and type safety
• State management with Context API and Redux Toolkit
• Performance optimization techniques
• Testing with Jest and React Testing Library
• Real-world project architecture

Each session is hands-on with live coding and project work. You'll build production-ready applications and learn industry best practices.`,
  user: {
    name: "Sarah Chen",
    avatar: "SC",
    rating: 4.9,
    reviews: 127,
    swaps: 89,
    responseTime: "< 1 hour",
    joinDate: "Jan 2024",
    bio: "Senior Frontend Developer at Tech Corp with 8+ years of experience. Passionate about teaching and helping others grow.",
    skills: ["React", "TypeScript", "Next.js", "Node.js"],
  },
  level: "Advanced",
  mode: "Online",
  category: "Development",
  isPremium: true,
  price: 500,
  location: "San Francisco, CA",
  trending: true,
  projects: [
    "E-commerce Platform - Built with React, TypeScript, Redux",
    "Real-time Chat Application - WebSocket integration",
    "Dashboard Analytics Tool - Data visualization with Recharts",
  ],
  reviews: [
    {
      id: 1,
      user: "John Smith",
      avatar: "JS",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent teacher! Sarah explains complex concepts clearly and provides practical examples. Highly recommend!",
    },
    {
      id: 2,
      user: "Emily Davis",
      avatar: "ED",
      rating: 5,
      date: "1 month ago",
      comment: "Best React course I've taken. The hands-on projects really helped solidify my understanding.",
    },
    {
      id: 3,
      user: "Mike Johnson",
      avatar: "MJ",
      rating: 4,
      date: "2 months ago",
      comment: "Great content and teaching style. Would love more advanced TypeScript patterns.",
    },
  ],
};

export function SkillDetailPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRequestSwap = () => {
    toast.success("Swap request sent! You'll receive a response within 24 hours.");
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {mockSkill.trending && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-pink-500">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                  {mockSkill.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                    {mockSkill.level}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-300">
                    {mockSkill.mode}
                  </Badge>
                  <Badge variant="outline" className="border-pink-500/50 bg-pink-500/10 text-pink-300">
                    {mockSkill.category}
                  </Badge>
                </div>

                <h1 className="mb-4 text-4xl font-bold text-white">{mockSkill.title}</h1>
                <p className="mb-4 text-lg text-gray-300">{mockSkill.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {mockSkill.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {mockSkill.user.swaps} successful swaps
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5">
                  <TabsTrigger value="about" className="data-[state=active]:bg-purple-500">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500">
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-500">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold text-white">What You'll Learn</h3>
                      <div className="whitespace-pre-line text-gray-300">{mockSkill.fullDescription}</div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="mt-6">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold text-white">Example Projects</h3>
                      <div className="space-y-3">
                        {mockSkill.projects.map((project, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
                          >
                            <CheckCircle className="mt-1 h-5 w-5 text-green-400" />
                            <p className="text-gray-300">{project}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="text-5xl font-bold text-white">{mockSkill.user.rating}</div>
                        <div>
                          <div className="mb-1 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(mockSkill.user.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-400">Based on {mockSkill.user.reviews} reviews</p>
                        </div>
                      </div>

                      <Separator className="my-6 bg-white/10" />

                      <div className="space-y-4">
                        {mockSkill.reviews.map((review) => (
                          <div key={review.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src="" alt={review.user} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                    {review.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-white">{review.user}</p>
                                  <p className="text-xs text-gray-400">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">Instructor</h3>
                  
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" alt={mockSkill.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xl text-white">
                        {mockSkill.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/profile/${mockSkill.id}`}>
                        <p className="font-semibold text-white hover:text-purple-400">{mockSkill.user.name}</p>
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white">{mockSkill.user.rating}</span>
                        <span>({mockSkill.user.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-300">{mockSkill.user.bio}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {mockSkill.user.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Response time: {mockSkill.user.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Joined {mockSkill.user.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>{mockSkill.user.swaps} successful swaps</span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-white/10" />

                  <Link to="/messages">
                    <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="mb-4 text-center">
                    {mockSkill.isPremium ? (
                      <>
                        <p className="mb-2 text-sm text-gray-300">Price per session</p>
                        <p className="text-4xl font-bold text-white">{mockSkill.price}</p>
                        <p className="text-sm text-gray-400">Skill Credits</p>
                      </>
                    ) : (
                      <>
                        <p className="text-4xl font-bold text-green-400">Free</p>
                        <p className="text-sm text-gray-400">Skill Swap</p>
                      </>
                    )}
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      >
                        Request Swap
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-white/10 bg-slate-900 text-white">
                      <DialogHeader>
                        <DialogTitle>Request Skill Swap</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Send a swap request to {mockSkill.user.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Your Message</Label>
                          <Textarea
                            placeholder="Introduce yourself and explain what you'd like to learn..."
                            className="border-white/10 bg-white/5 text-white"
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Skill You'll Teach</Label>
                          <Textarea
                            placeholder="What skill will you offer in exchange?"
                            className="border-white/10 bg-white/5 text-white"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Preferred Start Date</Label>
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border border-white/10 bg-white/5"
                          />
                        </div>
                        <Button
                          onClick={handleRequestSwap}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Send Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <p className="mt-4 text-center text-xs text-gray-400">
                    You'll receive a response within 24 hours
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
