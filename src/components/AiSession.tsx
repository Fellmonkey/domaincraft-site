"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, FileCode2, MessageSquareText, Rocket, Terminal, Wand2 } from "lucide-react";
import { aiDomainYaml } from "@/data/demo";
import CopyButton from "./CopyButton";
import { cn } from "@/lib/utils";

export interface AiSessionMessages {
  sessionTitle: string;
  copyPrompt: string;
  copied: string;
  stepYouAgent: string;
  stepYaml: string;
  stepGenerate: string;
  stepHooks: string;
  stepDeploy: string;
  stepDeployResult: string;
}

const prompt = `You are building an online store with DomainCraft.

1. Draft the domain: Product + Category entities with
   relations, audit + soft_delete features and permissions
   (public read, Admin create/delete, @Owner update).
2. I'll run: domaincraft generate
3. Then I'll write the custom business logic in the hooks.
4. And deploy it: docker compose up

Output only a valid domain.yaml.`;

const generateOutput = `✓ Schema valid (2 entities)
✓ 42 files generated · compiles clean
  src/WebApi/Controllers/ProductsController.g.cs
  src/Application/Generated/ProductService.g.cs
  tests/ApiTests.g.cs`;

const hookCode = `// ProductService.cs — your file, overwrite: false
protected override async Task<HookResult> OnBeforeCreateAsync(
    Product entity, CancellationToken ct)
{
    if (entity.Price <= 0)
        return HookResult.Fail("Price must be positive");
    return HookResult.Success();
}`;

const deployOutput = `[+] Running 2/2
 ✔ Container postgres   Started
 ✔ Container api        Started`;

interface Step {
  value: string;
  label: string;
  icon: ReactNode;
  code: string;
}

export default function AiSession({ messages }: { messages: AiSessionMessages }) {
  const steps: Step[] = [
    {
      value: "prompt",
      label: messages.stepYouAgent,
      icon: <MessageSquareText className="size-3.5" />,
      code: prompt
    },
    {
      value: "yaml",
      label: messages.stepYaml,
      icon: <FileCode2 className="size-3.5" />,
      code: aiDomainYaml
    },
    {
      value: "generate",
      label: messages.stepGenerate,
      icon: <Terminal className="size-3.5" />,
      code: generateOutput
    },
    {
      value: "hooks",
      label: messages.stepHooks,
      icon: <Wand2 className="size-3.5" />,
      code: hookCode
    },
    {
      value: "deploy",
      label: messages.stepDeploy,
      icon: <Rocket className="size-3.5" />,
      code: `${deployOutput}\n ✓ ${messages.stepDeployResult}`
    }
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % steps.length) + steps.length) % steps.length),
    [steps.length]
  );

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, 4500);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, steps.length]);

  const active = steps[index];
  const isLast = index === steps.length - 1;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full bg-red-400/80" />
            <i className="size-2.5 rounded-full bg-yellow-400/80" />
            <i className="size-2.5 rounded-full bg-green-400/80" />
          </span>
          {messages.sessionTitle}
        </span>
        <CopyButton value={prompt} label={messages.copyPrompt} copiedLabel={messages.copied} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* step progress chips */}
        <div className="flex flex-wrap gap-1.5 border-b border-border bg-muted/30 px-3 py-2.5">
          {steps.map((step, i) => (
            <button
              key={step.value}
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] transition-colors",
                i === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="opacity-70">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>

        {/* carousel viewport */}
        <div className="relative h-72 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {steps.map((step, i) => (
              <div key={step.value} className="h-full w-full shrink-0 p-4">
                <div className="flex h-full flex-col">
                  <p className="mb-2 flex items-center gap-2 font-mono text-xs font-semibold">
                    {step.icon}
                    {step.label}
                  </p>
                  <pre
                    className={cn(
                      "flex-1 overflow-hidden whitespace-pre-wrap break-words rounded-lg border border-border bg-background/60 p-4 font-mono text-[13px] leading-relaxed text-foreground/90",
                      i === index && isLast && "border-green-500/40"
                    )}
                  >
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* prev / next */}
          <button
            type="button"
            aria-label="Previous step"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm transition-colors hover:bg-card hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next step"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm transition-colors hover:bg-card hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* dots */}
        <div className="flex items-center justify-center gap-1.5 border-t border-border bg-muted/20 px-3 py-2.5">
          {steps.map((step, i) => (
            <button
              key={step.value}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
