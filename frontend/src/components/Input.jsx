import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

// Text Input
export const Input = ({
  icon: Icon,
  value,
  onChange,
  label,
  error,
  ...props
}) => (
  <div className="relative">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    {Icon && (
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="size-5 text-accent" />
      </div>
    )}
    <input
      {...props}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-lg md:p-3 p-2 bg-white text-dark placeholder:text-sm 
        md:placeholder:text-base placeholder-gray-400 focus:ring-4 focus:outline-none transition no-spinner
        ${Icon ? "md:pl-10 pl-10" : "md:p-3 p-2"} 
        ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:border-accent focus:ring-accent/40"
        }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Text Area
export const TextareaInput = ({ label, error, ...props }) => (
  <div className="relative w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    <textarea
      {...props}
      className={`w-full border rounded-lg px-3 py-3 bg-white text-dark placeholder-gray-400 focus:ring-4 focus:outline-none transition resize-none 
        ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:border-accent focus:ring-accent/40"
        }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// CheckBox
export const CheckboxInput = ({
  options,
  name,
  initialValue = [],
  label,
  error,
  ...props
}) => (
  <div className="relative w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    <div className="flex flex-wrap gap-5">
      {options.map((option, index) => (
        <div key={index}>
          <input
            name={name}
            id={`checkbox-${index}`}
            type="checkbox"
            value={option.value}
            checked={initialValue.includes(option.value)}
            className="w-5 h-5 text-accent cursor-pointer accent-accent hidden peer"
            {...props}
          />
          <label
            htmlFor={`checkbox-${index}`}
            className={`flex w-fit px-3 py-2 items-center cursor-pointer peer-checked:border-2 hover:bg-gray-100 peer-checked:border-accent border rounded-lg bg-white 
              ${error ? "border-red-500" : "border-gray-200"}`}
          >
            {option.label && (
              <span className="text-gray-700">{option.label}</span>
            )}
          </label>
        </div>
      ))}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Dropdown
export const DropdownInput = ({
  options,
  value,
  label,
  name,
  onChange,
  placeholder = "Select an option",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || options[0]?.value
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        className={`w-full flex-nowrap text-left bg-white border rounded-lg px-3 py-3 focus:ring-4 focus:outline-none flex items-center justify-between transition 
          ${
            error
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:border-accent focus:ring-accent/40"
          }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {options
          .find((opt) => opt.value === selectedValue)
          ?.label.replace(/\b\w/g, (char) => char.toUpperCase()) || placeholder}
        <LucideIcons.ChevronRight
          className={`ml-2 transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(option.value)}
            >
              {option.label.replace(/\b\w/g, (char) => char.toUpperCase())}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// File Upload
export const FileInput = ({ selectedFile, onFileChange, ...props }) => (
  <label className="relative w-full border border-gray-300 rounded-lg bg-white text-dark px-3 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition">
    <LucideIcons.Upload className="size-5 text-accent" />
    <input type="file" className="hidden" onChange={onFileChange} {...props} />
    {selectedFile ? selectedFile.name : "Choose a file"}
  </label>
);

export const ImageInput = ({ label, onFileChange }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onFileChange) onFileChange(file); // Pass file to parent component if needed
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full pb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded preview"
            className="w-full h-50 object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <LucideIcons.Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: PNG, JPG, GIF
            </p>
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export const RadioInput = ({
  options,
  name,
  initialValue = "",
  label,
  error,
  ...props
}) => (
  <div className="relative w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    <div className="flex flex-wrap gap-3">
      {options.map((option, index) => {
        const IconComponent = option.icon
          ? LucideIcons[option.icon]
          : LucideIcons.HandPlatter;
        return (
          <div key={index}>
            <input
              name={name}
              id={`radio-${index}`}
              type="radio"
              value={option.value}
              checked={initialValue === option.value}
              className="hidden peer"
              {...props}
            />
            <label
              htmlFor={`radio-${index}`}
              className={`flex w-fit p-2 items-center cursor-pointer peer-checked:border-2 hover:bg-gray-100 peer-checked:border-accent border rounded-lg bg-white 
              ${error ? "border-red-500" : "border-gray-200"}`}
            >
              {option.icon && <IconComponent className="size-7 text-accent" />}
              {option.label && (
                <span className="text-gray-700">{option.label}</span>
              )}
            </label>
          </div>
        );
      })}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
