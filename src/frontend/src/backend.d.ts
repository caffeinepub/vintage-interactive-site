import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type LetterBox = string;
export interface GalleryImage {
    blob: ExternalBlob;
    caption?: string;
}
export interface SiteContent {
    siteTitle: string;
    tagline: string;
    aboutTitle: string;
    heroSubtitle: string;
    heroImage?: ExternalBlob;
    aboutBody: string;
    contactEmail: string;
    contactAddress: string;
    contactPhone: string;
}
export interface SocialMedia {
    url: string;
    platform: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryImage(blob: ExternalBlob, caption: string | null): Promise<void>;
    addGalleryImages(images: Array<GalleryImage>): Promise<void>;
    addSocialMedia(platform: string, url: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getHeroImage(): Promise<ExternalBlob | null>;
    getLetterBox(index: bigint): Promise<LetterBox>;
    getSiteContent(): Promise<SiteContent>;
    getSocialMediaLinks(): Promise<Array<SocialMedia>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeGalleryImage(index: bigint): Promise<void>;
    removeSocialMedia(platform: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setHeroImage(blob: ExternalBlob): Promise<void>;
    setLetterBox(index: bigint, value: LetterBox): Promise<void>;
    setSiteContent(content: SiteContent): Promise<void>;
}
