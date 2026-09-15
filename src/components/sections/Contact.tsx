"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/ui/Magnetic";

type Status = "idle" | "loading" | "success" | "error";

const inputClasses =
  "w-full bg-transparent font-body text-white placeholder:text-white/30 border-0 border-b border-cyan-500/50 focus:border-cyan-400 outline-none py-3 transition-colors";

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const bridgeSection = document.getElementById("bridge");
    const bridgeContent = document.getElementById("bridge-content");

    const ctx = gsap.context(() => {
      if (bridgeSection && bridgeContent) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: bridgeSection,
              start: "bottom 80%",
              end: "bottom 10%",
              scrub: true,
            },
          })
          .to(bridgeContent, { scale: 0, rotate: 25, opacity: 0, ease: "power2.in" }, 0)
          .fromTo(
            formWrapperRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, ease: "power2.out" },
            0
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      access_key: "dcc9b9ba-62ba-4efc-bbbd-0ca175ea2e3f",
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      id="contact"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6 py-24"
    >
      <div ref={formWrapperRef} className="w-full max-w-lg">
        {status === "success" ? (
          <div className="text-center">
            <h3 className="font-display font-bold text-3xl md:text-4xl text-white">
              Transmission Received
            </h3>
            <p className="font-body text-white/60 mt-4">
              We&apos;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <h3 className="font-display font-bold text-3xl md:text-4xl text-white text-center mb-4">
              Start the Conversation
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className={inputClasses}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className={inputClasses}
            />
            <textarea
              name="message"
              placeholder="The Problem to Solve"
              required
              rows={4}
              className={inputClasses}
            />

            <Magnetic className="self-center block" radius={50} strength={10}>
              <button
                type="submit"
                disabled={status === "loading"}
                className="font-body text-white border border-white/20 rounded-full px-8 py-3 mt-4 transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send"}
              </button>
            </Magnetic>

            {status === "error" && (
              <p className="font-body text-red-400 text-sm text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
