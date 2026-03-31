import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import CMSPanel from "./components/CMSPanel";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { SiteProvider } from "./context/SiteContext";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";

function RootLayout() {
  const [cmsOpen, setCmsOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        e.preventDefault();
        setCmsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <SiteProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar onOpenCMS={() => setCmsOpen(true)} />
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
        <Footer />
        <CMSPanel open={cmsOpen} onClose={() => setCmsOpen(false)} />
        <Toaster />
      </div>
    </SiteProvider>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <PageWrapper>
      <HomePage />
    </PageWrapper>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => (
    <PageWrapper>
      <AboutPage />
    </PageWrapper>
  ),
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: () => (
    <PageWrapper>
      <GalleryPage />
    </PageWrapper>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: () => (
    <PageWrapper>
      <ContactPage />
    </PageWrapper>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  galleryRoute,
  contactRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
