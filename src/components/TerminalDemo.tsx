"use client";

import { useEffect, useState } from "react";
import { TerminalIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { domainYaml, generatedService, projectTree } from "@/data/demo";
import { cn } from "@/lib/utils";

export interface TerminalMessages {
  terminalTitle: string;
  domainTab: string;
  codeTab: string;
  treeTab: string;
  running: string;
  ready: string;
}

const TYPING_MS = 22;
const SETTLE_MS = 700;

export default function TerminalDemo({ messages }: { messages: TerminalMessages }) {
  const [spoken, setSpoken] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setSpoken(messages.running.slice(0, i));
      if (i >= messages.running.length) {
        window.clearInterval(id);
        window.setTimeout(() => setFinished(true), SETTLE_MS);
      }
    }, TYPING_MS);
    return () => window.clearInterval(id);
  }, [messages.running]);

  const settled = spoken.length === messages.running.length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-shadow duration-700",
        finished ? "shadow-primary/10" : "shadow-black/5 dark:shadow-black/40"
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="size-2.5 rounded-full bg-red-400/80" />
          <i className="size-2.5 rounded-full bg-yellow-400/80" />
          <i className="size-2.5 rounded-full bg-green-400/80" />
        </span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <TerminalIcon className="size-3.5" />
          {messages.terminalTitle}
        </span>
        <Badge variant="outline" className="ml-auto hidden font-mono text-[10px] sm:inline-flex">
          C# · ASP.NET Core
        </Badge>
      </div>

      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2 font-mono text-xs">
        <span className={cn("text-primary", finished && "text-green-500")}>
          {finished ? "✓" : "▸"}
        </span>
        <span className="text-foreground/90">{finished ? messages.ready : spoken}</span>
        {!settled && <span className="animate-pulse">▍</span>}
      </div>

      <Tabs defaultValue="domain">
        <TabsList className="mx-4 mt-3 w-fit" variant="line">
          <TabsTrigger value="domain">{messages.domainTab}</TabsTrigger>
          <TabsTrigger value="code">{messages.codeTab}</TabsTrigger>
          <TabsTrigger value="tree">{messages.treeTab}</TabsTrigger>
        </TabsList>
        <div className="p-4 pt-3">
          <TabsContent value="domain" className="m-0">
            <CodePane code={domainYaml} />
          </TabsContent>
          <TabsContent value="code" className="m-0">
            <CodePane code={generatedService} />
          </TabsContent>
          <TabsContent value="tree" className="m-0">
            <CodePane code={projectTree} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function CodePane({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-background/60 p-4 font-mono text-[13px] leading-relaxed text-foreground/90">
      <code>{code}</code>
    </pre>
  );
}