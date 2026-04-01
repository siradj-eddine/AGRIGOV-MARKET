import Link from "next/link";

interface Crumb {
  label: string;
  href?:  string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <Link href="/" className="text-gray-400 hover:text-primary-dark transition-colors">
            <span className="material-symbols-outlined text-base">home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.label} className="flex items-center gap-1.5">
              <span className="text-gray-200">/</span>
              {isLast ? (
                <span aria-current="page" className="font-medium text-gray-900">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href ?? "#"}
                  className="text-gray-400 hover:text-primary-dark transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}