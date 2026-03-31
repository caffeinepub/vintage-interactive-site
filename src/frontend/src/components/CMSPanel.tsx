import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { SiteContent } from "../backend";
import { useSite } from "../context/SiteContext";

const CONTENT_FIELDS: [string, keyof SiteContent][] = [
  ["Site Title", "siteTitle"],
  ["Tagline", "tagline"],
  ["Hero Subtitle", "heroSubtitle"],
  ["About Title", "aboutTitle"],
  ["Contact Email", "contactEmail"],
  ["Contact Phone", "contactPhone"],
  ["Contact Address", "contactAddress"],
];

const LETTER_BOX_KEYS = ["box-0", "box-1", "box-2", "box-3"];

export default function CMSPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { content, letterBoxes, galleryImages, socialLinks, refresh, actor } =
    useSite();
  const [saving, setSaving] = useState(false);
  const [editContent, setEditContent] = useState<SiteContent>({ ...content });
  const [editLetterBoxes, setEditLetterBoxes] = useState<string[]>([
    ...letterBoxes,
  ]);
  const [editSocialLinks, setEditSocialLinks] = useState([...socialLinks]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const saveContent = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.setSiteContent(editContent);
      await refresh();
      toast.success("Content saved!");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const saveLetterBoxes = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await Promise.all(
        editLetterBoxes.map((val, i) => actor.setLetterBox(BigInt(i), val)),
      );
      await refresh();
      toast.success("Letter boxes saved!");
    } catch {
      toast.error("Failed to save letter boxes");
    } finally {
      setSaving(false);
    }
  };

  const addGalleryImage = async () => {
    if (!actor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (!input.files?.[0]) return;
      setSaving(true);
      try {
        const file = input.files[0];
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        await actor.addGalleryImage(blob, null);
        await refresh();
        toast.success("Image added!");
      } catch {
        toast.error("Failed to add image");
      } finally {
        setSaving(false);
      }
    };
    input.click();
  };

  const removeGalleryImage = async (index: number) => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.removeGalleryImage(BigInt(index));
      await refresh();
      toast.success("Image removed!");
    } catch {
      toast.error("Failed to remove image");
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = async () => {
    if (!newPlatform || !newUrl || !actor) return;
    setSaving(true);
    try {
      await actor.addSocialMedia(newPlatform, newUrl);
      setNewPlatform("");
      setNewUrl("");
      await refresh();
      setEditSocialLinks([...socialLinks]);
      toast.success("Social link added!");
    } catch {
      toast.error("Failed to add social link");
    } finally {
      setSaving(false);
    }
  };

  const removeSocialLink = async (platform: string) => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.removeSocialMedia(platform);
      await refresh();
      setEditSocialLinks(socialLinks.filter((s) => s.platform !== platform));
      toast.success("Social link removed!");
    } catch {
      toast.error("Failed to remove social link");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-background border-border overflow-y-auto"
        data-ocid="cms.sheet"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-xl">
            Content Management
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="content">
          <TabsList className="w-full mb-6 bg-muted/40">
            <TabsTrigger
              value="content"
              className="flex-1"
              data-ocid="cms.content.tab"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="letterboxes"
              className="flex-1"
              data-ocid="cms.letterboxes.tab"
            >
              Letter Boxes
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="flex-1"
              data-ocid="cms.gallery.tab"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="flex-1"
              data-ocid="cms.social.tab"
            >
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            {CONTENT_FIELDS.map(([label, key]) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  {label}
                </Label>
                <Input
                  value={editContent[key] as string}
                  onChange={(e) =>
                    setEditContent((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="cms-input"
                  data-ocid={`cms.${key}.input`}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                About Body
              </Label>
              <Textarea
                value={editContent.aboutBody}
                onChange={(e) =>
                  setEditContent((prev) => ({
                    ...prev,
                    aboutBody: e.target.value,
                  }))
                }
                rows={4}
                className="cms-input"
                data-ocid="cms.aboutBody.textarea"
              />
            </div>
            <Button
              onClick={saveContent}
              disabled={saving || !actor}
              className="w-full"
              data-ocid="cms.content.save_button"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Content
            </Button>
          </TabsContent>

          <TabsContent value="letterboxes" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Edit the 4 vintage paper letter boxes shown on the hero page. Each
              box supports multiple lines of text.
            </p>
            {editLetterBoxes.map((val, i) => (
              <div key={LETTER_BOX_KEYS[i]} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Box {i + 1}
                </Label>
                <Textarea
                  value={val}
                  onChange={(e) => {
                    const next = [...editLetterBoxes];
                    next[i] = e.target.value;
                    setEditLetterBoxes(next);
                  }}
                  rows={5}
                  className="cms-input resize-none font-serif text-sm"
                  placeholder={`Write 4-5 lines for box ${i + 1}...`}
                  data-ocid={`cms.letterbox.textarea.${i + 1}`}
                />
              </div>
            ))}
            <Button
              onClick={saveLetterBoxes}
              disabled={saving || !actor}
              className="w-full"
              data-ocid="cms.letterboxes.save_button"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Letter Boxes
            </Button>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Button
              onClick={addGalleryImage}
              disabled={saving || !actor}
              variant="outline"
              className="w-full"
              data-ocid="cms.gallery.upload_button"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Image
            </Button>
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((img, i) => (
                <div
                  key={img.blob.getDirectURL()}
                  className="relative group rounded overflow-hidden aspect-square"
                >
                  <img
                    src={img.blob.getDirectURL()}
                    alt={img.caption ?? `Gallery image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-600/80 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    data-ocid={`cms.gallery.delete_button.${i + 1}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            {editSocialLinks.map((link) => (
              <div key={link.platform} className="flex items-center gap-2">
                <span className="text-sm font-medium w-24 shrink-0">
                  {link.platform}
                </span>
                <span className="text-xs text-muted-foreground truncate flex-1">
                  {link.url}
                </span>
                <button
                  type="button"
                  onClick={() => removeSocialLink(link.platform)}
                  className="text-destructive hover:text-destructive/80 transition-colors p-1"
                  data-ocid="cms.social.delete_button"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Add New
              </p>
              <Input
                placeholder="Platform (e.g. Instagram)"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="cms-input"
                data-ocid="cms.social.platform.input"
              />
              <Input
                placeholder="URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="cms-input"
                data-ocid="cms.social.url.input"
              />
              <Button
                onClick={addSocialLink}
                disabled={saving || !newPlatform || !newUrl || !actor}
                className="w-full"
                data-ocid="cms.social.add_button"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Social Link
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
