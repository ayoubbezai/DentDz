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
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StockItem {
  id: string;
  name: string;
  category: string;
  currentAmount: number;
  reorderLevel: number;
  unit: string;
  expiryDate: Date;
  supplierName: string;
  status: "normal" | "low" | "expired" | "out-of-stock";
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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
            className={
              cell.column.id === "currentAmount" ||
              cell.column.id === "reorderLevel" ||
              cell.column.id === "actions"
                ? "text-center"
                : ""
            }
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

// Memoized cell components for better performance
const StatusBadge = React.memo(({ status }: { status: string }) => {
  return (
    <Badge
      variant="outline"
      className={`
        text-xs font-medium px-2 py-0.5 rounded-[4px]
        ${
          status === "normal"
            ? "bg-green-50 text-green-700 border-green-200"
            : status === "low"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : status === "expired"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-gray-50 text-gray-700 border-gray-200"
        }
      `}
    >
      {status === "normal"
        ? "Normal"
        : status === "low"
        ? "Low"
        : status === "expired"
        ? "Expired"
        : "Out"}
    </Badge>
  );
});

StatusBadge.displayName = "StatusBadge";

const ActionsCell = React.memo(
  ({
    item,
    selectedMenu,
    setSelectedMenu,
    handleEdit,
    handleDelete,
  }: {
    item: StockItem;
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

export const StockTable = React.memo(function StockTableComponent() {
  // Set today's date to 25/08/2025
  const today = useMemo(() => new Date(2025, 7, 25), []); // Month is 0-indexed (7 = August)

  const [selectedMenu, setSelectedMenu] = useState<string | undefined>(
    undefined
  );

  // Function to determine status based on current date
  const determineStatus = (
    currentAmount: number,
    reorderLevel: number,
    expiryDate: Date
  ): StockItem["status"] => {
    if (currentAmount === 0) return "out-of-stock";
    if (expiryDate < today) return "expired";
    if (currentAmount <= reorderLevel) return "low";
    return "normal";
  };

  // Hardcoded data with updated dates for 2025 context
  const data: StockItem[] = useMemo(
    () =>
      [
        {
          id: "1",
          name: "Paracetamol 500mg",
          category: "Medication",
          currentAmount: 150,
          reorderLevel: 50,
          unit: "tablets",
          expiryDate: new Date("2025-12-15"),
          supplierName: "PharmaCorp Inc.",
          status: "normal",
        },
        {
          id: "2",
          name: "Insulin Syringes",
          category: "Medical Supplies",
          currentAmount: 45,
          reorderLevel: 50,
          unit: "pieces",
          expiryDate: new Date("2026-03-20"),
          supplierName: "MedSupply Co.",
          status: "low",
        },
        {
          id: "3",
          name: "Antiseptic Solution",
          category: "Disinfectants",
          currentAmount: 12,
          reorderLevel: 25,
          unit: "bottles",
          expiryDate: new Date("2024-06-30"), // Expired (before 2025)
          supplierName: "CleanCare Ltd.",
          status: "expired",
        },
        {
          id: "4",
          name: "Bandages",
          category: "First Aid",
          currentAmount: 0,
          reorderLevel: 30,
          unit: "rolls",
          expiryDate: new Date("2026-01-10"),
          supplierName: "FirstAid Supplies",
          status: "out-of-stock",
        },
        {
          id: "5",
          name: "Vitamin C Tablets",
          category: "Supplements",
          currentAmount: 80,
          reorderLevel: 40,
          unit: "tablets",
          expiryDate: new Date("2024-11-15"), // Expired (before 2025)
          supplierName: "HealthPlus Inc.",
          status: "expired",
        },
        {
          id: "6",
          name: "Surgical Gloves",
          category: "Medical Supplies",
          currentAmount: 200,
          reorderLevel: 75,
          unit: "pairs",
          expiryDate: new Date("2026-08-22"),
          supplierName: "SafeHands Medical",
          status: "normal",
        },
        {
          id: "7",
          name: "Alcohol Swabs",
          category: "Disinfectants",
          currentAmount: 28,
          reorderLevel: 50,
          unit: "packs",
          expiryDate: new Date("2025-09-05"),
          supplierName: "CleanCare Ltd.",
          status: "low",
        },
        {
          id: "8",
          name: "Blood Pressure Monitor",
          category: "Equipment",
          currentAmount: 8,
          reorderLevel: 5,
          unit: "units",
          expiryDate: new Date("2027-05-15"),
          supplierName: "MedTech Solutions",
          status: "normal",
        },
        {
          id: "9",
          name: "Gauze Pads",
          category: "First Aid",
          currentAmount: 0,
          reorderLevel: 20,
          unit: "packs",
          expiryDate: new Date("2026-10-30"),
          supplierName: "FirstAid Supplies",
          status: "out-of-stock",
        },
        {
          id: "10",
          name: "Antibiotic Ointment",
          category: "Medication",
          currentAmount: 18,
          reorderLevel: 15,
          unit: "tubes",
          expiryDate: new Date("2024-08-10"), // Expired (before 2025)
          supplierName: "PharmaCorp Inc.",
          status: "expired",
        },
      ].map((item) => ({
        ...item,
        status: determineStatus(
          item.currentAmount,
          item.reorderLevel,
          item.expiryDate
        ),
      })),
    [today]
  );

  const handleEdit = (id: string) => {
    console.log("Edit item with ID:", id);
    // Add your edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    // Add your delete logic here
  };

  const getStatusIcon = (status: StockItem["status"]) => {
    switch (status) {
      case "normal":
        return (
          <div className="h-7 w-7 rounded-full flex items-center justify-center bg-green-100">
            <CheckCircle className="h-3.5 w-3.5 text-green-700   " />
          </div>
        );
      case "low":
        return (
          <div className="h-7 w-7 rounded-full flex items-center justify-center bg-amber-100">
            <AlertCircle className="h-3.5 w-3.5 text-amber-700 " />
          </div>
        );
      case "expired":
        return (
          <div className="h-7 w-7 rounded-full flex items-center justify-center bg-red-100">
            <XCircle className="h-3.5 w-3.5 text-red-600" />
          </div>
        );

      case "out-of-stock":
        return (
          <div className="h-7 w-7 rounded-full flex items-center justify-center bg-gray-100">
            <XCircle className="h-3.5 w-3.5 text-gray-600" />
          </div>
        );
      default:
        return (
          <div className="h-7 w-7 rounded-full flex items-center justify-center bg-gray-100">
            <AlertCircle className="h-3.5 w-3.5 text-gray-600" />
          </div>
        );
    }
  };

  const columns: ColumnDef<StockItem>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">NAME</span>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-3">
              {getStatusIcon(item.status)}

              <span className="text-xs font-semibold text-neutral-800">
                {item.name}
              </span>
            </div>
          );
        },
        size: 200, // Set column width
      },
      {
        accessorKey: "category",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            CATEGORY
          </span>
        ),
        cell: ({ row }) => {
          const category = row.getValue("category") as string;
          return <span className="text-xs text-neutral-800">{category}</span>;
        },
        size: 120, // Set column width
      },
      {
        accessorKey: "currentAmount",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            CURRENT
          </span>
        ),
        cell: ({ row }) => {
          const amount = row.getValue("currentAmount") as number;
          const item = row.original;
          return (
            <span
              className={`text-xs font-medium text-center ${
                item.status === "out-of-stock"
                  ? "text-red-600"
                  : item.status === "low"
                  ? "text-amber-600"
                  : "text-neutral-800"
              }`}
            >
              {amount.toLocaleString()}
            </span>
          );
        },
        size: 80, // Set column width
      },
      {
        accessorKey: "reorderLevel",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            REORDER
          </span>
        ),
        cell: ({ row }) => {
          const level = row.getValue("reorderLevel") as number;
          return (
            <span className="text-xs text-neutral-800 text-center">
              {level.toLocaleString()}
            </span>
          );
        },
        size: 80, // Set column width
      },
      {
        accessorKey: "unit",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">UNIT</span>
        ),
        cell: ({ row }) => {
          const unit = row.getValue("unit") as string;
          return <span className="text-xs text-neutral-800">{unit}</span>;
        },
        size: 80, // Set column width
      },
      {
        accessorKey: "expiryDate",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">EXPIRY</span>
        ),
        cell: ({ row }) => {
          const date = row.getValue("expiryDate") as Date;
          const item = row.original;
          return (
            <span
              className={`text-xs ${
                item.status === "expired"
                  ? "text-red-600 font-medium"
                  : "text-neutral-800"
              }`}
            >
              {formatDate(date)}
            </span>
          );
        },
        size: 100, // Set column width
      },
      {
        accessorKey: "supplierName",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            SUPPLIER
          </span>
        ),
        cell: ({ row }) => {
          const supplier = row.getValue("supplierName") as string;
          return <span className="text-xs text-neutral-800">{supplier}</span>;
        },
        size: 140, // Set column width
      },
      {
        accessorKey: "status",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">STATUS</span>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return <StatusBadge status={status} />;
        },
        size: 90, // Set column width
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
    [getStatusIcon]
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
                <p className="text-sm text-neutral-500">
                  No stock items found.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});
