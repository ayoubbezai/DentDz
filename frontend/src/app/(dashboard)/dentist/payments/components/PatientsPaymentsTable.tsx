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
  Calendar,
  Clock,
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";
import React from "react";

interface PatientPayment {
  id: string;
  first_name: string;
  last_name: string;
  image: string;
  treatmentName: string;
  totalPrice: number;
  paidAmount: number;
  paymentMethod:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "mobile_payment"
    | "other";
  paymentDate: Date;
}

export const PatientsPaymentsTable = React.memo(
  function PatientsPaymentsTableComponent() {
    const getRandomColor = (name: string) => {
      const colors = ["bg-accent", "bg-secondary", "bg-primary"];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    };

    // Hardcoded test data with specific times
    const testData: PatientPayment[] = [
      {
        id: "1",
        first_name: "Ayoub",
        last_name: "Bezai",
        image: "/me.jpg",
        treatmentName: "Dental Cleaning",
        totalPrice: 15000,
        paidAmount: 15000,
        paymentMethod: "credit_card",
        paymentDate: new Date("2024-01-15T09:30:00"),
      },
      {
        id: "2",
        first_name: "Sarah",
        last_name: "Johnson",
        image: "",
        treatmentName: "Tooth Filling",
        totalPrice: 25000,
        paidAmount: 12500,
        paymentMethod: "cash",
        paymentDate: new Date("2024-01-14T14:45:00"),
      },
      {
        id: "3",
        first_name: "Michael",
        last_name: "Brown",
        image: "",
        treatmentName: "Root Canal",
        totalPrice: 75000,
        paidAmount: 75000,
        paymentMethod: "bank_transfer",
        paymentDate: new Date("2024-01-13T11:15:00"),
      },
      {
        id: "4",
        first_name: "Emily",
        last_name: "Davis",
        image: "",
        treatmentName: "Teeth Whitening",
        totalPrice: 45000,
        paidAmount: 45000,
        paymentMethod: "debit_card",
        paymentDate: new Date("2024-01-12T16:20:00"),
      },
      {
        id: "5",
        first_name: "David",
        last_name: "Wilson",
        image: "",
        treatmentName: "Dental Crown",
        totalPrice: 60000,
        paidAmount: 30000,
        paymentMethod: "mobile_payment",
        paymentDate: new Date("2024-01-11T10:00:00"),
      },
      {
        id: "6",
        first_name: "Jennifer",
        last_name: "Miller",
        image: "",
        treatmentName: "Dental Checkup",
        totalPrice: 10000,
        paidAmount: 10000,
        paymentMethod: "credit_card",
        paymentDate: new Date("2024-01-10T15:30:00"),
      },
      {
        id: "7",
        first_name: "Robert",
        last_name: "Taylor",
        image: "",
        treatmentName: "Tooth Extraction",
        totalPrice: 35000,
        paidAmount: 35000,
        paymentMethod: "cash",
        paymentDate: new Date("2024-01-09T08:45:00"),
      },
      {
        id: "8",
        first_name: "Lisa",
        last_name: "Anderson",
        image: "",
        treatmentName: "Dental Implant",
        totalPrice: 120000,
        paidAmount: 60000,
        paymentMethod: "bank_transfer",
        paymentDate: new Date("2024-01-08T13:10:00"),
      },
      {
        id: "9",
        first_name: "James",
        last_name: "Martinez",
        image: "",
        treatmentName: "Braces Adjustment",
        totalPrice: 20000,
        paidAmount: 20000,
        paymentMethod: "debit_card",
        paymentDate: new Date("2024-01-07T12:30:00"),
      },
      {
        id: "10",
        first_name: "Maria",
        last_name: "Garcia",
        image: "",
        treatmentName: "Gum Treatment",
        totalPrice: 55000,
        paidAmount: 55000,
        paymentMethod: "other",
        paymentDate: new Date("2024-01-06T17:00:00"),
      },
    ];

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getPaymentMethodIcon = (method: string) => {
      switch (method) {
        case "cash":
          return <Wallet className="h-3.5 w-3.5 text-green-500" />;
        case "credit_card":
          return <CreditCard className="h-3.5 w-3.5 text-primary" />;
        case "debit_card":
          return <CreditCard className="h-3.5 w-3.5 text-secondary" />;
        case "bank_transfer":
          return <Banknote className="h-3.5 w-3.5 text-indigo-500" />;
        case "mobile_payment":
          return <Smartphone className="h-3.5 w-3.5 text-accent" />;
        default:
          return <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />;
      }
    };

    const getPaymentMethodLabel = (method: string) => {
      switch (method) {
        case "cash":
          return "Cash";
        case "credit_card":
          return "Credit Card";
        case "debit_card":
          return "Debit Card";
        case "bank_transfer":
          return "Bank Transfer";
        case "mobile_payment":
          return "Mobile Payment";
        case "other":
          return "Other";
        default:
          return method;
      }
    };

    const getPaymentStatus = (paid: number, total: number) => {
      if (paid === 0)
        return {
          status: "Unpaid",
          color: "bg-red-50 border-red-200  text-red-700",
        };
      if (paid < total)
        return {
          status: "Partial",
          color: "bg-amber-50 border-amber-200  text-amber-700",
        };
      return {
        status: "Paid",
        color: "bg-green-50 border-green-200 text-green-700",
      };
    };

    const columns: ColumnDef<PatientPayment>[] = [
      {
        accessorKey: "first_name",
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
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs ${getRandomColor(
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
        accessorKey: "treatmentName",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            TREATMENT
          </span>
        ),
        cell: ({ row }) => {
          const treatmentName = row.getValue("treatmentName") as string;
          return (
            <span className="text-xs text-neutral-800">{treatmentName}</span>
          );
        },
      },
      {
        accessorKey: "totalPrice",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            TOTAL PRICE
          </span>
        ),
        cell: ({ row }) => {
          const totalPrice = row.getValue("totalPrice") as number;
          return (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-800">
                {totalPrice.toLocaleString("en-US")} DA
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "paidAmount",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            PAID AMOUNT
          </span>
        ),
        cell: ({ row }) => {
          const paidAmount = row.getValue("paidAmount") as number;
          return (
            <span className="text-xs font-semibold text-neutral-800">
              {paidAmount.toLocaleString("en-US")} DA
            </span>
          );
        },
      },
      {
        id: "status",
        header: () => (
          <span className="text-xs  font-semibold text-neutral-800 ">
            STATUS
          </span>
        ),
        cell: ({ row }) => {
          const paidAmount = row.original.paidAmount;
          const totalPrice = row.original.totalPrice;
          const status = getPaymentStatus(paidAmount, totalPrice);

          return <Badge className={` ${status.color}`}>{status.status}</Badge>;
        },
      },
      {
        accessorKey: "paymentMethod",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            PAYMENT METHOD
          </span>
        ),
        cell: ({ row }) => {
          const method = row.getValue("paymentMethod") as string;
          return (
            <div className="flex items-center gap-2">
              {getPaymentMethodIcon(method)}
              <span className="text-xs text-neutral-800 capitalize">
                {getPaymentMethodLabel(method)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "paymentDate",
        header: () => (
          <span className="text-xs font-semibold text-neutral-800">
            DATE & TIME
          </span>
        ),
        cell: ({ row }) => {
          const date = row.getValue("paymentDate") as Date;
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-xs text-neutral-800">
                  {date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {"  "}
                  {formatTime(date)}
                </span>
              </div>
            </div>
          );
        },
      },
    ];

    const table = useReactTable({
      data: testData,
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
                    No payment records found.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);
