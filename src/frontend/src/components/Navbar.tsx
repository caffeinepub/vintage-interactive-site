import { Link, useRouter } from "@tanstack/react-router";
import { LogIn, LogOut, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar({ onOpenCMS }: { onOpenCMS?: () => void }) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { content, isAdmin } = useSite();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <motion.header
      className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-xl font-medium text-white tracking-wide"
        >
          {content.siteTitle}
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`nav-link text-white/80 hover:text-white transition-colors ${currentPath === link.to ? "active text-white" : ""}`}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {isAdmin && onOpenCMS && (
            <button
              type="button"
              onClick={onOpenCMS}
              className="text-white/70 hover:text-white transition-colors p-1.5"
              title="Open CMS Panel (Ctrl+Shift+E)"
              data-ocid="nav.cms.button"
            >
              <Settings size={16} />
            </button>
          )}
          {identity ? (
            <button
              type="button"
              onClick={() => clear()}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-xs tracking-widest uppercase"
              data-ocid="nav.logout.button"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-xs tracking-widest uppercase"
              data-ocid="nav.login.button"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">
                {loginStatus === "logging-in" ? "Signing in…" : "Sign In"}
              </span>
            </button>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
