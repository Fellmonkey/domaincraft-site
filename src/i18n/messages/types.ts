export interface NavMessages {
  products: string;
  features: string;
  howItWorks: string;
  bridges: string;
  skills: string;
  changelog: string;
  blog: string;
  ai: string;
  studio: string;
  docs: string;
  star: string;
  install: string;
}

export interface HeroMessages {
  badge: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  installLabel: string;
  downloadCta: string;
  platforms: string;
  copied: string;
  terminalTitle: string;
  domainTab: string;
  codeTab: string;
  treeTab: string;
  running: string;
  ready: string;
}

export interface TrustMessages {
  title: string;
  items: string[];
}

export interface ProblemMessages {
  eyebrow: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  headerTraditional: string;
  headerDomaincraft: string;
  rows: Array<{ traditional: string; domaincraft: string }>;
}

export interface Step {
  title: string;
  description: string;
}

export interface HowItWorksMessages {
  eyebrow: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  steps: Step[];
}

export interface FeatureCard {
  title: string;
  description: string;
}

export interface FeaturesMessages {
  eyebrow: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  cards: FeatureCard[];
}

export interface AiMessages {
  eyebrow: string;
  label: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  cards: FeatureCard[];
  promptLabel: string;
  copyPrompt: string;
  copied: string;
  resultLabel: string;
}

export interface StudioMessages {
  eyebrow: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  bullets: string[];
}

export interface Bridge {
  name: string;
  status: 'ready' | 'planned' | 'beta';
  description: string;
}

export interface BridgesMessages {
  eyebrow: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  buildYourOwn: string;
  buildYourOwnDesc: string;
  cards: Bridge[];
}

export interface OssMessages {
  eyebrow: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  license: string;
  contribute: string;
  contributeDesc: string;
  roadmap: string;
  roadmapDesc: string;
  star: string;
  starDesc: string;
}

export interface CtaMessages {
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  code: string;
  goNote: string;
  copied: string;
}

export interface FooterMessages {
  tagline: string;
  product: string;
  productLinks: Record<string, string>;
  resources: string;
  resourcesLinks: Record<string, string>;
  community: string;
  communityLinks: Record<string, string>;
  rights: string;
  languageLabel: string;
}

export interface Messages {
  langName: string;
  nav: NavMessages;
  hero: HeroMessages;
  trust: TrustMessages;
  problem: ProblemMessages;
  howItWorks: HowItWorksMessages;
  features: FeaturesMessages;
  ai: AiMessages;
  studio: StudioMessages;
  bridges: BridgesMessages;
  oss: OssMessages;
  cta: CtaMessages;
  footer: FooterMessages;
}