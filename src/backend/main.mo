import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type LetterBox = Text;
  type SocialMedia = {
    platform : Text;
    url : Text;
  };
  type GalleryImage = {
    blob : Storage.ExternalBlob;
    caption : ?Text;
  };

  type SiteContent = {
    siteTitle : Text;
    tagline : Text;
    heroSubtitle : Text;
    aboutTitle : Text;
    aboutBody : Text;
    contactEmail : Text;
    contactPhone : Text;
    contactAddress : Text;
    heroImage : ?Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  let emptySiteContent : SiteContent = {
    siteTitle = "";
    tagline = "";
    heroSubtitle = "";
    aboutTitle = "";
    aboutBody = "";
    contactEmail = "";
    contactPhone = "";
    contactAddress = "";
    heroImage = null;
  };

  var siteContent : SiteContent = emptySiteContent;
  var letterBoxes : [LetterBox] = ["", "", "", ""];
  let socialMediaLinks = List.empty<SocialMedia>();
  let galleryImages = List.empty<GalleryImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user: Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Site Content Management
  public shared ({ caller }) func setSiteContent(content : SiteContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set site content");
    };
    siteContent := content;
  };

  public query func getSiteContent() : async SiteContent {
    siteContent;
  };

  // Letter Box Management
  public shared ({ caller }) func setLetterBox(index : Nat, value : LetterBox) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set letter boxes");
    };
    if (index >= 4) { Runtime.trap("Invalid letter box index") };
    let newBoxes = List.empty<LetterBox>();
    for (i in Nat.range(0, 4)) {
      if (i == index) {
        newBoxes.add(value);
      } else {
        newBoxes.add(letterBoxes[i]);
      };
    };
    letterBoxes := newBoxes.toArray();
  };

  public query func getLetterBox(index : Nat) : async LetterBox {
    if (index >= 4) { Runtime.trap("Invalid letter box index") };
    letterBoxes[index];
  };

  // Gallery Image Management
  public shared ({ caller }) func addGalleryImage(blob : Storage.ExternalBlob, caption : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery images");
    };
    galleryImages.add({ blob; caption });
  };

  public shared ({ caller }) func addGalleryImages(images : [GalleryImage]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery images");
    };
    for (image in images.values()) {
      galleryImages.add(image);
    };
  };

  public shared ({ caller }) func removeGalleryImage(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove gallery images");
    };
    if (index >= galleryImages.size()) { Runtime.trap("Invalid gallery image index") };
    let newGallery = List.empty<GalleryImage>();
    for (i in Nat.range(0, galleryImages.size())) {
      if (i != index) {
        let image = galleryImages.at(i);
        newGallery.add(image);
      };
    };
    galleryImages.clear();
    galleryImages.addAll(newGallery.values());
  };

  public query func getGalleryImages() : async [GalleryImage] {
    galleryImages.values().toArray();
  };

  // Social Media Management
  public shared ({ caller }) func addSocialMedia(platform : Text, url : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add social media links");
    };
    socialMediaLinks.add({ platform; url });
  };

  public shared ({ caller }) func removeSocialMedia(platform : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove social media links");
    };
    let newLinks = List.empty<SocialMedia>();
    for (link in socialMediaLinks.values()) {
      if (link.platform != platform) {
        newLinks.add(link);
      };
    };
    socialMediaLinks.clear();
    socialMediaLinks.addAll(newLinks.values());
  };

  public query func getSocialMediaLinks() : async [SocialMedia] {
    socialMediaLinks.values().toArray();
  };

  // Hero Image Management
  public shared ({ caller }) func setHeroImage(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set hero image");
    };
    siteContent := {
      siteContent with
      heroImage = ?blob;
    };
  };

  public query func getHeroImage() : async ?Storage.ExternalBlob {
    siteContent.heroImage;
  };
};
