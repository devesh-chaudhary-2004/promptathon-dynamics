import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/app/components/layouts/RootLayout";
import { HomePage } from "@/app/pages/HomePage";
import { LoginPage } from "@/app/pages/LoginPage";
import { SignupPage } from "@/app/pages/SignupPage";
import { DashboardPage } from "@/app/pages/DashboardPage";
import { SkillMarketplacePage } from "@/app/pages/SkillMarketplacePage";
import { AddSkillPage } from "@/app/pages/AddSkillPage";
import { SkillDetailPage } from "@/app/pages/SkillDetailPage";
import { ProfilePage } from "@/app/pages/ProfilePage";
import { MessagesPage } from "@/app/pages/MessagesPage";
import { CoursesPage } from "@/app/pages/CoursesPage";
import { WorkshopsPage } from "@/app/pages/WorkshopsPage";
import { NotFoundPage } from "@/app/pages/NotFoundPage";

// Redirect component for /skills to /marketplace
function SkillsRedirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const search = searchParams.get('search');
  window.location.href = search ? `/marketplace?search=${encodeURIComponent(search)}` : '/marketplace';
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "marketplace", Component: SkillMarketplacePage },
      { path: "skills", Component: SkillsRedirect }, // Redirect /skills to /marketplace
      { path: "add-skill", Component: AddSkillPage },
      { path: "edit-skill/:id", Component: AddSkillPage }, // Edit skill uses same component
      { path: "skill/:id", Component: SkillDetailPage },
      { path: "profile/:id", Component: ProfilePage },
      { path: "messages", Component: MessagesPage },
      { path: "messages/:conversationId", Component: MessagesPage },
      { path: "courses", Component: CoursesPage },
      { path: "workshops", Component: WorkshopsPage },
      { path: "settings", Component: DashboardPage }, // Temporary - use dashboard for settings
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
