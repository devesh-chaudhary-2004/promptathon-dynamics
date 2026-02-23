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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar } from "@/app/components/ui/calendar";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Star,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { skillsAPI, swapsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Skill {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  level: string;
  mode: string;
  teachingOption: 'exchange' | 'paid-only';
  price: number;
  wantedSkillInReturn?: string;
  sessionDuration?: number;
  location?: string;
  trending?: boolean;
  isPremium?: boolean;
  projects?: string[];
  user: {
    _id: string;
    name: string;
    avatar?: string;
    rating: number | { average: number; count: number };
    reviewCount?: number;
    swapCount?: number;
    responseTime?: string;
    createdAt: string;
    bio?: string;
    skills?: string[];
  };
  reviews?: {
    _id: string;
    user: {
      name: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  createdAt: string;
}

interface UserSkill {
  _id: string;
  title: string;
  category: string;
}

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [skill, setSkill] = useState<Skill | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSkillToOffer, setSelectedSkillToOffer] = useState("");
  const [offeredSkillDescription, setOfferedSkillDescription] = useState("");
  const [requestType, setRequestType] = useState<'exchange' | 'paid'>('exchange');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkillDetail();
    if (isAuthenticated && user) {
      fetchUserSkills();
    }
  }, [id, isAuthenticated, user]);

  const fetchSkillDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await skillsAPI.getById(id);
      setSkill(response.data.data || response.data.skill || response.data);
    } catch (err: any) {
      console.error("Error fetching skill:", err);
      setError(err.response?.data?.message || "Failed to load skill details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const response = await skillsAPI.getByUser(user!._id);
      setUserSkills(response.data.skills || response.data || []);
    } catch (err) {
      console.error("Error fetching user skills:", err);
    }
  };

  const handleRequestSwap = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to request");
      navigate("/login");
      return;
    }

    if (!skill) return;

    try {
      setSubmitting(true);
      await swapsAPI.create({
        skillId: skill._id,
        type: requestType,
        offeredSkill: requestType === 'exchange' && selectedSkillToOffer ? selectedSkillToOffer : undefined,
        offeredSkillDescription: requestType === 'exchange' && !selectedSkillToOffer ? offeredSkillDescription : undefined,
        amount: requestType === 'paid' ? skill.price : undefined,
        message: requestMessage,
        proposedSchedule: date ? { date: date.toISOString(), time: '10:00', duration: skill.sessionDuration || 60 } : undefined,
      });
      toast.success(requestType === 'exchange' 
        ? "Exchange request sent! You'll receive a response soon." 
        : "Learning request sent! You'll receive a response soon."
      );
      setIsDialogOpen(false);
      setRequestMessage("");
      setSelectedSkillToOffer("");
      setOfferedSkillDescription("");
    } catch (err: any) {
      console.error("Error sending request:", err);
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const isOwnSkill = skill && user && skill.user?._id === user._id;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 bg-white/10" />
                  <Skeleton className="h-6 w-20 bg-white/10" />
                </div>
                <Skeleton className="h-12 w-3/4 bg-white/10" />
                <Skeleton className="h-24 w-full bg-white/10" />
              </div>
              <Skeleton className="h-[400px] w-full bg-white/10" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full bg-white/10" />
              <Skeleton className="h-[200px] w-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !skill || !skill.user) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="rounded-full bg-red-500/20 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {error || "Skill not found"}
            </h2>
            <p className="text-gray-400 mb-6">
              The skill you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={fetchSkillDetail}
                className="bg-teal-500 text-white hover:bg-teal-600"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

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
                  <Badge variant="outline" className="border-teal-500/50 bg-teal-500/10 text-teal-300">
                    {skill.level}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-300">
                    {skill.mode}
                  </Badge>
                  <Badge variant="outline" className="border-pink-500/50 bg-pink-500/10 text-pink-300">
                    {skill.category}
                  </Badge>
                </div>

                <h1 className="mb-4 text-4xl font-bold text-white font-heading">{skill.title}</h1>
                <p className="mb-4 text-lg text-gray-300">{skill.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  {skill.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {skill.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {skill.user.swapCount || 0} successful swaps
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5">
                  <TabsTrigger value="about" className="data-[state=active]:bg-teal-500">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="data-[state=active]:bg-teal-500">
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-teal-500">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold text-white">What You'll Learn</h3>
                      <div className="whitespace-pre-line text-gray-300">
                        {skill.fullDescription || skill.description}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="mt-6">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold text-white">Example Projects</h3>
                      {skill.projects && skill.projects.length > 0 ? (
                        <div className="space-y-3">
                          {skill.projects.map((project, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
                            >
                              <CheckCircle className="mt-1 h-5 w-5 text-green-400" />
                              <p className="text-gray-300">{project}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-8">
                          No example projects listed yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="text-5xl font-bold text-white">
                          {(typeof skill.user.rating === 'number' ? skill.user.rating : skill.user.rating?.average)?.toFixed(1) || "N/A"}
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(typeof skill.user.rating === 'number' ? skill.user.rating : (skill.user.rating?.average || 0))
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-400">
                            Based on {skill.user.reviewCount || skill.user.rating?.count || 0} reviews
                          </p>
                        </div>
                      </div>

                      <Separator className="my-6 bg-white/10" />

                      {skill.reviews && skill.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {skill.reviews.map((review) => (
                            <div key={review._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                              <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                                      {getInitials(review.user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-white">{review.user.name}</p>
                                    <p className="text-xs text-gray-400">
                                      {formatRelativeDate(review.createdAt)}
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
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-8">
                          No reviews yet. Be the first to learn from this instructor!
                        </p>
                      )}
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
                      <AvatarImage src={skill.user.avatar} alt={skill.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-xl text-white">
                        {getInitials(skill.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/profile/${skill.user._id}`}>
                        <p className="font-semibold text-white hover:text-teal-400 transition-colors">
                          {skill.user.name}
                        </p>
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white">{(typeof skill.user.rating === 'number' ? skill.user.rating : skill.user.rating?.average)?.toFixed(1) || "N/A"}</span>
                        <span>({skill.user.reviewCount || skill.user.rating?.count || 0})</span>
                      </div>
                    </div>
                  </div>

                  {skill.user.bio && (
                    <p className="mb-4 text-sm text-gray-300">{skill.user.bio}</p>
                  )}

                  {skill.user.skills && skill.user.skills.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {skill.user.skills.map((skillName) => (
                        <Badge key={skillName} variant="outline" className="border-teal-500/50 bg-teal-500/10 text-teal-300">
                          {skillName}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-gray-400">
                    {skill.user.responseTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Response time: {skill.user.responseTime}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Joined {formatDate(skill.user.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>{skill.user.swapCount || 0} successful swaps</span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-white/10" />

                  {!isOwnSkill && (
                    <Link to={`/messages?user=${skill.user._id}`}>
                      <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="mb-4 text-center">
                    {skill.isPremium ? (
                      <>
                        <p className="mb-2 text-sm text-gray-300">Price per session</p>
                        <p className="text-4xl font-bold text-white">{skill.price}</p>
                        <p className="text-sm text-gray-400">Skill Credits</p>
                      </>
                    ) : (
                      <>
                        <p className="text-4xl font-bold text-green-400">Free</p>
                        <p className="text-sm text-gray-400">Skill Swap</p>
                      </>
                    )}
                  </div>

                  {isOwnSkill ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-3">This is your skill</p>
                      <Link to={`/edit-skill/${skill._id}`}>
                        <Button className="w-full bg-white/10 text-white hover:bg-white/20">
                          Edit Skill
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
                        >
                          Request to Learn
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-white/10 bg-[#0a0a0a] text-white max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Request to Learn: {skill.title}</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Choose how you'd like to learn from {skill.user.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Request Type Selection */}
                          <div className="space-y-3">
                            <Label className="text-white">How would you like to learn?</Label>
                            
                            {/* Exchange Option - Only show if skill allows exchange */}
                            {skill.teachingOption === 'exchange' && (
                              <div 
                                onClick={() => setRequestType('exchange')}
                                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                                  requestType === 'exchange' 
                                    ? 'border-teal-500 bg-teal-500/10' 
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                    requestType === 'exchange' ? 'border-teal-500' : 'border-gray-500'
                                  }`}>
                                    {requestType === 'exchange' && (
                                      <div className="h-2 w-2 rounded-full bg-teal-500" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-white">Exchange Skills</span>
                                    <p className="text-xs text-gray-400">
                                      Offer your skill in exchange for learning
                                      {skill.wantedSkillInReturn && (
                                        <span className="block text-teal-400 mt-1">
                                          They want to learn: {skill.wantedSkillInReturn}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Paid Option */}
                            <div 
                              onClick={() => setRequestType('paid')}
                              className={`cursor-pointer rounded-lg border p-3 transition-all ${
                                requestType === 'paid' 
                                  ? 'border-yellow-500 bg-yellow-500/10' 
                                  : 'border-white/10 bg-white/5 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  requestType === 'paid' ? 'border-yellow-500' : 'border-gray-500'
                                }`}>
                                  {requestType === 'paid' && (
                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-white">Pay to Learn</span>
                                    {skill.price > 0 && (
                                      <span className="text-yellow-400 font-semibold">₹{skill.price}</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400">Pay for the session without exchanging skills</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Exchange-specific fields */}
                          {requestType === 'exchange' && (
                            <div className="space-y-3 p-3 rounded-lg border border-teal-500/20 bg-teal-500/5">
                              {userSkills.length > 0 && (
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Select your skill to offer</Label>
                                  <Select
                                    value={selectedSkillToOffer}
                                    onValueChange={setSelectedSkillToOffer}
                                  >
                                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                      <SelectValue placeholder="Select a skill to offer" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#0a0a0a]">
                                      {userSkills.map((s) => (
                                        <SelectItem key={s._id} value={s._id}>
                                          {s.title} ({s.category})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              
                              <div className="space-y-2">
                                <Label className="text-gray-300">
                                  {userSkills.length > 0 ? "Or describe a skill you can teach" : "Describe what skill you can teach in exchange"}
                                </Label>
                                <Textarea
                                  placeholder="e.g., I can teach you Python basics, guitar chords, or video editing..."
                                  className="border-white/10 bg-white/5 text-white"
                                  rows={2}
                                  value={offeredSkillDescription}
                                  onChange={(e) => setOfferedSkillDescription(e.target.value)}
                                />
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Your Message</Label>
                            <Textarea
                              placeholder="Introduce yourself and explain what you'd like to learn..."
                              className="border-white/10 bg-white/5 text-white"
                              rows={3}
                              value={requestMessage}
                              onChange={(e) => setRequestMessage(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Preferred Start Date</Label>
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              className="rounded-md border border-white/10 bg-white/5"
                              disabled={(date) => date < new Date()}
                            />
                          </div>
                          
                          <Button
                            onClick={handleRequestSwap}
                            disabled={submitting || (requestType === 'exchange' && !selectedSkillToOffer && !offeredSkillDescription.trim())}
                            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : requestType === 'exchange' ? (
                              "Send Exchange Request"
                            ) : (
                              `Send Request${skill.price > 0 ? ` (₹${skill.price})` : ''}`
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {!isOwnSkill && (
                    <p className="mt-4 text-center text-xs text-gray-400">
                      You'll receive a response within 24 hours
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
