import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import SiteHeader from "@/components/site-header";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* LEFT SIDEBAR */}
        <AppSidebar />

        {/* MAIN AREA */}
        <div className="flex flex-col flex-1">
          {/* TOP NAVBAR */}
          <SiteHeader />

          {/* CONTENT AREA */}
          <main className="@container/main flex flex-col flex-1 gap-4 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
