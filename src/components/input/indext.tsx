import { FC } from "react"

type InputProps = {
    label: string;
    value?: string | null;
    className?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

const Input:FC<InputProps> = ({ label, value, className, placeholder, onChange }) => {
    return (
        <div className={`${className} flex flex-col gap-1`}>
            <label className="dark:text-gray-400">{label}</label>
            <input
                className="border rounded-md py-2 px-3"
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}

export default Input