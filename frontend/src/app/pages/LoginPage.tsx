import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { 
  GraduationCap, 
  Github, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  Award,
  Lock,
  Mail,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: Zap, text: "Trade skills, earn credits", color: "text-teal-400" },
  { icon: Users, text: "Connect with 50K+ students", color: "text-cyan-400" },
  { icon: Award, text: "Verified skill certifications", color: "text-emerald-400" },
];

const testimonial = {
  quote: "SkillX helped me learn React in exchange for teaching UI design. Best platform ever!",
  author: "Sarah Chen",
  role: "CS Student, MIT",
  avatar: "SC",
  rating: 5,
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await login(formData.email, formData.password, rememberMe);
      console.log("Login successful, user:", user);
      toast.success("Welcome back to SkillX!", {
        description: "You've been successfully logged in.",
      });
      // Use navigate for SPA routing instead of hard redirect
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Please check your credentials and try again.";
      // Check if it's a network error
      if (error.message?.includes("Network Error") || error.code === "ERR_NETWORK") {
        toast.error("Connection failed", {
          description: "Cannot connect to server. Make sure the backend is running.",
        });
      } else {
        toast.error("Login failed", {
          description: errorMessage,
        });
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`, {
      description: "We're working on social login integration.",
    });
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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/25"
            >
              <GraduationCap className="h-7 w-7 text-white" />
            </motion.div>
            <span className="font-heading text-2xl font-bold tracking-tight">
              <span className="text-white">Skill</span>
              <span className="text-teal-400">X</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold font-heading text-white mb-2"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400"
            >
              Sign in to continue your skill exchange journey
            </motion.p>
          </div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("Google")}
              className="h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-heading font-medium"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("GitHub")}
              className="h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-heading font-medium"
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#050505] text-gray-500">or continue with email</span>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@university.edu"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 pl-11 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Password
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 pl-11 pr-11 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean | "indeterminate") => setRememberMe(checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 btn-primary font-heading font-semibold text-base relative overflow-hidden group"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Sign in
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-gray-400"
          >
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
            >
              Sign up for free
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Features (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(20, 184, 166, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-500/20 rounded-full blur-[60px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 max-w-lg"
        >
          {/* Main Heading */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-teal-400 font-medium">Join 50,000+ Students</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold font-heading text-white mb-4"
            >
              Swap skills,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                grow together
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-lg"
            >
              The world's first peer-to-peer skill exchange platform designed exclusively for students.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-semibold text-sm">
                {testimonial.avatar}
              </div>
              <div>
                <p className="text-white font-semibold">{testimonial.author}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
