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
      { path: "add-skill", Component: AddSkillPage },
      { path: "skill/:id", Component: SkillDetailPage },
      { path: "profile/:id", Component: ProfilePage },
      { path: "messages", Component: MessagesPage },
      { path: "courses", Component: CoursesPage },
      { path: "workshops", Component: WorkshopsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
