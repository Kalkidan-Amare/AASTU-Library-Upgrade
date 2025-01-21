import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            <PanelsTopLeft className="w-6 h-6 mr-3" />
            <span className="font-bold">AASTU Library</span>
            <span className="sr-only">AASTU Library</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-57px-97px)] flex-1 bg-muted">
        <div className="container relative pb-10">
          <div className="relative overflow-hidden">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="max-w-2xl text-center mx-auto">
                <h1 className="block text-3xl font-bold sm:text-4xl md:text-5xl">
                  Simplify Library Management with{" "}
                  <span className="text-primary">Ease</span>
                </h1>
                <p className="mt-3 text-lg">
                  A smart, intuitive system to streamline your library’s
                  workflow and keep readers happy.
                </p>
              </div>

              <div className="mt-10 relative max-w-5xl mx-auto">
                <div className="w-full object-cover h-96 sm:h-[480px] bg-[url('/images/hero_bg.jpg')] bg-no-repeat bg-center bg-cover rounded-xl dark:brightness-[0.4]"></div>

                <div className="absolute inset-0 size-full">
                  <div className="flex flex-col justify-center items-center size-full">
                    <Link
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-accent bg-muted shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:pointer-events-none duration-300"
                      href="/sign-up"
                    >
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Get started</span>
                    </Link>
                  </div>
                </div>

                <div className="absolute bottom-12 -start-20 -z-[1] size-48 bg-gradient-to-b from-orange-500 to-white p-px rounded-lg">
                  <div className="bg-white size-48 rounded-lg"></div>
                </div>

                <div className="absolute -top-12 -end-20 -z-[1] size-48 bg-gradient-to-t from-blue-600 to-cyan-400 p-px rounded-full">
                  <div className="bg-white size-48 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 md:py-0 border-t border-border/40"></footer>
    </div>
  );
}
