import React, { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  X,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Supplier {
  id: string;
  name: string;
  phone_number_1: string;
  phone_number_2?: string;
  email?: string;
  specialty?: string;
  note?: string;
}

// Memoized row component to prevent unnecessary re-renders
const MemoizedTableRow = React.memo(
  ({
    row,
    selectedMenu,
    setSelectedMenu,
    handleEdit,
    handleDelete,
  }: {
    row: any;
    selectedMenu: string | undefined;
    setSelectedMenu: (id: string | undefined) => void;
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => void;
  }) => {
    return (
      <TableRow data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            className={cell.column.id === "actions" ? "text-center" : ""}
            style={{ width: cell.column.getSize() }}
          >
            {flexRender(cell.column.columnDef.cell, {
              ...cell.getContext(),
              selectedMenu,
              setSelectedMenu,
              handleEdit,
              handleDelete,
            })}
          </TableCell>
        ))}
      </TableRow>
    );
  }
);

MemoizedTableRow.displayName = "MemoizedTableRow";

// Function to get random color based on name
const getRandomColor = (name: string) => {
  const colors = ["bg-primary", "bg-secondary", "bg-accent"];

  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Contact info component for phone numbers
const PhoneNumbers = React.memo(
  ({ phone1, phone2 }: { phone1: string; phone2?: string }) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{phone1}</span>
        </div>
        {phone2 && (
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{phone2}</span>
          </div>
        )}
      </div>
    );
  }
);

PhoneNumbers.displayName = "PhoneNumbers";

const ActionsCell = React.memo(
  ({
    item,
    selectedMenu,
    setSelectedMenu,
    handleEdit,
    handleDelete,
  }: {
    item: Supplier;
    selectedMenu: string | undefined;
    setSelectedMenu: (id: string | undefined) => void;
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => void;
  }) => {
    const isOpen = selectedMenu === item.id;

    return (
      <div className="flex justify-center">
        <DropdownMenu
          modal={false}
          open={isOpen}
          onOpenChange={(open) => {
            setSelectedMenu(open ? item.id : undefined);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 border border-border"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => handleEdit(item.id)}
              className="font-medium text-xs flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <div className="h-px bg-border my-1" />

            <DropdownMenuItem
              onClick={() => handleDelete(item.id)}
              className="text-red-600 focus:text-red-600 font-medium text-xs flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

ActionsCell.displayName = "ActionsCell";

export const SupplierTable = React.memo(function SupplierTableComponent() {
  const [selectedMenu, setSelectedMenu] = useState<string | undefined>(
    undefined
  );

  // Hardcoded supplier data
  const data: Supplier[] = useMemo(
    () => [
      {
        id: "1",
        name: "PharmaCorp Inc.",
        phone_number_1: "+1 (555) 123-4567",
        phone_number_2: "+1 (555) 987-6543",
        email: "orders@pharmacorp.com",
        specialty: "Medications & Pharmaceuticals",
        note: "Primary supplier for all medications",
      },
      {
        id: "2",
        name: "MedSupply Co.",
        phone_number_1: "+1 (444) 234-5678",
        email: "contact@medsupply.com",
        specialty: "Medical Equipment & Supplies",
      },
      {
        id: "3",
        name: "CleanCare Ltd.",
        phone_number_1: "+1 (333) 345-6789",
        phone_number_2: "+1 (333) 111-2222",
        specialty: "Disinfectants & Cleaning Supplies",
        note: "Next day delivery available",
      },
      {
        id: "4",
        name: "FirstAid Supplies",
        phone_number_1: "+1 (222) 456-7890",
        email: "info@firstaidsupplies.com",
      },
      {
        id: "5",
        name: "HealthPlus Inc.",
        phone_number_1: "+1 (777) 567-8901",
        phone_number_2: "+1 (777) 765-4321",
        email: "orders@healthplus.com",
        specialty: "Vitamins & Supplements",
        note: "Bulk discounts available",
      },
      {
        id: "6",
        name: "SafeHands Medical",
        phone_number_1: "+1 (888) 678-9012",
        email: "supplies@safehands.com",
        specialty: "Protective Equipment",
      },
      {
        id: "7",
        name: "MedTech Solutions",
        phone_number_1: "+1 (999) 789-0123",
        phone_number_2: "+1 (999) 888-7777",
        email: "support@medtechsolutions.com",
        specialty: "Medical Devices & Technology",
        note: "24/7 technical support available",
      },
      {
        id: "8",
        name: "LabEquip Direct",
        phone_number_1: "+1 (666) 890-1234",
        email: "sales@labequipdirect.com",
      },
      {
        id: "9",
        name: "Surgical Supplies Co.",
        phone_number_1: "+1 (555) 901-2345",
        specialty: "Surgical Instruments",
      },
      {
        id: "10",
        name: "DentalCare Suppliers",
        phone_number_1: "+1 (444) 012-3456",
        phone_number_2: "+1 (444) 112-2334",
        email: "orders@dentalcaresuppliers.com",
        specialty: "Dental Equipment & Materials",
        note: "Free shipping on orders over $500",
      },
    ],
    []
  );

  const handleEdit = (id: string) => {
    console.log("Edit supplier with ID:", id);
    // Add your edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Delete supplier with ID:", id);
    // Add your delete logic here
  };

  const columns: ColumnDef<Supplier>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">NAME</span>
        ),
        cell: ({ row }) => {
          const name = row.getValue("name") as string;
          const initials = getInitials(name);
          const colorClass = getRandomColor(name);

          return (
            <div className="flex items-center gap-3">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-primary-foreground ${colorClass}`}
              >
                <span className="text-xs font-medium">{initials}</span>
              </div>
              <span className="text-xs font-semibold text-neutral-800">
                {name}
              </span>
            </div>
          );
        },
        size: 180, // Reduced from 200
      },
      {
        id: "contact",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            CONTACT
          </span>
        ),
        cell: ({ row }) => {
          const supplier = row.original;
          return (
            <div className="flex flex-col gap-2">
              <PhoneNumbers
                phone1={supplier.phone_number_1}
                phone2={supplier.phone_number_2}
              />
            </div>
          );
        },
        size: 200, // Reduced from 200
      },
      {
        id: "email",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">Email</span>
        ),
        cell: ({ row }) => {
          const supplier = row.original;
          return (
            <div className="flex flex-col gap-2">
              {supplier.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs truncate">{supplier.email}</span>
                </div>
              )}
            </div>
          );
        },
        size: 200, // Reduced from 200
      },
      {
        accessorKey: "specialty",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            SPECIALTY
          </span>
        ),
        cell: ({ row }) => {
          const specialty = row.getValue("specialty") as string;
          return (
            <span className="text-xs text-neutral-800">{specialty || "-"}</span>
          );
        },
        size: 180, // Reduced from 180
      },
      {
        accessorKey: "note",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">NOTE</span>
        ),
        cell: ({ row }) => {
          const note = row.getValue("note") as string;
          return (
            <span className="text-xs text-neutral-800">{note || "-"}</span>
          );
        },
        size: 200, // Reduced from 200
      },
      {
        id: "actions",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            ACTIONS
          </span>
        ),
        cell: ({
          row,
          selectedMenu,
          setSelectedMenu,
          handleEdit,
          handleDelete,
        }: any) => {
          const item = row.original;
          return (
            <ActionsCell
              item={item}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          );
        },
        size: 80,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className=""
                    style={{ width: header.getSize() }}
                  >
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
            table
              .getRowModel()
              .rows.map((row) => (
                <MemoizedTableRow
                  key={row.id}
                  row={row}
                  selectedMenu={selectedMenu}
                  setSelectedMenu={setSelectedMenu}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <p className="text-sm text-neutral-500">No suppliers found.</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
