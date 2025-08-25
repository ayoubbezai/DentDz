"use client";
import React, { useState } from "react";
import { X, Package, CalendarIcon, MoreHorizontal } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";

export interface AddModalProps {
  isAddModalOpen: boolean;
  closeModal: () => void;
}

// Define dental-specific category options
const categories = [
  { value: "anesthetics", label: "Anesthetics" },
  { value: "restorative", label: "Restorative Materials" },
  { value: "impression", label: "Impression Materials" },
  { value: "endodontic", label: "Endodontic Supplies" },
  { value: "prosthetic", label: "Prosthetic Materials" },
  { value: "hygiene", label: "Oral Hygiene Products" },
  { value: "sterilization", label: "Sterilization Supplies" },
  { value: "equipment", label: "Equipment Parts" },
  { value: "medications", label: "Medications" },
  { value: "other", label: "Other", isOther: true },
];

// Define unit options
const units = [
  { value: "piece", label: "Piece" },
  { value: "box", label: "Box" },
  { value: "pack", label: "Pack" },
  { value: "tube", label: "Tube" },
  { value: "bottle", label: "Bottle" },
  { value: "cartridge", label: "Cartridge" },
  { value: "roll", label: "Roll" },
  { value: "other", label: "Other", isOther: true },
];

// Hardcoded supplier options
const suppliers = [
  { value: "dental_supply_co", label: "Dental Supply Co." },
  { value: "oral_care_inc", label: "Oral Care Inc." },
  { value: "dental_depot", label: "Dental Depot" },
  { value: "smile_supplies", label: "Smile Supplies" },
  { value: "other", label: "Other", isOther: true },
];

// Date utility functions
function isValidDate(dateString: string): boolean {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!regex.test(dateString)) return false;

  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Check if the date is valid
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function formatDate(date: Date | undefined): string {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDate(dateString: string): Date | undefined {
  if (!isValidDate(dateString)) return undefined;

  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

export default function AddModal({
  isAddModalOpen,
  closeModal,
}: AddModalProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    unit: "",
    currentAmount: "",
    reorderLevel: "",
    supplier: "",
    expiryDate: "",
  });

  const [otherCategory, setOtherCategory] = useState("");
  const [otherUnit, setOtherUnit] = useState("");
  const [otherSupplier, setOtherSupplier] = useState("");

  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [showOtherUnit, setShowOtherUnit] = useState(false);
  const [showOtherSupplier, setShowOtherSupplier] = useState(false);
  const [expiryDateOpen, setExpiryDateOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.value === value);

    if (selectedCategory?.isOther) {
      setShowOtherCategory(true);
      updateFormData("category", "other");
    } else {
      setShowOtherCategory(false);
      updateFormData("category", value);
      setOtherCategory(""); // Clear other input when switching
    }
  };

  const handleUnitChange = (value: string) => {
    const selectedUnit = units.find((unit) => unit.value === value);

    if (selectedUnit?.isOther) {
      setShowOtherUnit(true);
      updateFormData("unit", "other");
    } else {
      setShowOtherUnit(false);
      updateFormData("unit", value);
      setOtherUnit(""); // Clear other input when switching
    }
  };

  const handleSupplierChange = (value: string) => {
    const selectedSupplier = suppliers.find((supp) => supp.value === value);

    if (selectedSupplier?.isOther) {
      setShowOtherSupplier(true);
      updateFormData("supplier", "other");
    } else {
      setShowOtherSupplier(false);
      updateFormData("supplier", value);
      setOtherSupplier(""); // Clear other input when switching
    }
  };

  const handleExpiryDateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    updateFormData("expiryDate", value);

    // Auto-format the date as user types (DD/MM/YYYY)
    if (
      value.length === 2 &&
      formData.expiryDate.length === 1 &&
      !value.includes("/")
    ) {
      updateFormData("expiryDate", value + "/");
    } else if (
      value.length === 5 &&
      formData.expiryDate.length === 4 &&
      value.split("/").length === 2
    ) {
      updateFormData("expiryDate", value + "/");
    }

    // Parse and validate the date when it's complete
    if (value.length === 10) {
      const parsedDate = parseDate(value);
      if (parsedDate) {
        setExpiryDate(parsedDate);
      }
    }
  };

  const handleExpiryCalendarSelect = (selectedDate: Date | undefined) => {
    setExpiryDate(selectedDate);
    updateFormData("expiryDate", selectedDate ? formatDate(selectedDate) : "");
    setExpiryDateOpen(false);
  };

  const handleSubmit = () => {
    // Determine the final category value
    const finalCategory =
      formData.category === "other" ? otherCategory : formData.category;

    // Determine the final unit value
    const finalUnit = formData.unit === "other" ? otherUnit : formData.unit;

    // Determine the final supplier value
    const finalSupplier =
      formData.supplier === "other" ? otherSupplier : formData.supplier;

    // Validate required fields
    if (
      !formData.itemName ||
      !finalCategory ||
      !finalUnit ||
      !formData.currentAmount ||
      !formData.reorderLevel ||
      !finalSupplier
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Prepare data for submission - only the specified fields
    const submitData = {
      itemName: formData.itemName,
      category: finalCategory,
      unit: finalUnit,
      currentAmount: parseInt(formData.currentAmount),
      reorderLevel: parseInt(formData.reorderLevel),
      supplier: finalSupplier,
      expiryDate: formData.expiryDate || undefined,
    };

    // Log the data (replace with actual API call)
    console.log("Adding inventory item:", submitData);

    // Close modal after submission
    closeModal();

    // Reset form
    setFormData({
      itemName: "",
      category: "",
      unit: "",
      currentAmount: "",
      reorderLevel: "",
      supplier: "",
      expiryDate: "",
    });

    // Reset other inputs
    setOtherCategory("");
    setOtherUnit("");
    setOtherSupplier("");

    setShowOtherCategory(false);
    setShowOtherUnit(false);
    setShowOtherSupplier(false);
    setExpiryDate(undefined);
  };

  return (
    <Modal
      isAddModalOpen={isAddModalOpen}
      closeModal={closeModal}
      title={"Add Inventory Item"}
    >
      <div className="p-4 flex flex-col h-[calc(93vh-57px)]">
        {/* Form content */}
        <div className="flex-1 overflow-y-auto scrollbar-custom mb-3">
          <div className="space-y-4 px-1 pb-1">
            {/* Item Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="itemName"
                className="text-xs font-medium text-neutral-700"
              >
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) => updateFormData("itemName", e.target.value)}
                required
                className="h-9 text-sm placeholder:text-xs"
                placeholder="Enter item name"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label
                htmlFor="category"
                className="text-xs font-medium text-neutral-700"
              >
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                required
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger
                  id="category"
                  className="h-9 text-xs placeholder:text-xs"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                      className={
                        category.isOther ? "bg-neutral-50 font-medium" : ""
                      }
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Other Category Input (shown only when "Other" is selected) */}
            {showOtherCategory && (
              <div className="space-y-1.5 animate-fadeIn ml-4 pl-2 border-l-2 border-primary">
                <Label
                  htmlFor="otherCategory"
                  className="text-xs font-medium text-neutral-700"
                >
                  Specify Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="otherCategory"
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  required={showOtherCategory}
                  className="h-9 text-sm placeholder:text-xs"
                  placeholder="Enter custom category"
                />
              </div>
            )}

            {/* Unit */}
            <div className="space-y-1.5">
              <Label
                htmlFor="unit"
                className="text-xs font-medium text-neutral-700"
              >
                Unit <span className="text-red-500">*</span>
              </Label>
              <Select
                required
                value={formData.unit}
                onValueChange={handleUnitChange}
              >
                <SelectTrigger
                  id="unit"
                  className="h-9 text-xs placeholder:text-xs"
                >
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem
                      key={unit.value}
                      value={unit.value}
                      className={
                        unit.isOther ? "bg-neutral-50 font-medium" : ""
                      }
                    >
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Other Unit Input (shown only when "Other" is selected) */}
            {showOtherUnit && (
              <div className="space-y-1.5 animate-fadeIn ml-4 pl-2 border-l-2 border-primary">
                <Label
                  htmlFor="otherUnit"
                  className="text-xs font-medium text-neutral-700"
                >
                  Specify Unit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="otherUnit"
                  value={otherUnit}
                  onChange={(e) => setOtherUnit(e.target.value)}
                  required={showOtherUnit}
                  className="h-9 text-sm placeholder:text-xs"
                  placeholder="Enter custom unit"
                />
              </div>
            )}

            {/* Current Amount */}
            <div className="space-y-1.5">
              <Label
                htmlFor="currentAmount"
                className="text-xs font-medium text-neutral-700"
              >
                Current Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) =>
                  updateFormData("currentAmount", e.target.value)
                }
                required
                className="h-9 text-sm placeholder:text-xs"
                placeholder="Enter current amount"
                min="0"
              />
            </div>

            {/* Reorder Level */}
            <div className="space-y-1.5">
              <Label
                htmlFor="reorderLevel"
                className="text-xs font-medium text-neutral-700"
              >
                Reorder Level <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reorderLevel"
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => updateFormData("reorderLevel", e.target.value)}
                required
                className="h-9 text-sm placeholder:text-xs"
                placeholder="Enter reorder level"
                min="0"
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
              <Select
                required
                value={formData.supplier}
                onValueChange={handleSupplierChange}
              >
                <SelectTrigger
                  id="supplier"
                  className="h-9 text-xs placeholder:text-xs"
                >
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem
                      key={supplier.value}
                      value={supplier.value}
                      className={
                        supplier.isOther ? "bg-neutral-50 font-medium" : ""
                      }
                    >
                      {supplier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Other Supplier Input (shown only when "Other" is selected) */}
            {showOtherSupplier && (
              <div className="space-y-1.5 animate-fadeIn ml-4 pl-2 border-l-2 border-primary">
                <Label
                  htmlFor="otherSupplier"
                  className="text-xs font-medium text-neutral-700"
                >
                  Specify Supplier <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="otherSupplier"
                  value={otherSupplier}
                  onChange={(e) => setOtherSupplier(e.target.value)}
                  required={showOtherSupplier}
                  className="h-9 text-sm placeholder:text-xs"
                  placeholder="Enter supplier name"
                />
              </div>
            )}

            {/* Expiry Date (Optional) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="expiryDate"
                className="text-xs font-medium text-neutral-700"
              >
                Expiry Date{" "}
                <span className="text-neutral-400 text-[0.7rem] font-normal">
                  (Optional)
                </span>
              </Label>
              <div className="relative flex gap-2">
                <Input
                  id="expiryDate"
                  value={formData.expiryDate}
                  placeholder="DD/MM/YYYY"
                  className="bg-white pr-10"
                  onChange={handleExpiryDateInputChange}
                  maxLength={10}
                />
                <Popover open={expiryDateOpen} onOpenChange={setExpiryDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="expiry-date-picker"
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 bg-white hover:bg-neutral-200 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Select expiry date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-20}
                    sideOffset={10}
                    style={{
                      maxHeight: "280px",
                      overflowY: "auto",
                    }}
                  >
                    <CalendarComp
                      mode="single"
                      defaultMonth={expiryDate || new Date()}
                      selected={expiryDate}
                      captionLayout="dropdown"
                      onSelect={handleExpiryCalendarSelect}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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
            Add Item
          </Button>
        </div>
      </div>
    </Modal>
  );
}
