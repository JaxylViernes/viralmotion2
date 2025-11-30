import React, { useState } from "react";
import { Home, Layers, FolderOpen, Film, User, Sparkles, LogOut, Menu, X } from "lucide-react";

export type DashboardSection =
  | "home"
  | "templates"
  | "files"
  | "renders"
  | "profile";

interface DashboardSidebarNavProps {
  userPfp: string | null;
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
  userInitials?: string;
}

export const DashboardSidebarNav: React.FC<DashboardSidebarNavProps> = ({
  active,
  onChange,
  userPfp,
  userInitials = "U",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "templates", label: "My templates", icon: Layers },
    { id: "files", label: "My files", icon: FolderOpen },
    { id: "renders", label: "My Renders", icon: Film },
  ] as const;

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 py-3 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              ViralMotion
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              Create. Edit. Inspire.
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl flex-col justify-between py-5 z-40">
        {/* Logo section */}
        <div>
          <div
            className="flex items-center gap-3 px-6 mb-6 cursor-pointer group"
            onClick={() => onChange("home")}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                ViralMotion
              </h1>
              <p className="text-xs text-gray-500 font-medium">Create. Edit. Inspire.</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-100 mx-4 mb-4"></div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-1.5 px-4">
            {navItems.map((item) => {
              const isActive = active === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onChange(item.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {/* Hover glow effect for inactive items */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  )}

                  <Icon
                    size={20}
                    className={`relative z-10 ${
                      isActive ? "" : "group-hover:scale-110 transition-transform duration-300"
                    }`}
                  />
                  <span className="relative z-10">{item.label}</span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile section */}
        <div className="px-4 border-t border-gray-100 pt-4 bg-gradient-to-t from-white to-transparent">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 w-full hover:bg-gray-50 rounded-xl p-3 transition-all duration-300 group"
          >
            {userPfp ? (
              <img
                src={userPfp}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-violet-400 transition-colors object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {userInitials}
              </div>
            )}
            <div className="flex flex-col text-left flex-1">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                My Account
              </span>
              <span className="text-xs text-gray-500">Manage profile</span>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute bottom-20 left-4 bg-white shadow-xl rounded-2xl border border-gray-200 w-56 text-left z-50 overflow-hidden">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onChange("profile");
                }}
                className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 flex items-center gap-3 transition-colors"
              >
                <User size={18} /> View Profile
              </button>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-72`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                ViralMotion
              </span>
              <p className="text-[10px] text-gray-500 font-medium">
                Create. Edit. Inspire.
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Profile Actions */}
          <button
            onClick={() => {
              onChange("profile");
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
          >
            <User size={20} /> View Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};