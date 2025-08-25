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
import { Patient } from "../types";
import { Mail, Phone, Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatientTableProps {
  data: Patient[];
  formatDate: (date: Date) => string;
  getRandomColor: (name: string) => string;
}
export default function PatientTable({ data, formatDate, getRandomColor }: PatientTableProps) {
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
              ${
                gender === "male"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-pink-50 text-pink-700 border-pink-200"
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
  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <p className="text-sm text-neutral-500">No patients found.</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
