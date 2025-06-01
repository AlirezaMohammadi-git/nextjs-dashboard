
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
}

export const Input = ({ type, className, children, ...rest }: InputProps) => {
    return (
        <input {...rest} className="rounded-lg">{children}</input>
    )
}

export default Input