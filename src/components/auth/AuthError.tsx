import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthErrorProps {
  message: string;
}

export const AuthError = ({ message }: AuthErrorProps) => {
  if (!message) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};