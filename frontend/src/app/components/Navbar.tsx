import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { 
  GraduationCap, 
  Home, 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  Plus,
  Bell,
  User,
  BookOpen,
  Zap,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Crown,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadMessages = 3;
  const notifications = 5;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-400 shadow-lg shadow-teal-500/25"
          >
            <GraduationCap className="h-6 w-6 text-white" />
          </motion.div>
          <span className="font-heading text-xl font-bold tracking-tight">
            <span className="text-white">Skill</span>
            <span className="text-teal-400">X</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" icon={Home}>
            Home
          </NavLink>
          
          <NavLink to="/marketplace" icon={Search}>
            Marketplace
          </NavLink>
          <NavLink to="/courses" icon={BookOpen}>
            Courses
          </NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" icon={LayoutDashboard}>
                Dashboard
              </NavLink>
              <NavLink to="/messages" icon={MessageSquare}>
                Messages
                {unreadMessages > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full bg-teal-500 p-0 text-[10px] font-medium">
                    {unreadMessages}
                  </Badge>
                )}
              </NavLink>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* Add Skill Button */}
              <Link to="/add-skill" className="hidden sm:block">
                <Button className="btn-primary font-heading font-semibold">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Skill
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9 ring-2 ring-teal-500/50">
                      <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-heading font-semibold">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 border-white/10 bg-slate-900/95 text-white backdrop-blur-xl" align="end">
                  <div className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-lg font-heading font-semibold">
                          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{user?.name || 'User'}</p>
                        <div className="flex items-center gap-1">
                          <Crown className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">{user?.role === 'admin' ? 'Admin' : 'Member'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-white/5 p-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">4.8 Rating</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                    <Link to={`/profile/${user?._id || user?.id || 'me'}`} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                    <Link to="/messages" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                      {unreadMessages > 0 && (
                        <Badge className="ml-auto bg-teal-500 text-xs font-medium">{unreadMessages}</Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                    <Link to="/add-skill" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Skill
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="focus:bg-white/10 focus:text-red-400 text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-primary font-heading font-semibold">
                  Sign Up Free
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-slate-950/95"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <MobileNavLink to="/" icon={Home} onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/marketplace" icon={Search} onClick={() => setMobileMenuOpen(false)}>
                Marketplace
              </MobileNavLink>
              <MobileNavLink to="/courses" icon={BookOpen} onClick={() => setMobileMenuOpen(false)}>
                Courses
              </MobileNavLink>

              {isAuthenticated && (
                <>
                  <MobileNavLink to="/dashboard" icon={LayoutDashboard} onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/messages" icon={MessageSquare} onClick={() => setMobileMenuOpen(false)}>
                    Messages
                    {unreadMessages > 0 && (
                      <Badge className="ml-2 bg-teal-500 text-xs font-medium">{unreadMessages}</Badge>
                    )}
                  </MobileNavLink>
                  <MobileNavLink to="/add-skill" icon={Plus} onClick={() => setMobileMenuOpen(false)}>
                    Add Skill
                  </MobileNavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function NavLink({ to, icon: Icon, children }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold font-heading transition-colors ${
          isActive
            ? "bg-teal-500/20 text-teal-300"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
        {children}
      </motion.div>
    </Link>
  );
}

interface MobileNavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick: () => void;
}

function MobileNavLink({ to, icon: Icon, children, onClick }: MobileNavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} onClick={onClick}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold font-heading transition-colors ${
          isActive
            ? "bg-teal-500/20 text-teal-300"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="h-5 w-5" />
        {children}
      </motion.div>
    </Link>
  );
}
