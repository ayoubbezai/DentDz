import {
  AlertCircle,
  Box,
  Package,
  Clock,
  XCircle,
  Filter,
  Plus,
  Download,
  FileText,
  ChevronDown,
  Calendar,
  FileSpreadsheet,
  FileTextIcon,
} from "lucide-react";
import ToppNavBar from "@/components/layout/TopNavBar";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface HeaderProps {
  activeView: "stock" | "suppliers" | "logs" | "notifications";
  setActiveView: (
    view: "stock" | "suppliers" | "logs" | "notifications"
  ) => void;
  onAddItem?: () => void;
  
}

export default function Header({
  activeView,
  setActiveView,
  onAddItem = () => {},
}: HeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(subMonths(new Date(), 1)),
  });
  const exportRef = useRef<HTMLDivElement>(null);

  const inventoryData = {
    totalItems: 1247,
    needReorder: 42,
    expired: 7,
    outOfStock: 23,
  };

  const InventoryCard = ({
    title,
    value,
    icon: Icon,
    iconColor,
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    iconColor: string;
  }) => {
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
            {value.toLocaleString("en-US")} 
          </p>
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
  const stockItems = inventoryData.totalItems;
  const supplierItems = 28;
  const logItems = 156;
  const notificationItems = 12;

  return (
    <>
      <ToppNavBar title="Inventory" search_placeholder="Search In Stock..." />
      <hr className="my-3 border-border" />

      {/* Inventory Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <InventoryCard
          title="Total Items"
          value={inventoryData.totalItems}
          icon={Box}
          iconColor="text-blue-500"
        />

        <InventoryCard
          title="Need Reorder"
          value={inventoryData.needReorder}
          icon={Package}
          iconColor="text-amber-500"
        />

        <InventoryCard
          title="Expired"
          value={inventoryData.expired}
          icon={Clock}
          iconColor="text-purple-500"
        />

        <InventoryCard
          title="Out of Stock"
          value={inventoryData.outOfStock}
          icon={XCircle}
          iconColor="text-gray-500"
        />
      </div>

      <hr className="my-3 border-border" />

      {/* Tabs Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-start space-x-4">
          <button
            onClick={() => setActiveView("stock")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "stock"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Stock
          </button>
          <button
            onClick={() => setActiveView("suppliers")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "suppliers"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Suppliers
          </button>
          <button
            onClick={() => setActiveView("logs")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "logs"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Logs
          </button>
          <button
            onClick={() => setActiveView("notifications")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "notifications"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Notifications
          </button>
        </div>
      </div>
      <hr className="mb-3 border-border" />

      {/* Actions Section */}
      <div className="flex items-center justify-between gap-1.5 py-2 bg-background p-3 rounded-lg border border-border">
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">
            <span className="font-semibold text-[0.95rem]">
              {activeView === "stock" && stockItems}
              {activeView === "suppliers" && supplierItems}
              {activeView === "logs" && logItems}
              {activeView === "notifications" && notificationItems}
            </span>{" "}
            {activeView === "stock" && "Inventory Items"}
            {activeView === "suppliers" && "Suppliers"}
            {activeView === "logs" && "Log Entries"}
            {activeView === "notifications" && "Notifications"}
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

          {activeView === "stock" && (
            <Button
              size="sm"
              className="flex items-center gap-1.5 h-8 rounded-[4px] text-xs transition-colors"
              onClick={onAddItem}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      <hr className="my-3 border-border" />
    </>
  );
}
