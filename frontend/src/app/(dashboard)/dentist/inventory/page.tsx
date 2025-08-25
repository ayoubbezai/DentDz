"use client"
import NavBar from "@/components/layout/NavBar";
import Header from "./components/Header";
import {StockTable} from "./components/StockTable"
import {useState} from "react"
export default function Inventory() {
  const [activeView, setActiveView] = useState<
    "stock" | "suppliers" | "logs" | "notifications"
  >("stock");

  return (
    <>
      <NavBar>
        <div className="px-4 py-3 bg-background min-h-screen">
          <Header activeView={activeView} setActiveView={setActiveView} />
          <StockTable/>
        </div>
      </NavBar>
    </>
  );
}
