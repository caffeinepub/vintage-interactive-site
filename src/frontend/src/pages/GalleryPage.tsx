import { Camera, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useSite } from "../context/SiteContext";

const PLACEHOLDER_CAPTIONS = [
  "Morning Light",
  "Still Waters",
  "Golden Hour",
  "Quiet Moments",
  "The Wanderer",
  "Into the Mist",
];

export default function GalleryPage() {
  const { galleryImages, refresh, isAdmin, actor } = useSite();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actor) return;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      await actor.addGalleryImage(blob, null);
      await refresh();
      toast.success("Image added to gallery!");
    } catch {
      toast.error("Failed to add image");
    }
    e.target.value = "";
  };

  const displayImages = galleryImages.length > 0 ? galleryImages : null;

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-5xl text-white font-medium">
            Gallery
          </h1>
          <div className="w-16 h-px bg-white/30 mx-auto mt-6" />
          <p className="text-white/50 text-sm tracking-wider uppercase font-sans mt-4">
            A curated collection of moments
          </p>
        </motion.div>

        {isAdmin && actor && (
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-white/70 hover:text-white text-xs tracking-wider uppercase border border-white/20 hover:border-white/40 px-4 py-2 rounded transition-all"
              data-ocid="gallery.add.upload_button"
            >
              <Plus size={14} />
              Add Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddImage}
            />
          </div>
        )}

        {displayImages ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayImages.map((img, i) => (
              <GalleryCard
                key={img.blob.getDirectURL()}
                src={img.blob.getDirectURL()}
                caption={
                  img.caption ??
                  PLACEHOLDER_CAPTIONS[i % PLACEHOLDER_CAPTIONS.length]
                }
                index={i}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            data-ocid="gallery.empty_state"
          >
            {PLACEHOLDER_CAPTIONS.map((caption, i) => (
              <GalleryPlaceholder
                key={caption}
                caption={caption}
                index={i}
                onUpload={
                  isAdmin && actor
                    ? () => fileInputRef.current?.click()
                    : undefined
                }
              />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

function GalleryCard({
  src,
  caption,
  index,
}: { src: string; caption: string; index: number }) {
  return (
    <motion.div
      className="gallery-card vintage-frame overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      data-ocid={`gallery.item.${index + 1}`}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={src}
          alt={caption}
          className="gallery-img w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 bg-white/10 backdrop-blur-sm">
        <p className="font-serif text-white/80 text-sm italic text-center">
          {caption}
        </p>
      </div>
    </motion.div>
  );
}

function GalleryPlaceholder({
  caption,
  index,
  onUpload,
}: {
  caption: string;
  index: number;
  onUpload?: () => void;
}) {
  return (
    <motion.div
      className="gallery-card vintage-frame overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      onClick={onUpload}
      data-ocid={`gallery.item.${index + 1}`}
    >
      <div className="aspect-square bg-white/10 flex flex-col items-center justify-center gap-3 text-white/30 group-hover:text-white/50 transition-colors">
        <Camera size={36} />
        {onUpload && (
          <span className="text-xs tracking-wider uppercase font-sans">
            Click to Upload
          </span>
        )}
      </div>
      <div className="p-3 bg-white/5 backdrop-blur-sm">
        <p className="font-serif text-white/50 text-sm italic text-center">
          {caption}
        </p>
      </div>
    </motion.div>
  );
}
