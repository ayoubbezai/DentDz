"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Header from "./components/Header";
import BillingTable from "./components/BillingTable"
export default function Payments() {
      const [activeView, setActiveView] = useState<"billing" | "payments">(
        "billing"
      );

  return (
    <NavBar>
      <div className="px-4 py-3 bg-background min-h-screen">
        <Header activeView={activeView} setActiveView={setActiveView} />
        {activeView === "billing" ? <BillingTable /> : <div></div>}
      </div>
    </NavBar>
  );
}
