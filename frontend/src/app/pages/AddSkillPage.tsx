import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Badge } from "@/app/components/ui/badge";
import { 
  Plus, 
  X, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Tag,
  FileText,
  CheckCircle,
  Info,
  Zap,
  Star,
  Globe,
  Target,
  Briefcase,
  Loader2,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { skillsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

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
  { value: "cloud", label: "Cloud", icon: "☁️" },
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // For edit mode
  const { user, isAuthenticated } = useAuth();
  
  const [teachingOption, setTeachingOption] = useState<'exchange' | 'paid-only'>('exchange');
  const [projects, setProjects] = useState<{ title: string; url: string; description: string }[]>([
    { title: "", url: "", description: "" }
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "",
    description: "",
    fullDescription: "",
    mode: "online",
    duration: "60",
    maxStudents: "1",
    price: "",
    wantedSkillInReturn: "",
    language: "english",
    location: "",
  });

  const isEditMode = !!id;

  // Fetch skill data if editing
  useEffect(() => {
    if (isEditMode) {
      fetchSkillData();
    }
  }, [id]);

  const fetchSkillData = async () => {
    try {
      setLoading(true);
      const response = await skillsAPI.getById(id!);
      const skill = response.data.skill || response.data;
      
      setFormData({
        title: skill.title || "",
        category: skill.category || "",
        level: skill.expertise || skill.level || "",
        description: skill.description || "",
        fullDescription: skill.fullDescription || "",
        mode: skill.teachingMode || skill.mode || "online",
        duration: skill.sessionDuration?.toString() || skill.duration?.toString() || "60",
        maxStudents: skill.maxStudents?.toString() || "1",
        price: skill.price?.toString() || "",
        wantedSkillInReturn: skill.wantedSkillInReturn || "",
        language: skill.language || "english",
        location: skill.location || "",
      });
      
      setTeachingOption(skill.teachingOption || 'exchange');
      setTags(skill.tags || []);
      setProjects(skill.projects?.length > 0 ? skill.projects : [{ title: "", url: "", description: "" }]);
      setPrerequisites(skill.prerequisites?.length > 0 ? skill.prerequisites : [""]);
      setLearningOutcomes(skill.learningOutcomes?.length > 0 ? skill.learningOutcomes : [""]);
      setSelectedAvailability(skill.availability || []);
    } catch (err: any) {
      console.error("Error fetching skill:", err);
      toast.error("Failed to load skill data");
      navigate("/skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to add a skill");
      navigate("/login");
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a skill name");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.level) {
      toast.error("Please select an expertise level");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      setSubmitting(true);
      
      const skillData = {
        title: formData.title.trim(),
        category: formData.category,
        expertise: formData.level, // Backend expects 'expertise'
        level: formData.level, // Keep for compatibility
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        teachingMode: formData.mode, // Backend expects 'teachingMode'
        mode: formData.mode, // Keep for compatibility
        sessionDuration: parseInt(formData.duration),
        duration: parseInt(formData.duration), // Keep for compatibility
        maxStudents: parseInt(formData.maxStudents),
        teachingOption,
        price: teachingOption === 'paid-only' ? parseInt(formData.price) || 0 : 0,
        wantedSkillInReturn: teachingOption === 'exchange' ? formData.wantedSkillInReturn.trim() : '',
        language: formData.language,
        location: formData.location.trim(),
        tags: tags.filter(t => t.trim()),
        projects: projects.filter(p => p.title.trim()),
        prerequisites: prerequisites.filter(p => p.trim()),
        learningOutcomes: learningOutcomes.filter(o => o.trim()),
        availability: selectedAvailability,
        isDraft,
      };

      if (isEditMode) {
        await skillsAPI.update(id!, skillData);
        toast.success("Skill updated successfully! 🎉");
      } else {
        await skillsAPI.create(skillData);
        toast.success(isDraft 
          ? "Skill saved as draft! 📝" 
          : "Skill published successfully! 🎉", {
          description: isDraft 
            ? "You can edit and publish it later." 
            : "Your skill is now live on the marketplace.",
        });
      }
      
      navigate("/skills");
    } catch (err: any) {
      console.error("Error saving skill:", err);
      toast.error(err.response?.data?.message || "Failed to save skill");
    } finally {
      setSubmitting(false);
    }
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

  // Auth check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Sign in required</h2>
            <p className="text-gray-400 mb-4">
              You need to be logged in to add a skill.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-teal-500 text-white hover:bg-teal-600"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full filter blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[100px]" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
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
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25"
          >
            <BookOpen className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="mb-2 text-4xl font-bold text-white font-heading">
            {isEditMode ? "Edit Your Skill" : "Add Your Skill"}
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Share your expertise with the community and help others grow
          </p>
        </motion.div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Basic Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-teal-400" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Tell us about the skill you want to teach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skill Name */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Skill Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Advanced React Development, Guitar for Beginners"
                    required
                    value={formData.title}
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
                      value={formData.category}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
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
                    <Label htmlFor="level" className="text-gray-300">
                      Your Expertise Level <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      required
                      value={formData.level}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
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
                    Short Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief overview of what you'll teach (shown in skill cards)"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <Label htmlFor="fullDescription" className="text-gray-300">
                    Full Description
                  </Label>
                  <Textarea
                    id="fullDescription"
                    name="fullDescription"
                    placeholder="Detailed description: topics covered, teaching approach, what makes you qualified..."
                    rows={5}
                    value={formData.fullDescription}
                    onChange={handleChange}
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500">Minimum 100 characters recommended</p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">
                    Location (for offline sessions)
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
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
                          className="bg-teal-500/20 text-teal-300 border-teal-500/30 px-3 py-1"
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
                            ? "border-teal-500 bg-teal-500/20 text-white"
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
                      value={formData.duration}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
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
                      value={formData.maxStudents}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, maxStudents: value }))}
                    >
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
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
                    value={formData.language}
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
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
                {/* Teaching Option Selection */}
                <div className="space-y-4">
                  <Label className="text-white text-base">How would you like to teach this skill?</Label>
                  
                  {/* Exchange Option */}
                  <div 
                    onClick={() => setTeachingOption('exchange')}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      teachingOption === 'exchange' 
                        ? 'border-teal-500 bg-teal-500/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        teachingOption === 'exchange' ? 'border-teal-500' : 'border-gray-500'
                      }`}>
                        {teachingOption === 'exchange' && (
                          <div className="h-2 w-2 rounded-full bg-teal-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">Skill Exchange</span>
                          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                            <Zap className="mr-1 h-3 w-3" />
                            Recommended
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Teach this skill in exchange for learning another skill from the learner
                        </p>
                      </div>
                    </div>
                    
                    {teachingOption === 'exchange' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="wantedSkillInReturn" className="text-gray-300">
                            What skill would you like to learn in return?
                          </Label>
                          <Input
                            id="wantedSkillInReturn"
                            name="wantedSkillInReturn"
                            placeholder="e.g., Python, Guitar, Marketing, Video Editing..."
                            value={formData.wantedSkillInReturn}
                            onChange={handleChange}
                            className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                          />
                          <p className="text-xs text-gray-500">
                            This helps match you with learners who can teach what you want to learn
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Paid Only Option */}
                  <div 
                    onClick={() => setTeachingOption('paid-only')}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      teachingOption === 'paid-only' 
                        ? 'border-yellow-500 bg-yellow-500/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        teachingOption === 'paid-only' ? 'border-yellow-500' : 'border-gray-500'
                      }`}>
                        {teachingOption === 'paid-only' && (
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">Paid Teaching</span>
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Premium
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Teach this skill for a fixed price (no exchange required)
                        </p>
                      </div>
                    </div>
                    
                    {teachingOption === 'paid-only' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-gray-300">
                            Price per session (₹)
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
                            {[200, 500, 1000, 2000].map((price) => (
                              <Button
                                key={price}
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({ ...prev, price: price.toString() }));
                                }}
                                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                              >
                                ₹{price}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
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
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 h-14 text-lg font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isEditMode ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isEditMode ? "Update Skill" : "Publish Skill"}
                </>
              )}
            </Button>
            {!isEditMode && (
              <Button
                type="button"
                size="lg"
                variant="outline"
                disabled={submitting}
                onClick={(e) => handleSubmit(e as any, true)}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 h-14"
              >
                <FileText className="mr-2 h-5 w-5" />
                Save as Draft
              </Button>
            )}
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
