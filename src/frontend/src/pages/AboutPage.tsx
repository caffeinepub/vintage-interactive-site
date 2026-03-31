import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";

const TRAITS = ["Creative", "Thoughtful", "Intentional"];
const TIMELINE = [
  {
    year: "2018",
    label: "The Beginning",
    desc: "A passion ignited, a vision formed",
  },
  {
    year: "2021",
    label: "The Journey",
    desc: "Stories gathered from every corner",
  },
  { year: "Now", label: "The Moment", desc: "Sharing beauty with the world" },
];

export default function AboutPage() {
  const { content } = useSite();

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-5xl text-white font-medium">
            {content.aboutTitle}
          </h1>
          <div className="w-16 h-px bg-white/30 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            className="vintage-frame w-full aspect-[4/5] overflow-hidden cursor-default bg-white/10 flex items-center justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            data-ocid="about.image.card"
          >
            <div className="flex flex-col items-center gap-3 text-white/40">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                aria-hidden="true"
              >
                <title>Image placeholder</title>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-xs tracking-wider uppercase font-sans">
                About Photo
              </span>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6 py-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="space-y-4 text-white/75 leading-relaxed font-sans text-base">
              {content.aboutBody.split("\n").map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="h-px flex-1 bg-white/20" />
              <span className="font-serif text-white/40 text-lg italic">
                &amp; more
              </span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {TRAITS.map((trait) => (
                <div
                  key={trait}
                  className="vintage-paper relative text-center py-3 px-2 rounded-sm"
                >
                  <span
                    className="text-xs uppercase tracking-widest font-sans"
                    style={{ color: "#5c4a2e" }}
                  >
                    {trait}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          {TIMELINE.map((item) => (
            <div key={item.year} className="text-center space-y-2">
              <span className="font-serif text-3xl text-white/80">
                {item.year}
              </span>
              <div className="w-8 h-px bg-white/30 mx-auto" />
              <p className="font-serif text-white/60 text-sm italic">
                {item.label}
              </p>
              <p className="text-white/40 text-xs font-sans">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
