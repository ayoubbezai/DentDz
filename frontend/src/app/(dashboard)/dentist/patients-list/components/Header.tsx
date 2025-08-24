import { Button } from "@/components/ui/button";
import {
  Users,
  Filter,
  Grid,
  List,
  Plus,

} from "lucide-react";
import { HeaderProps } from "../types";

import { useEffect, useState } from "react";
import { useGlobalUI } from "@/context/GlobalUIContext";
import ToppNavBar from "@/components/layout/TopNavBar";


export default function Header({
  activeView,
  viewMode,
  onViewChange,
  onViewModeChange,
  patientCounts,
  onAddPatient = () => {},
  onFilterClick = () => {},

}: HeaderProps) {



  return (
    <>
      <ToppNavBar
        title="Patients List"
        search_placeholder="search for a patient ..."
      />
      <hr className="my-3 border-border" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-start space-x-4">
          <button
            onClick={() => onViewChange("active")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "active"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Active Patients
          </button>
          <button
            onClick={() => onViewChange("archive")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "archive"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Archive Patients
          </button>
        </div>
      </div>
      <hr className="my-3 border-border" />

      <div className="flex items-center justify-between gap-1.5 py-2  bg-background p-3 rounded-lg border border-border">
        <div className="flex items-center gap-1.5 ">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">
            <span className="font-semibold text-[0.95rem]">
              {activeView === "active"
                ? patientCounts.active
                : patientCounts.archive}
            </span>{" "}
            Total Patients
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 h-7 text-xs border-border text-muted-foreground/70 hover:text-foreground hover:bg-neutral-100 transition-colors"
            onClick={onFilterClick}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>

          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-[5px] relative transition-colors ${
                viewMode === "grid"
                  ? "text-primary"
                  : "text-muted-foreground/70 hover:text-foreground"
              }`}
            >
              {viewMode === "grid" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all"></div>
              )}
              <Grid className="h-4 w-4" />
            </button>
            <div className="h-4 w-px bg-border"></div>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-[5px] relative transition-colors ${
                viewMode === "list"
                  ? "text-primary"
                  : "text-muted-foreground/70 hover:text-foreground"
              }`}
            >
              {viewMode === "list" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all"></div>
              )}
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            className="flex items-center rounded-[4px] gap-1.5 h-7 text-xs transition-colors"
            onClick={onAddPatient}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Patient
          </Button>
        </div>
      </div>
    </>
  );
}
