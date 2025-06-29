import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDialogStore } from '@/shared/utils/global-dialog';

export default function RecoverPasswordPage() {
  const navigate = useNavigate();
  const { showDialog } = useDialogStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement password recovery logic
      showDialog({
        title: 'Correo enviado',
        message: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.',
        type: 'success',
      });
      navigate('/login');
    } catch (error) {
      showDialog({
        title: 'Error',
        message: 'Ocurrió un error al enviar el correo. Por favor, intenta nuevamente.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Volver
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
