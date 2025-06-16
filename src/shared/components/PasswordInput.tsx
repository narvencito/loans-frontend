import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Contraseña',
  name,
  id,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={() => setVisible((prev) => !prev)}
      >
        {visible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
      </button>
    </div>
  );
}