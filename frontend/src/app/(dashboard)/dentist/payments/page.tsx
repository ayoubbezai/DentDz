"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Header from "./components/Header";
import {BillingTable} from "./components/BillingTable";
import {PatientsPaymentsTable} from "./components/PatientsPaymentsTable";
import AddModal from "./components/AddModal";

export default function Payments() {
  const [activeView, setActiveView] = useState<"billing" | "payments">(
    "billing"
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const handleAddInvoice = () => {
    console.log("Add invoice clicked - current state:", isAddModalOpen);
    setIsAddModalOpen(true);
    console.log("State should be true now");
  };

  const closeModal = () => {
    console.log("closeModal called - current state:", isAddModalOpen);
    setIsAddModalOpen(false);
    console.log("State should be false now");
  };

  // Add this useEffect to track state changes
  useEffect(() => {
    console.log("isAddModalOpen state changed to:", isAddModalOpen);
  }, [isAddModalOpen]);

  return (
    <>
      <NavBar>
        <div className="px-4 py-3 bg-background min-h-screen">
          <Header
            activeView={activeView}
            setActiveView={setActiveView}
            onAddInvoice={handleAddInvoice}
          />
          {activeView === "billing" ? (
            <BillingTable />
          ) : (
            <PatientsPaymentsTable />
          )}
        </div>
      </NavBar>
      {isAddModalOpen && (
        <AddModal isAddModalOpen={isAddModalOpen} closeModal={closeModal} />
      )}
    </>
  );
}
