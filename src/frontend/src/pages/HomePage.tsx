import { Camera, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useSite } from "../context/SiteContext";

const LOCAL_HERO_KEY = "hero_image_local";

export default function HomePage() {
  const {
    content,
    letterBoxes,
    heroImageUrl,
    setHeroImageUrl,
    isAdmin,
    actor,
  } = useSite();
  const [uploading, setUploading] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!heroImageUrl) {
      const stored = localStorage.getItem(LOCAL_HERO_KEY);
      if (stored) setLocalImageUrl(stored);
    }
  }, [heroImageUrl]);

  const displayImage = heroImageUrl ?? localImageUrl;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        localStorage.setItem(LOCAL_HERO_KEY, dataUrl);
        setLocalImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);

      if (isAdmin && actor) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        await actor.setHeroImage(blob);
        setHeroImageUrl(blob.getDirectURL());
        toast.success("Photo saved to site!");
      } else {
        toast.success("Photo added!");
      }
    } catch {
      toast.error("Failed to add photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-2 sm:px-6 overflow-x-hidden">
      <motion.div
        className="flex flex-col items-center gap-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center space-y-3">
          <motion.h1
            className="text-5xl md:text-6xl font-medium tracking-wide"
            style={{
              fontFamily: "'Parisienne', cursive",
              color: "#FFD700",
              textShadow:
                "0 2px 12px rgba(255,215,0,0.6), 0 0 4px rgba(255,215,0,0.4)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {content.siteTitle}
          </motion.h1>
          <motion.p
            className="text-base tracking-wide"
            style={{
              fontFamily: "'Parisienne', cursive",
              color: "#FFD700",
              textShadow:
                "0 2px 10px rgba(255,215,0,0.55), 0 0 3px rgba(255,215,0,0.35)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {content.tagline}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative flex flex-col items-center w-full"
        >
          <div className="flex items-stretch gap-2 md:gap-4 w-full justify-center">
            <div className="flex flex-col justify-between py-2 gap-2 md:gap-4 shrink-0">
              <LetterBox
                value={letterBoxes[0] ?? "Write your note here..."}
                index={0}
              />
              <LetterBox
                value={letterBoxes[2] ?? "Another note goes here..."}
                index={2}
              />
            </div>

            <div className="flex flex-col items-center shrink-0">
              <motion.div
                className="vintage-frame relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.01 }}
                onClick={handleImageClick}
                data-ocid="hero.image.upload_button"
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 text-white/50">
                    {uploading ? (
                      <div className="animate-pulse font-serif text-lg">
                        Uploading…
                      </div>
                    ) : (
                      <>
                        <Camera size={40} className="mb-3 opacity-50" />
                        <Upload size={16} className="mb-1" />
                        <span className="text-xs tracking-wider uppercase font-sans">
                          Tap to add photo
                        </span>
                      </>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs tracking-wider uppercase font-sans">
                    {displayImage ? "Change Photo" : "Add Photo"}
                  </span>
                </div>
              </motion.div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col justify-between py-2 gap-2 md:gap-4 shrink-0">
              <LetterBox
                value={letterBoxes[1] ?? "Your thoughts here..."}
                index={1}
              />
              <LetterBox
                value={letterBoxes[3] ?? "More notes here..."}
                index={3}
              />
            </div>
          </div>

          <div
            className="mt-1"
            style={{
              width: "calc(100% + 32px)",
              borderLeft: "2px solid rgba(196, 168, 130, 0.6)",
              borderRight: "2px solid rgba(196, 168, 130, 0.6)",
              borderBottom: "2px solid rgba(196, 168, 130, 0.6)",
              height: "20px",
              borderRadius: "0 0 6px 6px",
            }}
          />
        </motion.div>

        <motion.p
          className="text-white/60 text-sm text-center font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {content.heroSubtitle}
        </motion.p>
      </motion.div>
    </main>
  );
}

function LetterBox({ value, index }: { value: string; index: number }) {
  return (
    <motion.div
      className="vintage-paper relative w-20 sm:w-36 md:w-44 h-[7rem] sm:h-[11rem] md:h-[13rem] overflow-y-auto flex items-start justify-start rounded-sm shrink-0 p-2 sm:p-3"
      whileHover={{ scale: 1.02, rotate: 0.5 }}
      transition={{ duration: 0.2 }}
      data-ocid={`hero.letterbox.item.${index + 1}`}
    >
      <span
        className="font-serif text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words w-full select-none"
        style={{ color: "#5c4a2e", fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </span>
    </motion.div>
  );
}
