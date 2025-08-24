"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Header from "./components/Header";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient } from "./types";
import { Mail, Phone, Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddModal from "./components/AddModal";
import { patientData } from "./constant";
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
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .then(() => setIsFullScreen(true))
          .catch((err) =>
            console.error(
              `Error attempting to enable fullscreen: ${err.message}`
            )
          );
      } else {
        document
          .exitFullscreen()
          .then(() => setIsFullScreen(false))
          .catch((err) =>
            console.error(`Error attempting to exit fullscreen: ${err.message}`)
          );
      }
    };

    useEffect(() => {
      const handleChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
      };
      document.addEventListener("fullscreenchange", handleChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleChange);
      };
    }, []);

  useEffect(() => {
    if (isAddModalOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
      // Small delay to allow DOM update before triggering transition
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAddModalOpen]);

  const closeModal = () => {
    setIsAddModalOpen(false);
  };

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "patient_name",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">
          PATIENT NAME
        </span>
      ),
      cell: ({ row }) => {
        const patient = row.original;
        const fullName = `${patient.first_name} ${patient.last_name}`;
        const initials = `${patient.first_name[0]}${patient.last_name[0]}`;

        return (
          <div className="flex items-center gap-3">
            {patient.image ? (
              <img
                src={patient.image}
                alt={fullName}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs  ${getRandomColor(
                  patient.first_name
                )}`}
              >
                {initials}
              </div>
            )}
            <span className="text-xs font-semibold text-neutral-800">
              {fullName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">EMAIL</span>
      ),
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return (
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-800">{email || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "phone_number",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">PHONE</span>
      ),
      cell: ({ row }) => {
        const phone = row.getValue("phone_number") as string;
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-800">{phone}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">GENDER</span>
      ),
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string;
        return (
          <Badge
            variant="outline"
            className={`
              text-xs font-medium px-2 py-0.5 rounded-[4px]
              ${
                gender === "male"
                  ? "bg-blue-100 text-blue-600 border-blue-100"
                  : "bg-pink-100 text-pink-600 border-pink-100"
              }
            `}
          >
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastVisit",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">
          LAST VISIT
        </span>
      ),
      cell: ({ row }) => {
        const date = row.getValue("lastVisit") as Date;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-800">{formatDate(date)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">ADDRESS</span>
      ),
      cell: ({ row }) => {
        const address = row.getValue("address") as string;
        return (
          <span className="text-xs text-neutral-800">{address || "N/A"}</span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
          toggleFullscreen={toggleFullscreen}
          isFullScreen={isFullScreen}
        />

        <hr className="my-4 border-border" />

        {viewMode === "list" ? (
          <div className="rounded-lg border border-border bg-white shadow-sm">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <p className="text-sm text-neutral-500">
                        No patients found.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Grid view content would go here */}
            <div className="p-4 rounded-lg border border-border bg-white text-center">
              <p className="text-sm text-neutral-500">Grid view coming soon</p>
            </div>
          </div>
        )}
      </div>
      {isAddModalOpen && (
        <div
          className={`fixed inset-0 
  bg-[rgba(156,163,175,0.4)]   /* Tailwind gray-400 with 40% opacity */
  transition-opacity duration-300 z-40
  ${isVisible ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {/* Modal Sidebar */}
      {isAddModalOpen && (
        <AddModal
          isVisible={isVisible}
          closeModal={closeModal}
          toggleFullscreen={toggleFullscreen}
          isFullScreen={isFullScreen}
        />
      )}
    </NavBar>
  );
}
