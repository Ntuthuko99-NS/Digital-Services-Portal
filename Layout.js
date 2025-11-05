import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, FileText, Calendar, MapPin, MessageSquare,
  Bell, HelpCircle, User, Settings, LogOut, Menu, X,
  Users, Building2, BarChart3, Inbox
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// SA Flag colors
const saColors = {
  green: "#007749",
  gold: "#FFB81C",
  red: "#E03C31",
  blue: "#001489",
};

const roleNavigationItems = {
  citizen: [
    { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
    { title: "Services", url: createPageUrl("Services"), icon: FileText },
    { title: "My Applications", url: createPageUrl("MyApplications"), icon: FileText },
    { title: "Appointments", url: createPageUrl("Appointments"), icon: Calendar },
    { title: "Offices", url: createPageUrl("Offices"), icon: MapPin },
    { title: "Messages", url: createPageUrl("Messages"), icon: MessageSquare },
    { title: "Notifications", url: createPageUrl("Notifications"), icon: Bell },
    { title: "Help", url: createPageUrl("Help"), icon: HelpCircle },
  ],
  admin: [
    { title: "Admin Dashboard", url: createPageUrl("AdminDashboard"), icon: LayoutDashboard },
    { title: "Applications", url: createPageUrl("AdminApplications"), icon: FileText },
    { title: "Users", url: createPageUrl("AdminUsers"), icon: Users },
    { title: "Offices", url: createPageUrl("AdminOffices"), icon: Building2 },
    { title: "Messages", url: createPageUrl("AdminMessages"), icon: Inbox },
    { title: "Analytics", url: createPageUrl("Analytics"), icon: BarChart3 },
    { title: "Settings", url: createPageUrl("AdminSettings"), icon: Settings },
  ],
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUser();
    loadUnreadNotifications();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const loadUnreadNotifications = async () => {
    try {
      const user = await base44.auth.me();
      const notifications = await base44.entities.Notification.filter({ 
        user_email: user.email, 
        is_read: false 
      });
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAF9]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#007749] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const userRole = user?.role || 'citizen';
  const navigationItems = roleNavigationItems[userRole] || roleNavigationItems.citizen;

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --sa-green: ${saColors.green};
          --sa-gold: ${saColors.gold};
          --sa-red: ${saColors.red};
          --sa-blue: ${saColors.blue};
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-[#FAFAF9]">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007749] via-[#FFB81C] to-[#E03C31] flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">eGov SA</h2>
                <p className="text-xs text-gray-500">Digital Services Portal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                {userRole === 'admin' ? 'Administration' : 'Citizen Services'}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-[#007749]/10 hover:text-[#007749] transition-colors duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-[#007749] text-white hover:bg-[#007749] hover:text-white' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                          {item.title === "Notifications" && unreadCount > 0 && (
                            <Badge className="ml-auto bg-[#E03C31] text-white">{unreadCount}</Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2 mt-4">
                Account
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-gray-100 rounded-lg mb-1">
                      <Link to={createPageUrl("Profile")} className="flex items-center gap-3 px-3 py-2.5">
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-gray-100 rounded-lg mb-1">
                      <Link to={createPageUrl("Settings")} className="flex items-center gap-3 px-3 py-2.5">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007749] to-[#001489] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">eGov SA</h1>
              <div className="w-10"></div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
