"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Header from "./components/Header";
export default function Payments() {

  return (
      <NavBar>
        <div className="px-4 py-3 bg-background min-h-screen">
          <Header />
        </div>
      </NavBar>
  );
}
