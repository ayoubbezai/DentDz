"use client";

import Image from "next/image";
import Logo from "@/assets/logos/simple_logo_255.png";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Receipt,
  FileText,
  Package,
  BarChart3,
  ClipboardList,
  FolderOpen,
  Settings,
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/overview" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: Receipt, label: "Billing & Payments", href: "/billing" },
  { icon: FileText, label: "Prescriptions", href: "/prescriptions" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: ClipboardList, label: "Tasks", href: "/tasks" },
  { icon: FolderOpen, label: "Documents", href: "/documents" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Users, label: "Staff Management", href: "/staff" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: Package, label: "Supplies", href: "/supplies" },
];

export default function NavBar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-collapse sidebar on medium screens
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile Header */}
      <div className="md:hidden flex flex-row justify-between items-center p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8">
            <Image
              alt="logo"
              src={Logo}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <h1 className="text-lg font-semibold text-primary-dark">DentDz</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          className="h-9 w-9"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`
        hidden md:flex flex-col bg-white border-r transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
      `}
      >
        {/* Logo and Toggle Section */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center p-3" : "justify-between p-4"
          } border-b`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8">
                <Image
                  alt="logo"
                  src={Logo}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h1 className="text-lg font-semibold text-primary-dark">
                DentDz
              </h1>
            </div>
          )}

          {isCollapsed && (
            <div className="h-8 w-8">
              <Image
                alt="logo"
                src={Logo}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Navigation Links with Scroll */}
        <div className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                      ${isCollapsed ? "justify-center p-2" : "p-2 gap-2"}
                    `}
                    title={isCollapsed ? item.label : ""}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer Section */}
        <div
          className={`border-t p-2 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <Button
            variant="outline"
            className={`
              gap-2 text-sm font-medium h-10
              ${isCollapsed ? "w-10 px-0" : "w-full justify-start"}
            `}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r z-50 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8">
                  <Image
                    alt="logo"
                    src={Logo}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-lg font-semibold text-primary-dark">
                  DentDz
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-full overflow-y-auto py-2">
              <ul className="space-y-1 px-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={index}>
                      <a
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors
                          ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t p-2">
              <Button
                variant="outline"
                className="w-full gap-2 text-sm font-medium h-10 justify-start"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
