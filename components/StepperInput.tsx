import React, { useState, useEffect, useRef } from 'react';

// A robust, fully-controlled stepper input component
const StepperInput: React.FC<{
  value: number;
  onChange: (newValue: number) => void;
  step?: number;
  min?: number;
  'aria-label'?: string;
}> = ({ value, onChange, step = 1, min = 0, 'aria-label': ariaLabel }) => {
    // Local state to manage the input's value, allowing it to be an empty string
    const [displayValue, setDisplayValue] = useState<string>(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Sync display value when the external value prop changes, but not if the user is actively editing.
        // This prevents the input from being reset to its original value while the user is typing.
        if (document.activeElement !== inputRef.current) {
            setDisplayValue(value.toString());
        }
    }, [value]);

    const handleStep = (direction: 'up' | 'down') => {
        const change = direction === 'up' ? step : -step;
        const currentValue = parseInt(displayValue, 10);
        // If the display value is empty or invalid, start stepping from the minimum value.
        const startValue = isNaN(currentValue) ? min - change : currentValue;
        const newValue = Math.max(min, startValue + change);
        
        setDisplayValue(newValue.toString());
        onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow the input to be visually empty by updating the local state directly.
        setDisplayValue(e.target.value);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const strValue = e.target.value.trim();
        const numValue = parseInt(strValue, 10);

        // If the input is empty or not a valid number, commit the minimum value.
        if (strValue === '' || isNaN(numValue)) {
            onChange(min);
        } else {
            const finalValue = Math.max(min, numValue);
            onChange(finalValue);
        }
    };

    return (
        <div className="flex items-center justify-between bg-gray-900 rounded-md h-10 border border-transparent focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
            <button
                type="button"
                onClick={() => handleStep('down')}
                className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-400 hover:bg-gray-700 rounded-l-md flex-shrink-0"
                aria-label={`Decrease ${ariaLabel || 'value'}`}
            >
                -
            </button>
            <input
                ref={inputRef}
                type="number"
                value={displayValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                className="font-semibold text-center w-full bg-transparent border-none focus:ring-0 p-0"
                aria-label={ariaLabel || 'Current value'}
                min={min}
            />
            <button
                type="button"
                onClick={() => handleStep('up')}
                className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-400 hover:bg-gray-600 rounded-r-md flex-shrink-0"
                aria-label={`Increase ${ariaLabel || 'value'}`}
            >
                +
            </button>
        </div>
    );
};

export default StepperInput;
