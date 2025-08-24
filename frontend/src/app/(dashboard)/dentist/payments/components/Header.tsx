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
} from "lucide-react";
import ToppNavBar from "@/components/layout/TopNavBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [activeView, setActiveView] = useState("billing");

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

  // Sample data for the sections
  const billingItems = 42;
  const paymentItems = 28;

  return (
    <>
      <ToppNavBar title="Payments" search_placeholder="Search payments..." />
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
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 h-8 text-xs border-border text-muted-foreground hover:text-foreground   transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 h-8 text-xs border-border text-muted-foreground hover:text-foreground hover:bg-netural-200 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>

          <Button
            size="sm"
            className="flex items-center gap-1.5 h-8 text-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {activeView === "billing" ? "Invoice" : "Payment"}
          </Button>
        </div>
      </div>
    </>
  );
}
