import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  BarChart3,
  Users,
  Filter,
  Plus,
  Download,
  FileText,
  Receipt,
  ChevronDown,
  Calendar,
  FileSpreadsheet,
  FileTextIcon,
} from "lucide-react";
import ToppNavBar from "@/components/layout/TopNavBar";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface HeaderProps {
  activeView: "billing" | "payments";
  setActiveView: (view: "billing" | "payments") => void;
  onAddInvoice?: () => void;
}

export default function Header({
  activeView,
  setActiveView,
  onAddInvoice = () => {},
}: HeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(subMonths(new Date(), 1)), // Default to start of last month
    to: endOfMonth(subMonths(new Date(), 1)), // Default to end of last month
  });
  const exportRef = useRef<HTMLDivElement>(null);

  const financialData = {
    totalCollected: 12540.75,
    outstanding: 3240.5,
    expenses: 5875.25,
    netBalance: 6665.5,
    previousMonth: {
      totalCollected: 11800.25,
      outstanding: 2850.75,
      expenses: 5420.5,
      netBalance: 6380.25,
    },
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const changes = {
    totalCollected: calculateChange(
      financialData.totalCollected,
      financialData.previousMonth.totalCollected
    ),
    outstanding: calculateChange(
      financialData.outstanding,
      financialData.previousMonth.outstanding
    ),
    expenses: calculateChange(
      financialData.expenses,
      financialData.previousMonth.expenses
    ),
    netBalance: calculateChange(
      financialData.netBalance,
      financialData.previousMonth.netBalance
    ),
  };

  const FinancialCard = ({
    title,
    value,
    icon: Icon,
    iconColor,
    change,
    isPositiveGood = true,
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    iconColor: string;
    change: number;
    isPositiveGood?: boolean;
  }) => {
    const isPositive = change >= 0;
    const isGoodChange = isPositiveGood ? isPositive : !isPositive;
    const changeColor = isGoodChange ? "text-green-600" : "text-red-600";
    const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className="bg-background p-3 rounded-md border border-border">
        <div className="flex items-center justify-start mb-2">
          <div className={`p-1.5 pl-0 rounded-full ${iconColor}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-xs font-medium text-gray-600 ml-2">{title}</h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-foreground">
            $
            {value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <div className={`flex items-center gap-1 ${changeColor}`}>
            <span className="text-xs font-medium">
              {Math.abs(change).toFixed(1)}%
            </span>
            <ChangeIcon className={`h-3 w-3 ${!isGoodChange && "rotate-90"}`} />
          </div>
        </div>
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        exportRef.current &&
        !exportRef.current.contains(event.target as Node)
      ) {
        setExportOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting ${format} with date range:`, dateRange);
    setExportOpen(false);
    // Add your export logic here
  };

  // Sample data for the sections
  const billingItems = 42;
  const paymentItems = 28;

  return (
    <>
      <ToppNavBar
        title="Payments"
        search_placeholder={
          activeView === "billing" ? "Search Invoice Pay..." : "Search Patients Pay..."
        }
      />
      <hr className="my-3 border-border" />

      {/* Financial Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <FinancialCard
          title="Total Collected"
          value={financialData.totalCollected}
          icon={Wallet}
          iconColor="text-green-500"
          change={changes.totalCollected}
          isPositiveGood={true}
        />

        <FinancialCard
          title="Outstanding"
          value={financialData.outstanding}
          icon={AlertCircle}
          iconColor="text-amber-500"
          change={changes.outstanding}
          isPositiveGood={false}
        />

        <FinancialCard
          title="Expenses"
          value={financialData.expenses}
          icon={CreditCard}
          iconColor="text-red-500"
          change={changes.expenses}
          isPositiveGood={false}
        />

        <FinancialCard
          title="Net Balance"
          value={financialData.netBalance}
          icon={BarChart3}
          iconColor="text-blue-500"
          change={changes.netBalance}
          isPositiveGood={true}
        />
      </div>

      <hr className="my-3 border-border" />

      {/* Tabs Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-start space-x-4">
          <button
            onClick={() => setActiveView("billing")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "billing"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveView("payments")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "payments"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Patient Payments
          </button>
        </div>
      </div>

      <hr className="my-3 border-border" />

      {/* Actions Section */}
      <div className="flex items-center justify-between gap-1.5 py-2 bg-background p-3 rounded-lg border border-border">
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">
            <span className="font-semibold text-[0.95rem]">
              {activeView === "billing" ? billingItems : paymentItems}
            </span>{" "}
            {activeView === "billing" ? "Billing Items" : "Payment Records"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Date Range Picker */}

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 h-8 rounded-[4px] text-xs border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-8 rounded-[4px] text-xs border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                    {format(dateRange.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComp
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range: any) => setDateRange(range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 h-8 text-xs border-border text-muted-foreground hover:text-foreground hover:bg-neutral-200 transition-colors rounded-[4px]"
              onClick={() => setExportOpen(!exportOpen)}
            >
              <Download className="h-3.5 w-3.5" />
              Export
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>

            {exportOpen && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-border rounded-md shadow-lg z-50 py-1.5 overflow-hidden">
                <button
                  onClick={() => handleExport("csv")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="relative">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <div className="absolute -inset-1 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>
                  <span className="font-medium">CSV Export</span>
                </button>

                <div className="h-px bg-border my-1" />

                <button
                  onClick={() => handleExport("pdf")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="relative">
                    <FileTextIcon className="h-4 w-4 text-red-600" />
                    <div className="absolute -inset-1 bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>
                  <span className="font-medium">PDF Export</span>
                </button>
              </div>
            )}
          </div>
          {activeView === "billing" && (
            <Button
              size="sm"
              className="flex items-center gap-1.5 h-8 rounded-[4px] text-xs transition-colors"
              onClick={onAddInvoice}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Invoice
            </Button>
          )}
        </div>
      </div>

      <hr className="my-3 border-border" />
    </>
  );
}
