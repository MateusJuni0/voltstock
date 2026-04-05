import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ label: "Inicio", href: "/" }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className="glass rounded-xl px-4 py-2.5 mb-8 inline-flex items-center gap-1.5 text-sm"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight
                size={14}
                className="text-orange-400/30 shrink-0"
              />
            )}
            {isLast ? (
              <span className="font-semibold text-orange-400">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href ?? "/"}
                className="text-orange-400/50 hover:text-orange-400/80 transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
