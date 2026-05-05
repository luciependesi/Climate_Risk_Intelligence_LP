import React from "react";
import "./SkeletonLoader.css";

export const SkeletonLoader: React.FC<{ height?: number }> = ({ height = 80 }) => {
  return <div className="skeleton" style={{ height }} />;
};