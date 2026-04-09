
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

interface ErrorAlertProps {
  title: number
  desc: string
  stackTrace?: string
}

const ErrorAlert = ({ title, desc, stackTrace }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {desc}
      </AlertDescription>
      <AlertDescription>
        {stackTrace}
      </AlertDescription>
    </Alert>
  )
}

export default ErrorAlert