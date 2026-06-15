import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserStar,
  MapPinPen
} from "lucide-react";

interface NavItemProps {
  key?: React.Key;
  item: {
    name: string;
    path: string;
    icon: any;
  };
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({ item, isCollapsed, onClick }: NavItemProps) => (
  <NavLink
    to={item.path}
    className={({ isActive }) => `
      flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
      ${isActive
        ? "bg-red-50 text-red-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
    `}
    onClick={onClick}
    id={`nav-link-${item.name.toLowerCase()}`}
  >
    <div className="shrink-0">
      <item.icon size={20} />
    </div>
    <AnimatePresence mode="wait">
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          className="whitespace-nowrap overflow-hidden pr-2"
        >
          {item.name}
        </motion.span>
      )}
    </AnimatePresence>
  </NavLink>
);

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    // { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Client", path: "/client", icon: UserStar },
    { name: "Visite", path: "/visite", icon: MapPinPen },
  ];

  const sidebarVariants = {
    open: { width: "240px", transition: { duration: 0.3 } },
    closed: { width: "80px", transition: { duration: 0.3 } },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans" id="layout-root">
      {/* Mobile Header */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-40"
        id="mobile-header"
      >
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          id="mobile-menu-toggle"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-semibold text-lg text-gray-900 font-sans">CRM ADMIN</span>
      </header>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="hidden md:flex flex-col bg-white border-r border-gray-200 h-full relative z-30 shadow-sm"
        id="desktop-sidebar"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
          {!isSidebarOpen ? (
            <div className="w-full flex justify-center">
              <span className="text-xl font-bold text-red-600">CRM</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-red-600 ml-2">CRM ADMIN</span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isCollapsed={!isSidebarOpen}
            />
          ))}
        </nav>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 text-gray-500 z-50 transition-transform active:scale-95"
          id="sidebar-collapse-toggle"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        {isSidebarOpen ?
          <footer className="flex justify-center w-full">
            <a
              href="https://allpro.alphaciment.com/allpro/home.php"
              className="m-2 mb-4 inline-flex justify-center items-center text-center px-6 py-3 bg-yellow-200 hover:bg-yellow-300 font-semibold rounded-lg shadow-md transition duration-200"
            >
              Retour vers Allpro
            </a>
          </footer>
          :
          <footer className="flex justify-center w-full">
            <a
              href="https://allpro.alphaciment.com/allpro/home.php"
              className="m-2 mb-4 inline-flex justify-center items-center text-center px-2 py-1 bg-yellow-200 hover:bg-yellow-300 font-semibold rounded-lg shadow-md transition duration-200"
            >
              Allpro
            </a>
          </footer>
        }

      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
              id="mobile-overlay"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl flex flex-col"
              id="mobile-sidebar"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
                <span className="text-xl font-bold text-red-600">My App</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
                  id="mobile-sidebar-close"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
                {navItems.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    isCollapsed={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </nav>
              <footer className="flex justify-center w-full">
                <a
                  href="https://allpro.alphaciment.com/allpro/home.php"
                  className="m-2 mb-4 inline-flex justify-center items-center text-center px-6 py-3 bg-yellow-200 hover:bg-yellow-300 font-semibold rounded-lg shadow-md transition duration-200"
                >
                  Retour vers Allpro
                </a>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className="flex-1 flex flex-col min-w-0 overflow-y-auto"
        id="main-content"
      >
        <div className="p-6 w-full mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
