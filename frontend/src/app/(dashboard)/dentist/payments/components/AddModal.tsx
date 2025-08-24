"use client";
import React, { useState } from "react";
import {
  X,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface AddModalProps {
  isAddModalOpen: boolean;
  closeModal: () => void;
}

// Define payment method options with their properties
const paymentMethods = [
  { value: "cash", label: "Cash", icon: Wallet, color: "text-green-500" },
  {
    value: "credit_card",
    label: "Credit Card",
    icon: CreditCard,
    color: "text-primary",
  },
  {
    value: "debit_card",
    label: "Debit Card",
    icon: CreditCard,
    color: "text-secondary",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    icon: Banknote,
    color: "text-indigo-500",
  },
  {
    value: "mobile_payment",
    label: "Mobile Payment",
    icon: Smartphone,
    color: "text-accent",
  },
  {
    value: "other",
    label: "Other",
    icon: MoreHorizontal,
    color: "text-gray-500",
  },
];

export default function AddModal({
  isAddModalOpen,
  closeModal,
}: AddModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    supplier: "",
    cost: "",
    paymentMethod: "",
    otherPaymentMethod: "", // For the "Other" payment method input
  });

  const [showOtherInput, setShowOtherInput] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    if (value === "other") {
      setShowOtherInput(true);
      updateFormData("paymentMethod", "other");
    } else {
      setShowOtherInput(false);
      updateFormData("paymentMethod", value);
      updateFormData("otherPaymentMethod", ""); // Clear other input when switching
    }
  };

  const handleSubmit = () => {
    // Determine the final payment method value
    const finalPaymentMethod =
      formData.paymentMethod === "other"
        ? formData.otherPaymentMethod
        : formData.paymentMethod;

    // Validate required fields
    if (
      !formData.title ||
      !formData.supplier ||
      !formData.cost ||
      !finalPaymentMethod
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Prepare data for submission
    const submitData = {
      title: formData.title,
      description: formData.description,
      supplier: formData.supplier,
      cost: parseFloat(formData.cost),
      paymentMethod: finalPaymentMethod,
    };

    // Log the data (replace with actual API call)
    console.log("Submitting invoice:", submitData);

    // Close modal after submission
    closeModal();

    // Reset form
    setFormData({
      title: "",
      description: "",
      supplier: "",
      cost: "",
      paymentMethod: "",
      otherPaymentMethod: "",
    });
    setShowOtherInput(false);
  };

  return (
    <Modal
      isAddModalOpen={isAddModalOpen}
      closeModal={closeModal}
      title={"Add Invoice"}
    >
      <div className="p-4 flex flex-col h-[calc(93vh-57px)]">
        {/* Form content */}
        <div className="flex-1 overflow-y-auto scrollbar-custom mb-3">
          <div className="space-y-4 px-1 pb-1">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-medium text-neutral-700"
              >
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                required
                className="h-9 text-sm placeholder:text-xs"
                placeholder="Invoice title"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-medium text-neutral-700"
              >
                Description{" "}
                <span className="text-neutral-400 text-[0.7rem] font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="h-9 text-sm placeholder:text-xs"
                placeholder="Invoice description"
              />
            </div>

            {/* Supplier */}
            <div className="space-y-1.5">
              <Label
                htmlFor="supplier"
                className="text-xs font-medium text-neutral-700"
              >
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => updateFormData("supplier", e.target.value)}
                required
                className="h-9 text-sm placeholder:text-xs"
                placeholder="Supplier name"
              />
            </div>

            {/* Cost */}
            <div className="space-y-1.5">
              <Label
                htmlFor="cost"
                className="text-xs font-medium text-neutral-700"
              >
                Cost <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => updateFormData("cost", e.target.value)}
                required
                className="h-9 text-sm placeholder:text-xs"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <Label
                htmlFor="paymentMethod"
                className="text-xs font-medium text-neutral-700"
              >
                Payment Method <span className="text-red-500">*</span>
              </Label>
              <Select
                required
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
              >
                <SelectTrigger
                  id="paymentMethod"
                  className="h-9 text-xs placeholder:text-xs"
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent
                            className={`h-3.5 w-3.5 ${method.color}`}
                          />
                          <span>{method.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Other Payment Method Input (shown only when "Other" is selected) */}
            {showOtherInput && (
              <div className="space-y-1.5 animate-fadeIn">
                <Label
                  htmlFor="otherPaymentMethod"
                  className="text-xs font-medium text-neutral-700"
                >
                  Specify Payment Method <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="otherPaymentMethod"
                  value={formData.otherPaymentMethod}
                  onChange={(e) =>
                    updateFormData("otherPaymentMethod", e.target.value)
                  }
                  required={showOtherInput}
                  className="h-9 text-sm placeholder:text-xs"
                  placeholder="Enter payment method"
                />
              </div>
            )}
          </div>
        </div>

        {/* Fixed button section at the bottom */}
        <div className="flex justify-between mt-auto">
          <Button
            variant="outline"
            onClick={closeModal}
            className="text-xs py-1 px-3 h-8"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="text-xs py-1 px-3 h-8">
            Add Invoice
          </Button>
        </div>
      </div>
    </Modal>
  );
}
