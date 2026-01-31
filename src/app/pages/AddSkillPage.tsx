import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { 
  Plus, 
  X, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Calendar,
  DollarSign,
  Users,
  Video,
  MapPin,
  Tag,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  Info,
  Zap,
  Star,
  Globe,
  Target,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "react-router";

const categories = [
  { value: "development", label: "Development", icon: "💻" },
  { value: "design", label: "Art & Design", icon: "🎨" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "writing", label: "Writing", icon: "✍️" },
  { value: "science", label: "Science", icon: "🔬" },
  { value: "dsa", label: "DSA", icon: "📊" },
  { value: "deployment", label: "Deployment", icon: "🚀" },
  { value: "marketing", label: "Marketing", icon: "📈" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "languages", label: "Languages", icon: "🌐" },
  { value: "ai-ml", label: "AI & ML", icon: "🤖" },
  { value: "other", label: "Other", icon: "📦" },
];

const expertiseLevels = [
  { value: "beginner", label: "Beginner", description: "Basic understanding, learning stage" },
  { value: "intermediate", label: "Intermediate", description: "Good working knowledge" },
  { value: "advanced", label: "Advanced", description: "Deep expertise, can handle complex topics" },
  { value: "expert", label: "Expert", description: "Industry-level mastery" },
];

const availabilitySlots = [
  { id: "weekday-morning", label: "Weekday Mornings", time: "8 AM - 12 PM" },
  { id: "weekday-afternoon", label: "Weekday Afternoons", time: "12 PM - 5 PM" },
  { id: "weekday-evening", label: "Weekday Evenings", time: "5 PM - 10 PM" },
  { id: "weekend-morning", label: "Weekend Mornings", time: "8 AM - 12 PM" },
  { id: "weekend-afternoon", label: "Weekend Afternoons", time: "12 PM - 5 PM" },
  { id: "weekend-evening", label: "Weekend Evenings", time: "5 PM - 10 PM" },
];

const sessionDurations = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

export function AddSkillPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [projects, setProjects] = useState<{ title: string; url: string; description: string }[]>([
    { title: "", url: "", description: "" }
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""]);
  
  const [formData, setFormData] = useState({
    skillName: "",
    category: "",
    expertise: "",
    description: "",
    experience: "",
    mode: "online",
    duration: "60",
    maxStudents: "1",
    price: "",
    skillsWanted: "",
    language: "english",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Skill added successfully! 🎉", {
      description: "Your skill is now live on the marketplace.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Projects management
  const addProject = () => {
    setProjects([...projects, { title: "", url: "", description: "" }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  // Tags management
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Prerequisites management
  const addPrerequisite = () => {
    setPrerequisites([...prerequisites, ""]);
  };

  const updatePrerequisite = (index: number, value: string) => {
    const newPrereqs = [...prerequisites];
    newPrereqs[index] = value;
    setPrerequisites(newPrereqs);
  };

  const removePrerequisite = (index: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  // Learning outcomes management
  const addOutcome = () => {
    setLearningOutcomes([...learningOutcomes, ""]);
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes[index] = value;
    setLearningOutcomes(newOutcomes);
  };

  const removeOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  // Availability toggle
  const toggleAvailability = (slotId: string) => {
    setSelectedAvailability(prev =>
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-[100px]" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
          >
            <BookOpen className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="mb-2 text-4xl font-bold text-white">Add Your Skill</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Share your expertise with the community and help others grow
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-400" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Tell us about the skill you want to teach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skill Name */}
                <div className="space-y-2">
                  <Label htmlFor="skillName" className="text-gray-300">
                    Skill Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="skillName"
                    name="skillName"
                    placeholder="e.g., Advanced React Development, Guitar for Beginners"
                    required
                    value={formData.skillName}
                    onChange={handleChange}
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Category & Expertise */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300">
                      Category <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      required
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              {cat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise" className="text-gray-300">
                      Your Expertise Level <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      required
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, expertise: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        {expertiseLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-gray-400">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what you'll teach, topics covered, your teaching approach, and what makes you qualified..."
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500">Minimum 100 characters recommended</p>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-gray-300">
                    Your Experience
                  </Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Share your background, years of experience, relevant achievements, certifications..."
                    rows={3}
                    value={formData.experience}
                    onChange={handleChange}
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add relevant tags (e.g., JavaScript, Web Development)"
                      value={newTag}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Learning Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Help learners understand what they'll gain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prerequisites */}
                <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Info className="h-4 w-4 text-yellow-400" />
                      Prerequisites
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addPrerequisite}
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">What should learners know before starting?</p>
                  {prerequisites.map((prereq, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Basic HTML/CSS knowledge"
                        value={prereq}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePrerequisite(index, e.target.value)}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                      />
                      {prerequisites.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removePrerequisite(index)}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Learning Outcomes */}
                <div className="space-y-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Learning Outcomes
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addOutcome}
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">What will learners be able to do after?</p>
                  {learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Build responsive web applications"
                        value={outcome}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOutcome(index, e.target.value)}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                      />
                      {learningOutcomes.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeOutcome(index)}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-orange-400" />
                  Projects & Portfolio
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Showcase your work to build credibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Project {index + 1}</span>
                      {projects.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProject(index)}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Project Title"
                      value={project.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(index, "title", e.target.value)}
                      className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                    <Input
                      placeholder="Project URL (GitHub, live demo, etc.)"
                      value={project.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(index, "url", e.target.value)}
                      className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                    <Textarea
                      placeholder="Brief description of the project"
                      value={project.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateProject(index, "description", e.target.value)}
                      rows={2}
                      className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addProject}
                  variant="outline"
                  className="w-full border-dashed border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Project
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Session Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  Session Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure how your sessions will work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mode Selection */}
                <div className="space-y-3">
                  <Label className="text-gray-300">
                    Teaching Mode <span className="text-red-400">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "online", label: "Online", icon: Globe, description: "Video calls" },
                      { value: "offline", label: "Offline", icon: MapPin, description: "In-person" },
                      { value: "hybrid", label: "Hybrid", icon: Zap, description: "Both options" },
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mode: mode.value }))}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          formData.mode === mode.value
                            ? "border-purple-500 bg-purple-500/20 text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <mode.icon className="mx-auto mb-2 h-6 w-6" />
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-xs text-gray-500">{mode.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Max Students */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Session Duration
                    </Label>
                    <Select 
                      defaultValue="60"
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        {sessionDurations.map((duration) => (
                          <SelectItem key={duration.value} value={duration.value}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Max Students per Session
                    </Label>
                    <Select 
                      defaultValue="1"
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, maxStudents: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        <SelectItem value="1">1 (One-on-one)</SelectItem>
                        <SelectItem value="2">2 students</SelectItem>
                        <SelectItem value="3">3 students</SelectItem>
                        <SelectItem value="5">5 students</SelectItem>
                        <SelectItem value="10">10 students (Group)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Teaching Language</Label>
                  <Select 
                    defaultValue="english"
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Your Availability</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availabilitySlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => toggleAvailability(slot.id)}
                        className={`rounded-lg border p-3 text-left transition-all ${
                          selectedAvailability.includes(slot.id)
                            ? "border-green-500 bg-green-500/20 text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="font-medium text-sm">{slot.label}</div>
                        <div className="text-xs text-gray-500">{slot.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing & Exchange Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-400" />
                  Pricing & Exchange
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set your pricing or skill exchange preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Premium Toggle */}
                <div className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="premium" className="text-white">
                          Premium Skill
                        </Label>
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Sparkles className="mr-1 h-3 w-3" />
                          Premium
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">
                        Charge skill credits for your expertise
                      </p>
                    </div>
                    <Switch
                      id="premium"
                      checked={isPremium}
                      onCheckedChange={setIsPremium}
                    />
                  </div>

                  {isPremium && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-white/10"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-gray-300">
                          Price (Skill Credits per session)
                        </Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          placeholder="500"
                          value={formData.price}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                        />
                        <div className="flex gap-2 mt-2">
                          {[250, 500, 750, 1000].map((price) => (
                            <Button
                              key={price}
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setFormData(prev => ({ ...prev, price: price.toString() }))}
                              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              {price}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Skill Exchange */}
                <div className="space-y-2">
                  <Label htmlFor="skillsWanted" className="text-gray-300 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    Skills You'd Like in Exchange
                  </Label>
                  <Textarea
                    id="skillsWanted"
                    name="skillsWanted"
                    placeholder="List skills you're interested in learning as exchange (e.g., Python, Music Production, Marketing)"
                    rows={2}
                    value={formData.skillsWanted}
                    onChange={handleChange}
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500">
                    This helps match you with learners who have skills you want
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 h-14 text-lg font-semibold"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Publish Skill
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 h-14"
            >
              <FileText className="mr-2 h-5 w-5" />
              Save as Draft
            </Button>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4"
          >
            <h4 className="font-medium text-blue-300 flex items-center gap-2 mb-2">
              <Star className="h-4 w-4" />
              Tips for a Great Listing
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Write a detailed description explaining what learners will gain</li>
              <li>• Add relevant projects to showcase your expertise</li>
              <li>• Be specific about prerequisites and learning outcomes</li>
              <li>• Set realistic availability to ensure consistent sessions</li>
              <li>• Respond promptly to swap requests to build reputation</li>
            </ul>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
