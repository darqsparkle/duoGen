import {
  Bell,
  Calendar,
  CreditCard,
  Database,
  Cloud,
  Flame,
  LineChart,
  Mail,
  Search,
  ShoppingCart,
  Webhook,
  Building,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ServiceVisual } from "@/lib/services";
import { cn } from "@/lib/cn";

/** Every mockup is illustrative: sample labels, placeholder brands, no real records. */
function SampleTag({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 font-mono text-[0.55rem] tracking-[0.18em] uppercase",
        dark ? "bg-white/10 text-white/60" : "bg-ink/5 text-ink/50",
      )}
    >
      Illustrative
    </span>
  );
}

function Window({ children, dark = false, url, className }: { children: ReactNode; dark?: boolean; url?: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border shadow-[0_40px_80px_-40px_rgb(17_19_38/0.55)]",
        dark ? "border-white/10 bg-midnight" : "border-line bg-white",
        className,
      )}
    >
      <div className={cn("flex items-center gap-3 border-b px-4 py-3", dark ? "border-white/10" : "border-line")}>
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff6b6b]/70" />
          <span className="size-2.5 rounded-full bg-[#ffd166]/70" />
          <span className="size-2.5 rounded-full bg-glow" />
        </span>
        {url && (
          <span className={cn("flex-1 truncate rounded-full px-3 py-1 text-center font-mono text-[0.65rem]", dark ? "bg-white/5 text-white/50" : "bg-lilac text-muted")}>
            {url}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function BrowserMockup() {
  return (
    <Window url="yourbrand.example">
      <SampleTag />
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold">YourBrand</span>
          <span className="hidden gap-4 text-[0.65rem] text-muted sm:flex">
            <span>Services</span><span>About</span><span>Work</span>
          </span>
          <span className="rounded-full bg-ink px-3 py-1 text-[0.6rem] text-white">Contact</span>
        </div>
        <div className="mt-8 grid items-center gap-6 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-mono text-[0.55rem] tracking-[0.2em] text-muted uppercase">Sample headline</p>
            <p className="mt-2 font-display text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
              Precision work, delivered with care.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-glow px-3 py-1.5 text-[0.65rem] font-medium text-navy">Get a quote</span>
              <span className="rounded-full border border-line px-3 py-1.5 text-[0.65rem]">Learn more</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-lavender via-mint to-fresh">
            <span className="absolute right-4 bottom-4 size-16 rounded-full bg-white/70 shadow-lg" />
            <span className="absolute top-5 left-5 h-10 w-20 rounded-lg bg-white/60" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {["Fast loading", "Mobile ready", "SEO-conscious"].map((t) => (
            <div key={t} className="rounded-xl border border-line p-3">
              <span className="block size-5 rounded-md bg-mint" />
              <p className="mt-2 text-[0.6rem] font-medium sm:text-[0.7rem]">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

function StorefrontMockup() {
  const products = [
    { name: "Product A", price: "₹1,499", tone: "from-lavender to-white" },
    { name: "Product B", price: "₹2,250", tone: "from-mint to-fresh" },
    { name: "Product C", price: "₹899", tone: "from-white to-lavender" },
  ];
  return (
    <div className="relative">
      <Window url="store.example">
        <SampleTag />
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-[0.65rem] text-muted">
            <Search aria-hidden className="size-3.5" /> Search products
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["All", "New", "Popular", "Under ₹1,000"].map((f, i) => (
              <span key={f} className={cn("rounded-full px-2.5 py-1 text-[0.6rem]", i === 0 ? "bg-ink text-white" : "bg-lilac text-ink/70")}>{f}</span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {products.map((p) => (
              <div key={p.name} className="rounded-xl border border-line p-2">
                <div className={cn("aspect-square rounded-lg bg-gradient-to-br", p.tone)}>
                  <span className="m-auto block size-1/2 translate-y-1/2 rounded-full bg-white/70 shadow" />
                </div>
                <p className="mt-2 text-[0.6rem] font-medium sm:text-[0.7rem]">{p.name}</p>
                <p className="text-[0.6rem] text-muted">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </Window>
      <div className="absolute -right-2 -bottom-10 w-[58%] rounded-2xl border border-line bg-white p-4 shadow-[0_30px_60px_-30px_rgb(17_19_38/0.6)] sm:-right-6">
        <p className="flex items-center gap-2 text-xs font-semibold">
          <ShoppingCart aria-hidden className="size-4" /> Cart · 2 items
        </p>
        <div className="mt-3 flex flex-col gap-2 text-[0.65rem]">
          <span className="flex justify-between"><span>Product A</span><span>₹1,499</span></span>
          <span className="flex justify-between"><span>Product C</span><span>₹899</span></span>
          <span className="flex justify-between border-t border-line pt-2 font-semibold"><span>Subtotal</span><span>₹2,398</span></span>
        </div>
        <span className="mt-3 block rounded-full bg-glow py-2 text-center text-[0.65rem] font-semibold text-navy">Checkout</span>
      </div>
    </div>
  );
}

function DashboardMockup() {
  const rows = [
    { id: "INV-1001", status: "Paid" },
    { id: "INV-1002", status: "Pending" },
    { id: "INV-1003", status: "Paid" },
  ];
  return (
    <Window dark className="text-white">
      <SampleTag dark />
      <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[120px_1fr]">
        <aside className="flex flex-col gap-2 border-r border-white/10 p-3">
          {["Overview", "Billing", "Inventory", "Team", "Reports"].map((item, i) => (
            <span key={item} className={cn("rounded-lg px-2 py-1.5 text-[0.6rem]", i === 0 ? "bg-glow/15 text-glow" : "text-white/50")}>
              <span className="hidden sm:inline">{item}</span>
              <span className="sm:hidden">{item[0]}</span>
            </span>
          ))}
        </aside>
        <div className="flex flex-col gap-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[["Sample revenue", "₹4.2L"], ["Open invoices", "12"], ["Low stock", "3"]].map(([label, value], i) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                <p className="truncate text-[0.55rem] text-white/50">{label}</p>
                <p className={cn("mt-1 font-display text-base font-semibold sm:text-lg", i === 0 && "text-glow")}>{value}</p>
              </div>
            ))}
          </div>
          <div className="flex h-24 items-end gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            {[40, 65, 50, 80, 55, 90, 70, 60, 85, 75].map((h, i) => (
              <span key={i} className={cn("flex-1 rounded-sm", i === 5 ? "bg-glow" : "bg-white/15")} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="rounded-xl border border-white/10 text-[0.6rem]">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center justify-between border-b border-white/5 px-3 py-2 last:border-0">
                <span className="font-mono text-white/70">{row.id}</span>
                <span className={cn("rounded-full px-2 py-0.5", row.status === "Paid" ? "bg-glow/15 text-glow" : "bg-white/10 text-white/60")}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

function CrmMockup() {
  const columns = [
    { title: "New", leads: ["Sample Lead · Retail", "Sample Lead · Clinic"] },
    { title: "Contacted", leads: ["Sample Lead · Builder"] },
    { title: "Proposal", leads: ["Sample Lead · Distributor", "Sample Lead · Studio"] },
    { title: "Won", leads: ["Sample Lead · Workshop"] },
  ];
  return (
    <Window url="crm.example">
      <SampleTag />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-semibold">Sales pipeline</p>
          <span className="flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 text-[0.6rem] font-medium">
            <Bell aria-hidden className="size-3" /> 2 follow-ups today
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="rounded-xl bg-lilac p-2">
              <p className="flex items-center justify-between px-1 text-[0.6rem] font-semibold text-ink/70">
                {col.title}
                <span className="text-muted">{col.leads.length}</span>
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {col.leads.map((lead) => (
                  <div key={lead} className={cn("rounded-lg border bg-white p-2", col.title === "Won" ? "border-glow" : "border-line")}>
                    <p className="text-[0.6rem] leading-tight font-medium">{lead}</p>
                    <span className="mt-1.5 block h-1 w-2/3 rounded-full bg-line" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

function AppsMockup() {
  return (
    <div className="relative pr-10 pb-6 sm:pr-16">
      <Window url="portal.example">
        <SampleTag />
        <div className="grid grid-cols-[1fr_1.4fr] gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-2">
            <p className="font-display text-sm font-semibold">Admin panel</p>
            {["Bookings", "Customers", "Staff", "Settings"].map((item, i) => (
              <span key={item} className={cn("rounded-lg px-2.5 py-1.5 text-[0.6rem]", i === 0 ? "bg-ink text-white" : "bg-lilac")}>{item}</span>
            ))}
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold"><Calendar aria-hidden className="size-3" /> This week</p>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {Array.from({ length: 15 }, (_, i) => (
                <span key={i} className={cn("aspect-square rounded-md", [3, 7, 11].includes(i) ? "bg-glow" : i % 4 === 0 ? "bg-lavender" : "bg-lilac")} />
              ))}
            </div>
          </div>
        </div>
      </Window>
      <div className="absolute right-0 bottom-0 w-[34%] max-w-[170px] rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[0_30px_60px_-20px_rgb(17_19_38/0.7)]">
        <div className="overflow-hidden rounded-[1.2rem] bg-white p-2.5">
          <span className="mx-auto block h-1 w-8 rounded-full bg-line" />
          <p className="mt-2 font-display text-[0.65rem] font-semibold">Book a slot</p>
          <div className="mt-2 grid grid-cols-2 gap-1">
            {["10:00", "11:30", "14:00", "16:30"].map((t, i) => (
              <span key={t} className={cn("rounded-md py-1 text-center text-[0.5rem]", i === 1 ? "bg-glow font-semibold text-navy" : "bg-lilac")}>{t}</span>
            ))}
          </div>
          <span className="mt-2 block rounded-full bg-ink py-1.5 text-center text-[0.5rem] text-white">Confirm</span>
        </div>
      </div>
    </div>
  );
}

function WorkflowMockup() {
  const steps = [
    { kind: "Trigger", title: "New enquiry form", detail: "Website form submitted", icon: Mail },
    { kind: "Process", title: "Route by service", detail: "Assign to the right team", icon: Webhook },
    { kind: "Action", title: "Notify and follow up", detail: "Alert team, acknowledge customer", icon: Bell },
  ];
  return (
    <div className="relative rounded-[1.75rem] border border-white/10 bg-midnight p-5 text-white sm:p-7">
      <SampleTag dark />
      <ol className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li key={step.kind} className="flex flex-col">
              <div className={cn("flex items-center gap-4 rounded-2xl border p-4", i === 2 ? "border-glow/50 bg-glow/10" : "border-white/10 bg-white/[0.03]")}>
                <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-xl", i === 2 ? "bg-glow text-navy" : "bg-white/10 text-glow")}>
                  <Icon aria-hidden className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] tracking-[0.22em] text-glow uppercase">{step.kind}</p>
                  <p className="font-display font-semibold">{step.title}</p>
                  <p className="text-xs text-white/55">{step.detail}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <svg viewBox="0 0 20 40" className="ml-[34px] h-10 w-5" aria-hidden>
                  <path d="M10 0v40" stroke="#7CFFB2" strokeWidth="2" strokeDasharray="3 5" className="animate-dash" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function IntegrationsMockup() {
  const items = [
    { label: "Payments", icon: CreditCard },
    { label: "Business APIs", icon: Webhook },
    { label: "Cloud", icon: Cloud },
    { label: "Firebase", icon: Flame },
    { label: "CRM / ERP", icon: Building },
    { label: "Analytics", icon: LineChart },
  ];
  return (
    <div className="relative aspect-square w-full rounded-[1.75rem] border border-line bg-gradient-to-br from-white to-lavender">
      <SampleTag />
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="200" cy="200" r="140" fill="none" stroke="#111326" strokeOpacity="0.1" strokeDasharray="3 6" />
        {items.map((_, i) => {
          const a = (-90 + i * 60) * (Math.PI / 180);
          return (
            <line key={i} x1="200" y1="200" x2={200 + Math.cos(a) * 140} y2={200 + Math.sin(a) * 140} stroke="#111326" strokeOpacity="0.18" strokeDasharray="4 6" className="animate-dash" />
          );
        })}
      </svg>
      <div className="absolute top-1/2 left-1/2 flex size-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink text-white shadow-[0_0_0_8px_rgb(124_255_178/0.25)]">
        <Database aria-hidden className="size-5 text-glow" />
        <span className="mt-1 text-[0.6rem] font-semibold sm:text-xs">Your system</span>
      </div>
      {items.map((item, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-line bg-white py-1.5 pr-3 pl-1.5 text-[0.6rem] font-medium whitespace-nowrap shadow-sm sm:text-xs"
            style={{ left: `${50 + Math.cos(a) * 35}%`, top: `${50 + Math.sin(a) * 35}%` }}
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-mint">
              <Icon aria-hidden className="size-3.5" />
            </span>
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

export function ServiceMockup({ visual }: { visual: ServiceVisual }) {
  switch (visual) {
    case "browser":
      return <BrowserMockup />;
    case "storefront":
      return <StorefrontMockup />;
    case "dashboard":
      return <DashboardMockup />;
    case "crm":
      return <CrmMockup />;
    case "apps":
      return <AppsMockup />;
    case "workflow":
      return <WorkflowMockup />;
    case "integrations":
      return <IntegrationsMockup />;
  }
}
