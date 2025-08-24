"use client";
import React from "react";
import {
  X,
  User,
  Stethoscope,
  Check,
  Phone,
  Mail,
  MapPin,
  Trash2,
  UserCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { AddModalProps } from "../types/index";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";

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

export default function AddModal({ isAddModalOpen, closeModal }: AddModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [dateInput, setDateInput] = React.useState("");

  const [animatingStep, setAnimatingStep] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: General Info
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",

    // Step 2: Medical Info
    medicalConditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    note: "",

    // Step 3: Account Info
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Current input states
  const [currentCondition, setCurrentCondition] = useState("");
  const [currentMedication, setCurrentMedication] = useState("");
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    { id: 1, name: "General Info", icon: User },
    { id: 2, name: "Medical Info", icon: Stethoscope },
    { id: 3, name: "Account", icon: UserCircle },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setTransitionDirection("forward");
      setAnimatingStep(currentStep);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimatingStep(0);
      }, 300);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setTransitionDirection("backward");
      setAnimatingStep(currentStep);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setAnimatingStep(0);
      }, 300);
    }
  };

  const handleSubmit = () => {
    // Validate all required fields
    if (!validateForm()) {
      return;
    }

    // Prepare final data object
    const submitData = {
      ...formData,
      dob: dateInput, // Use the formatted date input
    };

    // Log the data (replace with actual API call)
    console.log("Submitting patient data:", submitData);

    // Close modal after submission
    closeModal();
  };

  const validateForm = () => {
    // Basic validation - you can expand this as needed
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !dateInput ||
        !formData.gender ||
        !formData.phone
      ) {
        alert("Please fill all required fields in General Info");
        return false;
      }
    }

    if (currentStep === 3) {
      if (
        !formData.username ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        alert("Please fill all required fields in Account Info");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const wasFullScreenBeforeUpload = useRef(false);

  // Add event listener to capture fullscreen state before click
  useEffect(() => {
    const fileInput = fileInputRef.current;
    if (!fileInput) return;

    const handleClick = () => {
      // Capture fullscreen state right before the file dialog opens
      wasFullScreenBeforeUpload.current = !!document.fullscreenElement;
    };

    fileInput.addEventListener("click", handleClick);

    return () => {
      if (fileInput) {
        fileInput.removeEventListener("click", handleClick);
      }
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);

        if (
          wasFullScreenBeforeUpload.current &&
          document.fullscreenEnabled &&
          !document.fullscreenElement
        ) {
          setTimeout(() => {
            document.documentElement.requestFullscreen().catch((err) => {
              console.error("Error attempting to re-enter fullscreen:", err);
            });
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);

    // Auto-format the date as user types (DD/MM/YYYY)
    if (value.length === 2 && dateInput.length === 1 && !value.includes("/")) {
      setDateInput(value + "/");
    } else if (
      value.length === 5 &&
      dateInput.length === 4 &&
      value.split("/").length === 2
    ) {
      setDateInput(value + "/");
    }

    // Parse and validate the date when it's complete
    if (value.length === 10) {
      const parsedDate = parseDate(value);
      if (parsedDate) {
        setDate(parsedDate);
      }
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setDateInput(selectedDate ? formatDate(selectedDate) : "");
    setOpen(false);
  };

  // Update input field when date changes from calendar
  React.useEffect(() => {
    if (date) {
      setDateInput(formatDate(date));
    }
  }, [date]);

  // Functions to handle medical info
  const addMedicalCondition = () => {
    if (currentCondition.trim()) {
      const updatedConditions = [
        ...formData.medicalConditions,
        currentCondition.trim(),
      ];
      updateFormData("medicalConditions", updatedConditions);
 
     setCurrentCondition("");
    }
  };

  const removeMedicalCondition = (index: number) => {
    const updatedConditions = formData.medicalConditions.filter(
      (_, i) => i !== index
    );
    updateFormData("medicalConditions", updatedConditions);
  };

  const addMedication = () => {
    if (currentMedication.trim()) {
      const updatedMedications = [
        ...formData.medications,
        currentMedication.trim(),
      ];
      updateFormData("medications", updatedMedications);
      setCurrentMedication("");
    }
  };

  const removeMedication = (index: number) => {
    const updatedMedications = formData.medications.filter(
      (_, i) => i !== index
    );
    updateFormData("medications", updatedMedications);
  };

  const addAllergy = () => {
    if (currentAllergy.trim()) {
      const updatedAllergies = [...formData.allergies, currentAllergy.trim()];
      updateFormData("allergies", updatedAllergies);
      setCurrentAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = formData.allergies.filter((_, i) => i !== index);
    updateFormData("allergies", updatedAllergies);
  };

  return (
    <Modal
      isAddModalOpen={isAddModalOpen}
      closeModal={closeModal}
      title={"Add New Patient"}
    >
      <div className="p-4 flex flex-col h-[calc(93vh-57px)]">
        {/* Steps indicator - Made more compact */}
        <div className="flex items-center w-5/6 mx-auto justify-between mb-1">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isLastStep = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center justify-center px-1 ${
                  !isLastStep && "flex-1"
                }`}
              >
                <div className="flex items-center w-full">
                  {/* Step circle */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`flex relative items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 z-10
                        ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                            ? "border-primary bg-primary text-white"
                            : "border-neutral-300 bg-white text-neutral-400"
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute -inset-1.5 rounded-full border-2 border-primary border-dashed flex items-center justify-center animate-pulse"></div>
                      )}
                      {isCompleted ? (
                        <Check className="h-3 w-3 transition-transform duration-300" />
                      ) : (
                        <IconComponent
                          className={`h-3 w-3 transition-transform duration-300 ${
                            isActive ? "text-white" : ""
                          }`}
                        />
                      )}
                    </div>

                    {/* Step name */}
                    <span
                      className={`text-[11px] mt-1 font-medium text-center transition-all duration-300
                        ${
                          isCompleted
                            ? "text-green-600"
                            : isActive
                            ? "text-primary font-semibold"
                            : "text-neutral-500"
                        }
                      `}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Connector line (except for last step) */}
                  {!isLastStep && (
                    <div className="flex-1 h-0.5 mx-1 bg-neutral-200 relative overflow-hidden">
                      {/* Progress fill for the line */}
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-700 ease-in-out
                          ${
                            step.id < currentStep
                              ? "bg-green-500 w-full"
                              : step.id === currentStep
                              ? "bg-primary w-1/2"
                              : "w-0"
                          }
                        `}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step content with animation */}
        <div className="flex-1 mb-3 overflow-hidden relative">
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
            style={{
              width: "300%",
              transform:
                transitionDirection === "forward"
                  ? `translateX(-${(currentStep - 1) * (100 / 3)}%)`
                  : `translateX(-${(currentStep - 1) * (100 / 3)}%)`,
            }}
          >
            {/* Step 1 - General Info */}
            <div
              className={`w-1/3 p-2 transition-opacity duration-500 ${
                currentStep === 1 ? "opacity-100" : "opacity-40"
              }`}
            >
              {/* Scrollable form container */}
              <div className="overflow-y-auto scrollbar-custom h-full pr-2 px-1 pb-1.5">
                {/* Profile image upload inside scroll - Made more compact */}
                <div className="flex items-center gap-3 mb-4 p-2 pl-0  rounded-lg ">
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-white border-2 border-neutral-300 flex items-center justify-center overflow-hidden shadow-sm">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-neutral-400" />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-4">
                      <label
                        htmlFor="profile-upload"
                        className="text-xs text-primary hover:text-blue-700 cursor-pointer font-medium"
                      >
                        {profileImage ? "Edit image" : "Add image"}
                      </label>
                      {profileImage && (
                        <button
                          onClick={handleRemoveImage}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      JPG, PNG or GIF. Max 5MB
                    </p>
                  </div>
                </div>

                {/* Form fields for step 1 */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="firstName"
                        className="text-xs font-medium text-neutral-700"
                      >
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          updateFormData("firstName", e.target.value)
                        }
                        required
                        className="h-9 text-sm placeholder:text-xs"
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="lastName"
                        className="text-xs font-medium text-neutral-700"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          updateFormData("lastName", e.target.value)
                        }
                        required
                        className="h-9 text-sm placeholder:text-xs"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="dob"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>

                    <div className="relative flex gap-2">
                      <Input
                        id="date"
                        value={dateInput}
                        placeholder="DD/MM/YYYY"
                        className="bg-white pr-10"
                        onChange={handleDateInputChange}
                        maxLength={10}
                      />
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2  size-6 bg-white hover:bg-neutral-200  -translate-y-1/2"
                          >
                            <CalendarIcon className="size-3.5 " />
                            <span className="sr-only">Select date</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0 "
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
                            defaultMonth={date || new Date()}
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={handleCalendarSelect}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="gender"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      required
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger
                        id="gender"
                        className="h-9 text-xs placeholder:text-xs"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        required
                        className="h-9 text-sm placeholder:text-xs pl-9"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Email Address{" "}
                      <span className="text-neutral-400  text-[0.7rem] font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        className="h-9 text-sm placeholder:text-xs pl-9"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="address"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Address{" "}
                      <span className="text-neutral-400  text-[0.7rem] font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          updateFormData("address", e.target.value)
                        }
                        className="h-9 text-sm placeholder:text-xs  pl-9"
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Medical Information */}
            <div
              className={`w-1/3 p-2 transition-opacity duration-500 ${
                currentStep === 2 ? "opacity-100" : "opacity-40"
              }`}
            >
              {/* Scrollable form container */}
              <div className="overflow-y-auto scrollbar-custom h-full pr-2 px-1 pb-1.5">
                <h3 className="text-lg font-medium text-neutral-800 mb-4">
                  Medical Information
                </h3>

                {/* Medical Conditions */}
                <div className="space-y-3 mb-5">
                  <Label className="text-xs font-medium text-neutral-700">
                    Medical Conditions / Chronic Illnesses
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentCondition}
                      onChange={(e) => setCurrentCondition(e.target.value)}
                      className="h-9 text-sm placeholder:text-xs"
                      placeholder="Add condition"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMedicalCondition();
                        }
                      }}
                    />
                    <Button
                      onClick={addMedicalCondition}
                      className="h-9 px-3 text-xs"
                      disabled={!currentCondition.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {formData.medicalConditions.length > 0 && (
                    <div className="space-y-2">
                      {formData.medicalConditions.map((condition, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-neutral-50 p-2 rounded-md"
                        >
                          <span className="text-sm">{condition}</span>
                          <button
                            onClick={() => removeMedicalCondition(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            {}
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Medications */}
                <div className="space-y-3 mb-5">
                  <Label className="text-xs font-medium text-neutral-700">
                    Current Medications
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentMedication}
                      onChange={(e) => setCurrentMedication(e.target.value)}
                      className="h-9 text-sm placeholder:text-xs"
                      placeholder="Add medication"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMedication();
                        }
                      }}
                    />
                    <Button
                      onClick={addMedication}
                      className="h-9 px-3 text-xs"
                      disabled={!currentMedication.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {formData.medications.length > 0 && (
                    <div className="space-y-2">
                      {formData.medications.map((medication, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-neutral-50 p-2 rounded-md"
                        >
                          <span className="text-sm">{medication}</span>
                          <button
                            onClick={() => removeMedication(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            {}
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allergies */}
                <div className="space-y-3 mb-5">
                  <Label className="text-xs font-medium text-neutral-700">
                    Allergies
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentAllergy}
                      onChange={(e) => setCurrentAllergy(e.target.value)}
                      className="h-9 text-sm placeholder:text-xs"
                      placeholder="Add allergy"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAllergy();
                        }
                      }}
                    />
                    <Button
                      onClick={addAllergy}
                      className="h-9 px-3 text-xs"
                      disabled={!currentAllergy.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {formData.allergies.length > 0 && (
                    <div className="space-y-2">
                      {formData.allergies.map((allergy, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-neutral-50 p-2 rounded-md"
                        >
                          <span className="text-sm">{allergy}</span>
                          <button
                            onClick={() => removeAllergy(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            {}
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="note"
                    className="text-xs font-medium text-neutral-700"
                  >
                    Note{" "}
                    <span className="text-neutral-400  text-[0.7rem] font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="note"
                    value={formData.note}
                    onChange={(e) => updateFormData("note", e.target.value)}
                    className="h-9 text-sm placeholder:text-xs"
                    placeholder="Add a note"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 - Account Information */}
            <div
              className={`w-1/3 p-2 transition-opacity duration-500 ${
                currentStep === 3 ? "opacity-100" : "opacity-40"
              }`}
            >
              {/* Scrollable form container */}
              <div className="overflow-y-auto scrollbar-custom h-full pr-2 px-1 pb-1.5">
                <h3 className="text-lg font-medium text-neutral-800 mb-4">
                  Account Information
                </h3>

                <div className="space-y-4">
                  {/* Username */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="username"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        updateFormData("username", e.target.value)
                      }
                      required
                      className="h-9 text-sm placeholder:text-xs"
                      placeholder="Choose a username"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          updateFormData("password", e.target.value)
                        }
                        required
                        className="h-9 text-sm placeholder:text-xs pr-10"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-medium text-neutral-700"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          updateFormData("confirmPassword", e.target.value)
                        }
                        required
                        className="h-9 text-sm placeholder:text-xs pr-10"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-700"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {formData.password &&
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-auto ">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={` text-xs border px-2 rounded-[4.5px] font-medium  py-1 transition-all duration-300
              ${
                currentStep === 1
                  ? "text-neutral-400 bg-neutral-100 border-neutral-400  cursor-not-allowed"
                  : "text-primary bg-blue-50  hover:bg-blue-100 border-primary/80"
              }`}
          >
            Previous
          </button>

          <div className="flex itmes-center justify-between gap-3">
            <Button
              size="sm"
              onClick={handleNextStep}
              className=" bg-green-500 text-xs py-1 rounded-[4.5px] hover:bg-green-700 transition-all duration-300"
            >
              Submit
            </Button>

            <Button
              size="sm"
              onClick={handleNextStep}
              className="  hover:bg-blue-800 py-1 rounded-[4.5px] text-xs font-normal transition-all duration-300"
            >
              {currentStep === steps.length ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
