import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { ArcadeLauncher } from "@/components/games/ArcadeLauncher";
import { Genie } from "@/components/genie/Genie";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/navigation/Navbar";

/** Public marketing site chrome: navbar, footer, Genie and the arcade. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[90] -translate-y-24 rounded-full bg-glow px-5 py-3 font-medium text-navy transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      {/* overflow-x-clip: off-screen reveal offsets never cause sideways scrolling,
          and unlike overflow-hidden it keeps position: sticky working. */}
      <main id="main" className="flex-1 overflow-x-clip">
        {children}
      </main>
      <Footer />
      <ArcadeLauncher />
      <Genie />
    </>
  );
}
