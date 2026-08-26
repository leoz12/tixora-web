import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "@/lib/providers";
import { getServerUser } from "@/lib/auth-server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Tixora — Book Tickets to Live Events",
  description:
    "Browse concerts, sports, theater, comedy, and conferences, and book your tickets in minutes.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [messages, initialUser] = await Promise.all([
    getMessages(),
    getServerUser(),
  ]);

  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans", geist.variable)}>
      <body
        className="min-h-full flex flex-col bg-surface-alt text-ink-900"
        suppressHydrationWarning
      >
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: booking tickets should feel like booking a trip — a trusted blue travel-commerce chrome carries the browsing, a green action color carries the money moment, never a theatrical stage set.
OWN-WORLD: white/pale-blue surfaces on a soft blue-gray ground; deep-to-mid blue (#0c2c61 to #1966d6) owns navigation, hero bands, and wayfinding; green (#12a150) owns prices, availability, and every buy action; Plus Jakarta Sans carries both display and body at a confident, tight-tracked scale; white rounded-2xl cards float on the pale ground; hero bands carry a floating white panel overlapping their lower edge.
STORY: the visitor lands on a blue hero with a floating search/category panel, browses white event cards, opens one into a two-column detail with a sticky green booking panel, checks out through a stepped page with a sticky order-summary card, and leaves with a boarding-pass-style e-ticket.
FIRST VIEWPORT: full-width blue gradient hero band with heading and subtext, a white rounded-2xl search/category panel overlapping its bottom edge, event grid beginning beneath.
FORM: Travel-commerce blue/green system — brief-pinned direction (blue palette, Traveloka reference), no roll.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <Providers initialUser={initialUser}>
            <TooltipProvider>
              <Header initialUser={initialUser} />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="top-center" />
            </TooltipProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
