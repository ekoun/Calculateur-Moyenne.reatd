import { Outlet, Link, useLocation } from "react-router";
import { Moon, Sun, Calculator, BookOpen, GraduationCap, History, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import logo from "../../imports/Group_135.svg";
import logoMC from "../../imports/Group 169.svg";

export function Root() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/", label: "ECUE", icon: Calculator },
    { path: "/ue", label: "UE", icon: BookOpen },
    { path: "/semestre", label: "Semestre", icon: GraduationCap },
    { path: "/historique", label: "Historique", icon: History },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header - Réorganisé */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
        <div className="h-full px-4 flex items-center justify-between relative">
          {/* Menu Hamburger - Complètement à gauche */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-sidebar-accent transition-colors -ml-2"
            aria-label="Menu"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo MC-REATD - Parfaitement centré */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoMC} alt="CM" className="h-10 w-10 flex-shrink-0" />
              <img src={logo} alt="REATD-UVCI" className="h-10 w-auto flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <aside className={`
        fixed top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col shadow-xl z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section - Desktop */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <img src={logoMC} alt="CM" className="h-12 w-12" />
              <img src={logo} alt="REATD" className="h-12 w-auto" />
            </div>
          </Link>
          <div className="mt-3 flex flex-col">
            <span className="text-2xl font-bold text-primary">CM - REATD</span>
            <span className="text-xs text-muted-foreground tracking-wide">Calculateur de Moyennes</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sidebar-accent transition-all duration-200"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5" />
                <span className="font-medium">Mode Clair</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span className="font-medium">Mode Sombre</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 REATD – UVCI
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
