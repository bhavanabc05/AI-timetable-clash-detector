import React from "react";
import UploadSection from "../components/sections/UploadSection";
import ResultsSection from "../components/sections/ResultsSection";

export default function Home({ 
  onUpload, 
  loading, 
  error, 
  onReset, 
  clashes, 
  suggestions 
}) {
  return (
    <div className="page-content home-layout">
      {/* Centered Upload Section */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <UploadSection
          onUpload={onUpload}
          loading={loading}
          error={error}
          onReset={onReset}
        />
        <ResultsSection clashes={clashes} suggestions={suggestions} />
      </div>
    </div>
  );
}