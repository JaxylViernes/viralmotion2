import React from "react";
import { Search, Sparkles } from "lucide-react";
import { templateCategories } from "../../../../data/DashboardCardsData";
import { TemplateCard } from "../TemplateCard";

interface TemplatesSectionProps {
  search: string;
  setSearch: (value: string) => void;
  tab: number;
  setTab: (tab: number) => void;
  onTry: (template: string, description: string) => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  search,
  setSearch,
  tab,
  setTab,
  onTry,
}) => {
  const categories = ["For you", ...Object.keys(templateCategories)];
  const allTemplates = Object.values(templateCategories).flat();

  const displayedTemplates =
    tab === 0
      ? allTemplates
      : templateCategories[categories[tab] as keyof typeof templateCategories];

  return (
    <section className="w-full space-y-6">
      {/* Modern Header */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Templates
              </h2>
              <p className="text-sm text-gray-500">Choose from our curated collection</p>
            </div>
          </div>

          {/* Modern Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
            />
          </div>
        </div>

        {/* Modern Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => {
            const isActive = tab === index;
            return (
              <button
                key={index}
                onClick={() => setTab(index)}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {displayedTemplates
          .filter(
            (t) =>
              t.name.toLowerCase().includes(search.toLowerCase()) ||
              t.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((template) => (
            <TemplateCard
              key={template.name}
              label={template.url}
              name={template.name}
              description={template.description}
              onTry={onTry}
            />
          ))}
      </div>
    </section>
  );
};