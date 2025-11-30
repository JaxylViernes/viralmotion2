import React from "react";
import { Layers, Upload, Database, Film } from "lucide-react";
import { TemplatesSection } from "./TemplatesSection";
import { useHomeSectionHooks } from "../../../../hooks/dashboardhooks/Home";
import { useTemplateSectionHooks } from "../../../../hooks/dashboardhooks/TemplatesSectionHooks";
import { TemplatePreviewDialog } from "../TemplatePreviewDialog";
import { ShowcaseCarousel } from "../../ShowcaseCarousel";

interface Project {
  id: string;
  title: string;
  projectVidUrl: string;
}

interface Render {
  id: string;
  type: string;
  outputUrl: string;
  renderedAt?: string;
}

interface HomeSectionProps {
  search: string;
  setSearch: (value: string) => void;
  projects?: Project[];
  renders?: Render[];
  uploads?: any[];
  datasets?: any[];
}

// Modern Stat Card Component
const ModernStatCard: React.FC<{
  title: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
}> = ({ title, count, icon, gradient }) => {
  return (
    <div className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Floating orb effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h3 className={`text-4xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            {count}
          </h3>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const HomeSection: React.FC<HomeSectionProps> = ({
  projects = [],
  renders = [],
  uploads = [],
  datasets = [],
}) => {
  const { tab, setTab } = useTemplateSectionHooks();
  const {
    handleOpenPreview,
    search,
    setSearch,
    selectedTemplate,
    handleClosePreview,
    selectedDescription,
  } = useHomeSectionHooks();

  return (
    <div className="w-full px-2 sm:px-6 lg:px-4 py-2 space-y-12">
      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernStatCard
          title="Your Designs"
          count={projects.length}
          icon={<Layers className="text-white" size={24} />}
          gradient="from-blue-500 to-cyan-500"
        />
        <ModernStatCard
          title="Your Uploads"
          count={uploads.length}
          icon={<Upload className="text-white" size={24} />}
          gradient="from-green-500 to-emerald-500"
        />
        <ModernStatCard
          title="Your Datasets"
          count={datasets.length}
          icon={<Database className="text-white" size={24} />}
          gradient="from-purple-500 to-pink-500"
        />
        <ModernStatCard
          title="Your Renders"
          count={renders.length}
          icon={<Film className="text-white" size={24} />}
          gradient="from-orange-500 to-red-500"
        />
      </div>

      {/* Templates Section */}
      <TemplatesSection
        onTry={handleOpenPreview}
        search={search}
        setSearch={setSearch}
        setTab={setTab}
        tab={tab}
      />
      
      <TemplatePreviewDialog
        open={!!selectedTemplate}
        onClose={handleClosePreview}
        selectedTemplate={selectedTemplate}
        selectedDescription={selectedDescription}
      />

      {/* Recently Created Templates */}
      {projects.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recently Created Templates
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Your most recent template projects, ready to edit or share.
          </p>
          <ShowcaseCarousel items={projects.slice(0, 5)} type="project" />
        </div>
      )}

      {/* Recently Rendered Videos */}
      {renders.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recently Rendered Videos
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Your latest video renders, ready to watch or download.
          </p>
          <ShowcaseCarousel items={renders.slice(0, 5)} type="render" />
        </div>
      )}
    </div>
  );
};