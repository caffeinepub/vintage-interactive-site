import { motion } from "motion/react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { useSite } from "../context/SiteContext";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: <SiInstagram size={18} />,
  Twitter: <SiX size={18} />,
  X: <SiX size={18} />,
  Facebook: <SiFacebook size={18} />,
  LinkedIn: <SiLinkedin size={18} />,
};

export default function Footer() {
  const { socialLinks } = useSite();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="relative mt-20">
      <div className="bg-foreground/80 backdrop-blur-sm border-t border-white/10 px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/90 transition-colors"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                title={link.platform}
                data-ocid={`footer.${link.platform.toLowerCase()}.link`}
              >
                {SOCIAL_ICONS[link.platform] ?? (
                  <span className="text-xs uppercase tracking-wider">
                    {link.platform}
                  </span>
                )}
              </motion.a>
            ))}
          </div>

          <div className="h-px w-24 bg-white/15" />

          <p className="text-white/40 text-xs tracking-widest uppercase">
            &copy; {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              className="hover:text-white/70 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
