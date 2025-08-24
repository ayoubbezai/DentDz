"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Header from "./components/Header";

import { Patient } from "./types";
import AddModal from "./components/AddModal";
import { patientData } from "./constant";
import PatientTable from "./components/PatientTable";
import PatientGrid from "./components/PatientGrid";

// Sample data

// Function to generate random background color based on name
const getRandomColor = (name: string) => {
  const colors = ["bg-primary", "bg-secondary", "bg-accent"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function PatientsList() {
  const [activeView, setActiveView] = useState("active");
  const [viewMode, setViewMode] = useState("list");
  const [data] = useState<Patient[]>(patientData);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsAddModalOpen(false);
  };

  const patientCounts = {
    active: 72,
    archive: 23,
  };

  const handleAddPatient = () => {
    console.log("Add patient clicked");
    setIsAddModalOpen(true);
  };

  const handleFilterClick = () => {
    console.log("Filter clicked");
  };

  return (
    <NavBar>
      <div className="px-4 py-3 bg-background min-h-screen">
        <Header
          activeView={activeView}
          viewMode={viewMode}
          onViewChange={setActiveView}
          onViewModeChange={setViewMode}
          patientCounts={patientCounts}
          onAddPatient={handleAddPatient}
          onFilterClick={handleFilterClick}
        />

        <hr className="my-4 border-border" />

        {viewMode === "list" ? (
          <PatientTable
            data={data}
            formatDate={formatDate}
            getRandomColor={getRandomColor}
          />
        ) : (
          <PatientGrid
            data={data}
            formatDate={formatDate}
            getRandomColor={getRandomColor}
          />
        )}
      </div>

      {/* Modal Sidebar */}
      {isAddModalOpen && (
        <AddModal isAddModalOpen={isAddModalOpen} closeModal={closeModal} />
      )}
    </NavBar>
  );
}
