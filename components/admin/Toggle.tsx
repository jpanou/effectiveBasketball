"use client";

interface Props {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled }: Props) {
  return (
    <label className={`flex items-center gap-3 ${disabled ? "opacity-50" : "cursor-pointer"} select-none`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={`relative w-12 h-[26px] rounded-full transition-colors duration-300 ease-in-out focus:outline-none flex-shrink-0 ${
          checked ? "bg-[#F97316]" : "bg-[#3A3A3A]"
        }`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-in-out ${
            checked ? "translate-x-[22px]" : "translate-x-0"
          }`}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-400">{label}</span>
      )}
    </label>
  );
}
