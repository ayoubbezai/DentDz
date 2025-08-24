"use client";

import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Patient } from "../types";

interface PatientGridProps {
  data: Patient[];
  formatDate: (date: Date) => string;
  getRandomColor: (name: string) => string;
}

export default function PatientGrid({
  data,
  formatDate,
  getRandomColor,
}: PatientGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((patient) => {
        const fullName = `${patient.first_name} ${patient.last_name}`;
        const initials = `${patient.first_name[0]}${patient.last_name[0]}`;

        // Convert lastVisit to Date object if it's a string
        const lastVisitDate =
          typeof patient.lastVisit === "string"
            ? new Date(patient.lastVisit)
            : patient.lastVisit;

        return (
          <div
            key={`${patient.first_name}-${patient.last_name}`}
            className="bg-white rounded-lg border border-border shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            {/* Patient Header with Avatar and Name */}
            <div className="flex items-center gap-3 mb-4">
              {patient.image ? (
                <img
                  src={patient.image}
                  alt={fullName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getRandomColor(
                    patient.first_name
                  )}`}
                >
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-800 truncate">
                  {fullName}
                </h3>
                <Badge
                  variant="outline"
                  className={`
                    text-xs font-medium px-1.5 py-0.5 rounded-[4px] mt-1
                    ${
                      patient.gender === "male"
                        ? "bg-blue-100 text-blue-600 border-blue-100"
                        : "bg-pink-100 text-pink-600 border-pink-100"
                    }
                  `}
                >
                  {patient.gender.charAt(0).toUpperCase() +
                    patient.gender.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              {/* Email */}
              {patient.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <span className="text-xs text-neutral-600 truncate">
                    {patient.email}
                  </span>
                </div>
              )}

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                <span className="text-xs text-neutral-600">
                  {patient.phone_number}
                </span>
              </div>

              {/* Last Visit - Improved with label */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                <span className="text-xs text-neutral-600 ">
                  Last Visit: {formatDate(lastVisitDate)}
                </span>
              </div>

              {/* Address */}
              {patient.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-600 line-clamp-2">
                    {patient.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
