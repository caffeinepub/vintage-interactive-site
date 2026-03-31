import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  GalleryImage,
  SiteContent,
  SocialMedia,
  backendInterface,
} from "../backend";
import { useActor } from "../hooks/useActor";

const DEFAULT_CONTENT: SiteContent = {
  siteTitle: "ridhiii",
  tagline: "happy birthday bestiee",
  heroSubtitle: "Welcome — click to begin your journey",
  aboutTitle: "About Me",
  aboutBody:
    "I am a collector of moments, a weaver of stories. This space is my canvas — a place where memories find their frame and every detail carries meaning. Crafted with care, inspired by the timeless.",
  contactEmail: "hello@yourname.com",
  contactPhone: "+1 (555) 000-0000",
  contactAddress: "123 Vintage Lane, Artisan Quarter",
};

const DEFAULT_LETTER_BOXES = [
  "Oiii kuchu puchuu happy birthday this year will bring you all the happiness of this universe",
  "this is just a lil gift on thus special day of yourss enjoy this dayy happy birthday",
  "Thanks for being my best friend thanks for listining to my Things Thanks for Being a pillar I Can lean on Thanks for everything baachuu",
  "happy birthday with all of my heart and. Prayers",
];

interface SiteContextValue {
  content: SiteContent;
  letterBoxes: string[];
  galleryImages: GalleryImage[];
  socialLinks: SocialMedia[];
  heroImageUrl: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  actor: backendInterface | null;
  refresh: () => Promise<void>;
  setContent: (c: SiteContent) => void;
  setLetterBoxes: (lb: string[]) => void;
  setGalleryImages: (imgs: GalleryImage[]) => void;
  setSocialLinks: (links: SocialMedia[]) => void;
  setHeroImageUrl: (url: string | null) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [letterBoxes, setLetterBoxes] =
    useState<string[]>(DEFAULT_LETTER_BOXES);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "Facebook", url: "https://facebook.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
  ]);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!actor) return;
    setIsLoading(true);
    try {
      const [
        siteContent,
        lb0,
        lb1,
        lb2,
        lb3,
        galleryImgs,
        socialMediaLinks,
        heroImg,
        adminStatus,
      ] = await Promise.all([
        actor.getSiteContent().catch(() => DEFAULT_CONTENT),
        actor.getLetterBox(0n).catch(() => DEFAULT_LETTER_BOXES[0]),
        actor.getLetterBox(1n).catch(() => DEFAULT_LETTER_BOXES[1]),
        actor.getLetterBox(2n).catch(() => DEFAULT_LETTER_BOXES[2]),
        actor.getLetterBox(3n).catch(() => DEFAULT_LETTER_BOXES[3]),
        actor.getGalleryImages().catch(() => [] as GalleryImage[]),
        actor.getSocialMediaLinks().catch(() => [] as SocialMedia[]),
        actor.getHeroImage().catch(() => null),
        actor.isCallerAdmin().catch(() => false),
      ]);

      const resolvedContent =
        siteContent.siteTitle === "" ? DEFAULT_CONTENT : siteContent;
      setContent(resolvedContent);
      setLetterBoxes([
        lb0 === "" ? DEFAULT_LETTER_BOXES[0] : lb0,
        lb1 === "" ? DEFAULT_LETTER_BOXES[1] : lb1,
        lb2 === "" ? DEFAULT_LETTER_BOXES[2] : lb2,
        lb3 === "" ? DEFAULT_LETTER_BOXES[3] : lb3,
      ]);
      if (galleryImgs.length > 0) setGalleryImages(galleryImgs);
      if (socialMediaLinks.length > 0) setSocialLinks(socialMediaLinks);
      if (heroImg) setHeroImageUrl(heroImg.getDirectURL());
      setIsAdmin(adminStatus);
    } catch (e) {
      console.error("Failed to load site content", e);
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isFetching) {
      refresh();
    }
  }, [actor, isFetching, refresh]);

  return (
    <SiteContext.Provider
      value={{
        content,
        letterBoxes,
        galleryImages,
        socialLinks,
        heroImageUrl,
        isAdmin,
        isLoading,
        actor,
        refresh,
        setContent,
        setLetterBoxes,
        setGalleryImages,
        setSocialLinks,
        setHeroImageUrl,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
