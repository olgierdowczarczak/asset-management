import { useState, useRef, useEffect } from 'react';

interface SearchableSelectOption {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    id?: string;
    name?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options: SearchableSelectOption[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    required?: boolean;
    allowClear?: boolean;
    onClear?: () => void;
}

const SearchableSelect = ({
    id,
    name,
    value,
    onChange,
    options,
    placeholder = 'Select...',
    disabled = false,
    error,
    allowClear = false,
    onClear,
}: SearchableSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const selectedOption = options.find((opt) => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : '';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setHighlightedIndex(0);
    }, [searchTerm]);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const highlightedElement = dropdownRef.current.children[
                highlightedIndex
            ] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex, isOpen]);

    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(true);
            setSearchTerm('');
            inputRef.current?.focus();
        }
    };

    const handleOptionClick = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setIsOpen(true);
                setHighlightedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev,
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setIsOpen(true);
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (isOpen && filteredOptions[highlightedIndex]) {
                    handleOptionClick(filteredOptions[highlightedIndex].value);
                } else {
                    setIsOpen(true);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setSearchTerm('');
                break;
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClear) {
            onClear();
        } else {
            onChange('');
        }
        setSearchTerm('');
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type="text"
                    value={isOpen ? searchTerm : displayValue}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full px-3 py-2 pr-20 bg-gray-900 border ${
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:ring-primary-500'
                    } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    readOnly={!isOpen}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {allowClear && value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                            title="Clear selection"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
                >
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleOptionClick(option.value)}
                                className={`px-3 py-2 cursor-pointer transition-colors ${
                                    index === highlightedIndex
                                        ? 'bg-gray-800 text-gray-100'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'
                                } ${
                                    option.value === value
                                        ? 'bg-primary-900/20 text-primary-400'
                                        : ''
                                }`}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {option.label}
                            </div>
                        ))
                    )}
                </div>
            )}

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default SearchableSelect;
