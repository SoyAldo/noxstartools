import React from 'react';

interface ToolLayoutProps {
  title: React.ReactNode;
  controls: React.ReactNode;
  preview: React.ReactNode;
  controlsWidth?: string;
  previewWidth?: string;
}

export default function ToolLayout({ 
  title, 
  controls, 
  preview,
  controlsWidth = "w-full lg:w-5/12 xl:w-4/12",
  previewWidth = "w-full lg:w-7/12 xl:w-8/12"
}: ToolLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
      <section className={`${controlsWidth} bg-canvas lg:bg-panel lg:border-r border-panel-border flex flex-col h-full overflow-hidden`}>
        <header className="p-4 lg:p-6 border-b border-panel-border bg-panel/50 z-10 shrink-0">
          {title}
        </header>
        <div className="p-4 lg:p-6 overflow-y-auto flex-1">
          {controls}
        </div>
      </section>
      
      <section className={`${previewWidth} bg-[#000000] flex flex-col relative h-[50vh] lg:h-full overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]`}>
        {preview}
      </section>
    </div>
  );
}
