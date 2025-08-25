"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logos/simple_logo_255.png";
import { Button } from "@/components/ui/button";
import { GlobalUIProvider } from "@/context/GlobalUIContext";
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
  { icon: Users, label: "Patients", href: "/dentist/patients-list" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: Receipt, label: "Payments", href: "/dentist/payments" },
  { icon: FileText, label: "Prescriptions", href: "/prescriptions" },
  { icon: Package, label: "Inventory", href: "/dentist/inventory" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: ClipboardList, label: "Tasks", href: "/tasks" },
  { icon: FolderOpen, label: "Documents", href: "/documents" },
  { icon: Settings, label: "Settings", href: "/settings" },
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
    <GlobalUIProvider>
      <div className="flex h-screen overflow-hidden bg-neutral-50">
        {/* Mobile Header */}
        <div className="md:hidden flex flex-row justify-between items-center p-2 bg-card border-b sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6">
              <Image
                alt="logo"
                src={Logo}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <h1 className="text-sm font-medium text-foreground/70">DentDz</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="h-7 w-7 text-muted-foreground/60 hover:text-neutral-100"
          >
            {mobileMenuOpen ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Menu className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {/* Sidebar - Desktop */}
        <aside
          className={`
          hidden md:flex flex-col bg-card border-r transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-12" : "w-52"}
        `}
        >
          {/* Logo and Toggle Section */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center p-1.5" : "justify-between p-2.5"
            } border-b py-3.5 mb-2`}
          >
            {!isCollapsed && (
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6">
                  <Image
                    alt="logo"
                    src={Logo}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-sm font-medium text-foreground/70">
                  DentDz
                </h1>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 text-muted-foreground/60 hover:text-foreground hover:bg-neutral-100"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={`h-3 w-3 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Navigation Links with Scroll */}
          <div className="flex-1 overflow-y-auto py-1.5">
            <ul className="space-y-2 px-1.5">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      passHref
                      className={`
                        flex items-center rounded-md text-xs font-normal transition-all
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground/60 hover:bg-neutral-100 hover:text-foreground"
                        }
                        ${isCollapsed ? "justify-center p-1.5" : "p-2 gap-2"}
                      `}
                      title={isCollapsed ? item.label : ""}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate text-xs">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer Section */}
          <div
            className={`border-t p-1.5 ${
              isCollapsed ? "flex justify-center" : ""
            }`}
          >
            <Button
              variant="outline"
              className={`
                gap-2 text-xs font-normal h-8 text-muted-foreground/60 hover:text-foreground
                ${isCollapsed ? "w-8 px-0" : "w-full justify-start"}
              `}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="h-3 w-3" />
              {!isCollapsed && <span className="text-xs">Logout</span>}
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
            <aside className="md:hidden fixed top-0 left-0 h-full w-56 bg-card border-r z-50 shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="flex items-center justify-between p-2.5 border-b">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6">
                    <Image
                      alt="logo"
                      src={Logo}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <h1 className="text-sm font-medium text-foreground/70">
                    DentDz
                  </h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-6 w-6 text-muted-foreground/60 hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="h-full overflow-y-auto py-2">
                <ul className="space-y-0.5 px-1.5">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;

                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          passHref
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-2 p-2 rounded-md text-xs font-normal transition-colors
                            ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground/60 hover:bg-neutral-100 hover:text-foreground"
                            }
                          `}
                        >
                          <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="text-xs">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-t p-1.5">
                <Button
                  variant="outline"
                  className="w-full gap-2 text-xs font-normal h-8 justify-start text-muted-foreground/60 hover:text-foreground"
                >
                  <LogOut className="h-3 w-3" />
                  <span className="text-xs">Logout</span>
                </Button>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background scrollbar-custom">
          {children}
        </main>
      </div>
    </GlobalUIProvider>
  );
}
