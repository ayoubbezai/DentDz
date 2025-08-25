"use client";
import NavBar from "@/components/layout/NavBar";
import Header from "./components/Header";
import { StockTable } from "./components/StockTable";
import AddModal from "./components/AddModal";
import { useState } from "react";
export default function Inventory() {
  const [activeView, setActiveView] = useState<
    "stock" | "suppliers" | "logs" | "notifications"
  >("stock");

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsAddModalOpen(false);
  };
  const AddStock = () => {
    setIsAddModalOpen(true);
  };

  return (
    <>
      <NavBar>
        <div className="px-4 py-3 bg-background min-h-screen">
          <Header
            activeView={activeView}
            setActiveView={setActiveView}
            onAddItem={AddStock}
          />
          <StockTable />
        </div>

        {isAddModalOpen && (
          <AddModal isAddModalOpen={isAddModalOpen} closeModal={closeModal} />
        )}
      </NavBar>
    </>
  );
}
