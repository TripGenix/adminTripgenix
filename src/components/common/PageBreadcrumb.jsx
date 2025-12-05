import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PageBreadcrumb({ title, paths = [] }) {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h2>

      {/* Breadcrumb Navigation */}
      <nav>
        <ol className="flex items-center gap-1.5">
          {/* Home */}
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              Home
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </li>

          {/* Dynamic segments */}
          {paths.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item}
              </span>

              {index !== paths.length - 1 && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </li>
          ))}

          {/* Final Page Title */}
          <li className="text-sm text-gray-800 dark:text-white/90 font-medium">
            {title}
          </li>
        </ol>
      </nav>
    </div>
  );
}
