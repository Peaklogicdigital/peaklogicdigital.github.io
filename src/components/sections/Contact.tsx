"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deferToNextFrame } from "@/lib/deferredEffect";
import { FOCUS_RING } from "@/lib/focusRing";
import Magnetic from "@/components/ui/Magnetic";
import { playTone } from "@/lib/sound";

type Status = "idle" | "loading" | "success" | "error";

const inputClasses = `w-full bg-transparent font-body text-white placeholder:text-white/30 border-0 border-b border-cyan-500/50 focus:border-cyan-400 outline-none py-3 transition-colors rounded-sm ${FOCUS_RING}`;

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancel = deferToNextFrame(() => {
      const bridgeSection = document.getElementById("bridge");
      const bridgeContent = document.getElementById("bridge-content");

      ctx = gsap.context(() => {
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
    });

    return () => {
      cancel();
      ctx?.revert();
    };
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
      className="min-h-screen flex items-center justify-center px-4 py-16 md:px-6 md:py-24"
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
              Project Inquiry
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              aria-label="Name"
              aria-required="true"
              className={inputClasses}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              aria-label="Email"
              aria-required="true"
              className={inputClasses}
            />
            <textarea
              name="message"
              placeholder="The Problem to Solve"
              required
              aria-label="Message"
              aria-required="true"
              rows={4}
              className={inputClasses}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                required
                checked={consentChecked}
                onChange={(event) => setConsentChecked(event.target.checked)}
                aria-required="true"
                aria-checked={consentChecked}
                className={`mt-1 h-4 w-4 shrink-0 rounded accent-cyan-500 ${FOCUS_RING}`}
              />
              <span className="font-body text-sm text-white/60 leading-relaxed">
                I agree to the processing of my data in accordance with the{" "}
                <Link
                  href="/privacy"
                  className={`text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors rounded ${FOCUS_RING}`}
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Magnetic className="self-center block" radius={50} strength={10}>
              <button
                type="submit"
                disabled={status === "loading" || !consentChecked}
                aria-disabled={status === "loading" || !consentChecked}
                onMouseEnter={() => {
                  if (status !== "loading" && consentChecked) playTone(1100);
                }}
                className={`font-body text-white border border-white/20 rounded-full px-8 py-3 mt-4 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent ${FOCUS_RING}`}
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
