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
  FileText,
  Building,
  CreditCard,
  Calendar,
  DollarSign,
  Wallet,
  Banknote,
  Smartphone,
} from "lucide-react";

interface BillingItem {
  id: string;
  title: string;
  description: string;
  supplierName: string;
  cost: number;
  paymentMethod:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "mobile_payment"
    | "other";
  date: Date;
}

interface BillingTableProps {
  data: BillingItem[];
  formatDate: (date: Date) => string;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BillingTable() {
  // Hardcoded test data
  const testData: BillingItem[] = [
    {
      id: "1",
      title: "Dental Supplies Order",
      description: "Monthly supply of gloves, masks, and disposables",
      supplierName: "Dental Supply Co.",
      cost: 1245.75,
      paymentMethod: "credit_card",
      date: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Equipment Maintenance",
      description: "Quarterly maintenance for dental chairs and equipment",
      supplierName: "MedTech Services",
      cost: 875.0,
      paymentMethod: "bank_transfer",
      date: new Date("2024-01-10"),
    },
    {
      id: "3",
      title: "Office Rent",
      description: "Monthly office space rental",
      supplierName: "Prime Real Estate",
      cost: 3200.0,
      paymentMethod: "bank_transfer",
      date: new Date("2024-01-05"),
    },
    {
      id: "4",
      title: "Software Subscription",
      description: "Annual license for practice management software",
      supplierName: "DentSoft Inc.",
      cost: 1499.99,
      paymentMethod: "debit_card",
      date: new Date("2024-01-03"),
    },
    {
      id: "5",
      title: "Utilities",
      description: "Electricity, water, and internet services",
      supplierName: "City Utilities",
      cost: 485.25,
      paymentMethod: "cash",
      date: new Date("2024-01-08"),
    },
    {
      id: "6",
      title: "Marketing Campaign",
      description: "Social media advertising and local promotions",
      supplierName: "Digital Marketing Pro",
      cost: 1200.0,
      paymentMethod: "mobile_payment",
      date: new Date("2024-01-12"),
    },
    {
      id: "7",
      title: "Lab Fees",
      description: "Crown and bridge work from external lab",
      supplierName: "Precision Dental Lab",
      cost: 1875.5,
      paymentMethod: "credit_card",
      date: new Date("2024-01-18"),
    },
    {
      id: "8",
      title: "Staff Training",
      description: "CPR certification and safety training",
      supplierName: "Healthcare Training Institute",
      cost: 650.0,
      paymentMethod: "other",
      date: new Date("2024-01-20"),
    },
    {
      id: "9",
      title: "Insurance Premium",
      description: "Monthly malpractice insurance payment",
      supplierName: "Dental Assurance Co.",
      cost: 895.0,
      paymentMethod: "bank_transfer",
      date: new Date("2024-01-25"),
    },
    {
      id: "10",
      title: "Cleaning Services",
      description: "Professional office cleaning twice monthly",
      supplierName: "Sparkle Clean Services",
      cost: 425.0,
      paymentMethod: "cash",
      date: new Date("2024-01-28"),
    },
  ];

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
        return <CreditCard className="h-3.5 w-3.5 text-gray-500" />;
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

  const columns: ColumnDef<BillingItem>[] = [
    {
      accessorKey: "title",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">TITLE</span>
      ),
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return (
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-neutral-800">
              {title}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">
          DESCRIPTION
        </span>
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <span className="text-xs text-neutral-800 line-clamp-1 max-w-[200px]">
            {description || "No description"}
          </span>
        );
      },
    },
    {
      accessorKey: "supplierName",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">SUPPLIER</span>
      ),
      cell: ({ row }) => {
        const supplierName = row.getValue("supplierName") as string;
        return (
          <div className="flex items-center gap-2">
            <Building className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-800">{supplierName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "cost",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">COST</span>
      ),
      cell: ({ row }) => {
        const cost = row.getValue("cost") as number;
        return (
          <div className="flex items-center gap-2">
            {/* <DollarSign className="h-3.5 w-3.5 text-neutral-500" /> */}
            <span className="text-xs font-semibold text-neutral-800">
              {cost.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              DA
            </span>
          </div>
        );
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
      accessorKey: "date",
      header: () => (
        <span className="text-xs font-semibold text-neutral-800">DATE</span>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-800">{formatDate(date)}</span>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: testData, // Using the hardcoded test data
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
                <p className="text-sm text-neutral-500">
                  No billing records found.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
