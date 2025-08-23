"use client";

import { X, User, Stethoscope, CheckCircle, Check } from "lucide-react";
import { AddModalProps } from "../types/index";
import { useState } from "react";

export default function AddModal({ isVisible, closeModal }: AddModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [animatingStep, setAnimatingStep] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward");

  const steps = [
    { id: 1, name: "General Info", icon: User },
    { id: 2, name: "Medical Info", icon: Stethoscope },
    { id: 3, name: "Finish", icon: CheckCircle },
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
      closeModal();
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

  return (
    <div
      className={`fixed top-1/2 right-3 -translate-y-1/2 h-[93vh] rounded-2xl w-[400px] max-w-1/3 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out
            ${isVisible ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-3 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="text-base font-semibold text-neutral-800">
          Add New Patient
        </h2>
        <button
          onClick={closeModal}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          {}
          <X className="h-4 w-4 text-neutral-800" />
        </button>
      </div>
      <div className="p-4 flex flex-col h-[calc(93vh-57px)]">
        {/* Steps indicator */}
        <div className="flex items-center w-5/6 mx-auto justify-between mb-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isLastStep = index === steps.length - 1;
            const isAnimating = step.id === animatingStep;

            // Special cases for line progress
            const isFirstStepActive = currentStep === 1 && step.id === 1;
            const isSecondStepActive = currentStep === 2 && step.id === 2;

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
                    {/* Outer circle for active step - properly centered */}

                    <div
                      className={`flex relative items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 z-10
                        ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                            ? "border-primary bg-primary text-white"
                            : "border-neutral-300 bg-white text-neutral-400"
                        }
                        ${isAnimating ? "scale-110" : ""}
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
                      className={`text-xs mt-1 font-medium text-center transition-all duration-300
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
                              : isFirstStepActive || isSecondStepActive
                              ? "bg-primary w-1/2" // Half full for active steps
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
        <div className="flex-1 mb-4 overflow-hidden relative">
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
            {/* Step 1 */}
            <div
              className={`w-1/3 p-2 transition-opacity duration-500 ${
                currentStep === 1 ? "opacity-100" : "opacity-40"
              }`}
            >
              <h3 className="text-lg font-medium text-neutral-800">
                General Information
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Enter the patient's basic information such as name, contact
                details, and personal information.
              </p>
              {/* Add form fields for step 1 here */}
            </div>

            {/* Step 2 */}
            <div
              className={`w-1/3 p-2 transition-opacity duration-500 ${
                currentStep === 2 ? "opacity-100" : "opacity-40"
              }`}
            >
              <h3 className="text-lg font-medium text-neutral-800">
                Medical Information
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Provide the patient's medical history, current medications, and
                health conditions.
              </p>
              {/* Add form fields for step 2 here */}
            </div>

            {/* Step 3 */}
            <div
              className={`w-1/3 p-2 transition-opacity duration-500 ${
                currentStep === 3 ? "opacity-100" : "opacity-40"
              }`}
            >
              <h3 className="text-lg font-medium text-neutral-800">
                Review & Finish
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Review all information and complete the patient registration
                process.
              </p>
              {/* Add review summary and finish button here */}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 mt-auto border-t border-neutral-200">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300
              ${
                currentStep === 1
                  ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
                  : "text-primary bg-blue-50 hover:bg-blue-100 hover:scale-105"
              }`}
          >
            Previous
          </button>

          <button
            onClick={handleNextStep}
            className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            {currentStep === steps.length ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
