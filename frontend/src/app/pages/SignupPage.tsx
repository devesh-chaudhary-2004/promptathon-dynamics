import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { 
  GraduationCap, 
  Github, 
  Code, 
  Upload, 
  Link as LinkIcon,
  User,
  Mail,
  Lock,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Plus,
  X,
  Globe,
  Briefcase,
  FileText,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const skillCategories = [
  "Development", "Design", "Data Science", "Marketing", 
  "Music", "Writing", "Business", "Languages", "Other"
];

export function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [skillsToTeach, setSkillsToTeach] = useState<string[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newLearnSkill, setNewLearnSkill] = useState("");
  const [otherLinks, setOtherLinks] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    college: "",
    year: "",
    github: "",
    leetcode: "",
    codeforces: "",
    linkedin: "",
    portfolio: "",
    behance: "",
    bio: "",
    preferredMode: "online",
    availability: [] as string[],
    agreeTerms: false,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < totalSteps) {
      // Validate step 1 required fields before proceeding
      if (step === 1) {
        if (!formData.name || !formData.email || !formData.password || !formData.city) {
          toast.error("Please fill in all required fields");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
      }
      setStep(step + 1);
    } else {
      // Final step - submit to API
      if (!formData.agreeTerms) {
        toast.error("Please agree to the terms and conditions");
        return;
      }
      
      setIsLoading(true);
      try {
        const user = await signup({
          // Required fields
          name: formData.name,
          email: formData.email,
          password: formData.password,
          city: formData.city,
          // Optional fields
          college: formData.college || undefined,
          year: formData.year || undefined,
          bio: formData.bio || undefined,
          github: formData.github || undefined,
          linkedin: formData.linkedin || undefined,
          portfolio: formData.portfolio || undefined,
          leetcode: formData.leetcode || undefined,
          codeforces: formData.codeforces || undefined,
          behance: formData.behance || undefined,
          otherLinks: otherLinks.filter(link => link.trim() !== ''),
          skillsToTeach: skillsToTeach,
          skillsToLearn: skillsToLearn,
        });
        
        console.log("Signup successful, user:", user);
        toast.success("Account created successfully! Please check your email to verify.", {
          description: "Welcome to SkillX! 🎉",
        });
        // Navigate immediately after successful signup
        window.location.href = "/dashboard";
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please try again.";
        toast.error(errorMessage);
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addTeachSkill = () => {
    if (newTeachSkill.trim() && !skillsToTeach.includes(newTeachSkill.trim())) {
      setSkillsToTeach([...skillsToTeach, newTeachSkill.trim()]);
      setNewTeachSkill("");
    }
  };

  const addLearnSkill = () => {
    if (newLearnSkill.trim() && !skillsToLearn.includes(newLearnSkill.trim())) {
      setSkillsToLearn([...skillsToLearn, newLearnSkill.trim()]);
      setNewLearnSkill("");
    }
  };

  const removeTeachSkill = (skill: string) => {
    setSkillsToTeach(skillsToTeach.filter(s => s !== skill));
  };

  const removeLearnSkill = (skill: string) => {
    setSkillsToLearn(skillsToLearn.filter(s => s !== skill));
  };

  const addOtherLink = () => {
    setOtherLinks([...otherLinks, ""]);
  };

  const updateOtherLink = (index: number, value: string) => {
    const newLinks = [...otherLinks];
    newLinks[index] = value;
    setOtherLinks(newLinks);
  };

  const removeOtherLink = (index: number) => {
    setOtherLinks(otherLinks.filter((_, i) => i !== index));
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full filter blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-[100px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25"
          >
            <GraduationCap className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="mb-2 text-4xl font-bold font-heading text-white">Join <span className="text-teal-400">SkillX</span></h1>
          <p className="text-gray-400">Start your learning journey today</p>
          
          {/* Progress indicator */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-400">Step {step} of {totalSteps}</span>
              <span className="text-teal-400">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              {["Basic Info", "Profile", "Skills"].map((label, i) => (
                <span
                  key={label}
                  className={`text-xs ${i + 1 <= step ? "text-teal-400" : "text-gray-500"}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {step === 1 && <><User className="h-5 w-5 text-teal-400" /> Basic Information</>}
              {step === 2 && <><Briefcase className="h-5 w-5 text-teal-400" /> Your Profile</>}
              {step === 3 && <><Sparkles className="h-5 w-5 text-teal-400" /> Skills & Interests</>}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === 1 && "Let's start with your basic details"}
              {step === 2 && "Tell us more about yourself"}
              {step === 3 && "What skills do you want to teach and learn?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@university.edu"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Use your college email for verification benefits</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">
                        Password <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">
                        Confirm Password <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">
                        City <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="New York"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="college" className="text-gray-300">College/University</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="college"
                          name="college"
                          type="text"
                          placeholder="MIT"
                          value={formData.college}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-gray-300">Year of Study</Label>
                    <Select onValueChange={(value: string) => setFormData(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="5">5th Year</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Profile Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-300">Short Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Developer Profiles */}
                  <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Code className="h-4 w-4 text-teal-400" />
                      Developer Profiles (Optional)
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="github" className="text-gray-300">
                          <Github className="mr-1 inline h-4 w-4" />
                          GitHub
                        </Label>
                        <Input
                          id="github"
                          name="github"
                          type="text"
                          placeholder="username"
                          value={formData.github}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leetcode" className="text-gray-300">
                          <Code className="mr-1 inline h-4 w-4" />
                          LeetCode
                        </Label>
                        <Input
                          id="leetcode"
                          name="leetcode"
                          type="text"
                          placeholder="username"
                          value={formData.leetcode}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codeforces" className="text-gray-300">Codeforces Handle</Label>
                      <Input
                        id="codeforces"
                        name="codeforces"
                        type="text"
                        placeholder="username"
                        value={formData.codeforces}
                        onChange={handleChange}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Professional Links */}
                  <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      Professional Links (Optional)
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-gray-300">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          type="text"
                          placeholder="linkedin.com/in/username"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolio" className="text-gray-300">Portfolio Website</Label>
                        <Input
                          id="portfolio"
                          name="portfolio"
                          type="text"
                          placeholder="yourportfolio.com"
                          value={formData.portfolio}
                          onChange={handleChange}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="behance" className="text-gray-300">Behance</Label>
                      <Input
                        id="behance"
                        name="behance"
                        type="text"
                        placeholder="behance.net/username"
                        value={formData.behance}
                        onChange={handleChange}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Other Links */}
                  <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-green-400" />
                        Other Links
                      </h3>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addOtherLink}
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    
                    {otherLinks.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="https://example.com"
                          value={link}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOtherLink(index, e.target.value)}
                          className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                        />
                        {otherLinks.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeOtherLink(index)}
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-4 rounded-lg border border-dashed border-white/20 bg-white/5 p-6">
                    <div className="text-center">
                      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/20">
                        <FileText className="h-7 w-7 text-teal-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-2">Upload Resume/CV</h3>
                      <p className="text-xs text-gray-400 mb-4">PDF, DOC, or DOCX (Max 5MB)</p>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="mx-auto max-w-xs border-white/10 bg-white/5 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-teal-500 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-teal-600"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Skills */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Skills to Teach */}
                  <div className="space-y-4 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Skills You Can Teach
                    </h3>
                    <p className="text-xs text-gray-400">What skills do you want to share with others?</p>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., React, Guitar, Photography"
                        value={newTeachSkill}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTeachSkill(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && (e.preventDefault(), addTeachSkill())}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                      />
                      <Button
                        type="button"
                        onClick={addTeachSkill}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {skillsToTeach.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skillsToTeach.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeTeachSkill(skill)}
                              className="ml-2 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills to Learn */}
                  <div className="space-y-4 rounded-lg border border-teal-500/30 bg-teal-500/5 p-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-400" />
                      Skills You Want to Learn
                    </h3>
                    <p className="text-xs text-gray-400">What do you want to learn from the community?</p>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Python, UI Design, Music Production"
                        value={newLearnSkill}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLearnSkill(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && (e.preventDefault(), addLearnSkill())}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                      />
                      <Button
                        type="button"
                        onClick={addLearnSkill}
                        className="bg-teal-500 hover:bg-teal-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {skillsToLearn.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skillsToLearn.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-teal-500/20 text-teal-300 border-teal-500/30 px-3 py-1"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeLearnSkill(skill)}
                              className="ml-2 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Preferred Mode */}
                  <div className="space-y-2">
                    <Label className="text-gray-300">Preferred Learning Mode</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "online", label: "Online", icon: "🌐" },
                        { value: "offline", label: "Offline", icon: "📍" },
                        { value: "hybrid", label: "Hybrid", icon: "🔄" },
                      ].map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, preferredMode: mode.value }))}
                          className={`rounded-lg border p-4 text-center transition-all ${
                            formData.preferredMode === mode.value
                              ? "border-teal-500 bg-teal-500/20 text-white"
                              : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{mode.icon}</span>
                          <span className="text-sm font-medium">{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked: boolean | "indeterminate") => setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                      I agree to the{" "}
                      <a href="#" className="text-teal-400 hover:text-teal-300">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-teal-400 hover:text-teal-300">Privacy Policy</a>
                      . I understand that my profile information will be visible to other users.
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className={`flex-1 bg-gradient-to-r from-teal-500 to-pink-500 text-white hover:from-teal-600 hover:to-pink-600 ${step === 1 ? "w-full" : ""}`}
                  size="lg"
                  disabled={step === 3 && !formData.agreeTerms}
                >
                  {step < totalSteps ? (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-teal-400 hover:text-teal-300">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: "🎓", label: "50K+ Students" },
            { icon: "🔄", label: "125K+ Swaps" },
            { icon: "⭐", label: "4.9 Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-gray-400">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
