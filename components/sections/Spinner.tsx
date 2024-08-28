import React from "react";
interface SpinnerProps {
    label?: string;
}
const Spinner:React.FC<SpinnerProps> = ({
    label
}) => {
  return (
    <div>
      <div className="flex items-center gap-4 justify-center">
        {label&& <p>{label}</p>}
        <div className="loader">
          <div
            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
