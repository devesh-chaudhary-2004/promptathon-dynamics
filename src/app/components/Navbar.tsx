import { Link, useLocation } from "react-router";
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
  Video,
  Zap,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Crown,
  Star,
  Palette,
  Code,
  Music,
  PenTool,
  Database,
  Rocket,
  Brain
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/app/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { useState } from "react";

const categories = [
  { name: "Development", icon: Code, color: "from-teal-500 to-cyan-500", count: "2.5K+" },
  { name: "Design", icon: Palette, color: "from-teal-400 to-emerald-500", count: "1.8K+" },
  { name: "Music", icon: Music, color: "from-cyan-500 to-teal-500", count: "950+" },
  { name: "Writing", icon: PenTool, color: "from-emerald-500 to-teal-500", count: "720+" },
  { name: "Data Science", icon: Database, color: "from-teal-600 to-cyan-500", count: "1.2K+" },
  { name: "AI & ML", icon: Brain, color: "from-cyan-600 to-teal-400", count: "890+" },
];

export function Navbar() {
  const location = useLocation();
  const isLoggedIn = false; // Set to false - user needs to login
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userCredits = 2450;
  const unreadMessages = 3;
  const notifications = 5;

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
          
          {/* Categories Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-white/10">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2 bg-slate-900/95 border border-white/10 rounded-xl">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={`/marketplace?category=${category.name.toLowerCase()}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/5 transition-colors"
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${category.color}`}>
                            <category.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{category.name}</p>
                            <p className="text-xs text-gray-400">{category.count} skills</p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                    <Link to="/marketplace" className="md:col-span-2">
                      <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10 mt-2">
                        <Search className="mr-2 h-4 w-4" />
                        Browse All Categories
                      </Button>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavLink to="/marketplace" icon={Search}>
            Marketplace
          </NavLink>
          <NavLink to="/courses" icon={BookOpen}>
            Courses
          </NavLink>
          <NavLink to="/workshops" icon={Video}>
            Workshops
          </NavLink>
          
          {isLoggedIn && (
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
          {isLoggedIn ? (
            <>
              {/* Credits Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30"
              >
                <Zap className="h-4 w-4 text-teal-400" />
                <span className="text-sm font-semibold font-heading text-white">{userCredits.toLocaleString()}</span>
              </motion.div>

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
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-heading font-semibold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 border-white/10 bg-slate-900/95 text-white backdrop-blur-xl" align="end">
                  <div className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-lg font-heading font-semibold">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">John Doe</p>
                        <div className="flex items-center gap-1">
                          <Crown className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">Pro User</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-white/5 p-2">
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">{userCredits.toLocaleString()} Credits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">4.8</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                    <Link to="/profile/1" className="flex items-center">
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
                  <DropdownMenuItem className="focus:bg-white/10 focus:text-red-400 text-red-400 cursor-pointer">
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
              <MobileNavLink to="/workshops" icon={Video} onClick={() => setMobileMenuOpen(false)}>
                Workshops
              </MobileNavLink>
              {isLoggedIn && (
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
              
              {/* Categories */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-3">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={`/marketplace?category=${category.name.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${category.color}`}>
                          <category.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-300">{category.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
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
