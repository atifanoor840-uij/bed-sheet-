import type { OrderStatus } from "@/lib/db";

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-light tracking-[-0.02em]">{title}</h1>
        {sub && <p className="mt-1 text-[13px] text-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

const tones: Record<OrderStatus, string> = {
  Confirmed: "bg-sand-deep text-ink",
  Packed: "bg-[#e3ebf5] text-[#1e3a5f]",
  Shipped: "bg-[#efe7f7] text-[#4b2a6b]",
  Delivered: "bg-[#e3f1e6] text-[#1f5130]",
  Cancelled: "bg-[#fbe7e5] text-sale",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-block px-2 py-0.5 text-[11px] font-medium ${tones[status]}`}>{status}</span>;
}

export function Panel({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border border-line bg-paper ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[14px] font-medium">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const th = "px-4 py-3 text-left text-[11px] font-medium tracking-wider text-muted uppercase";
export const td = "px-4 py-3 align-middle";

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
