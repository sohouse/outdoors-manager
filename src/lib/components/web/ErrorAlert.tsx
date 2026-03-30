
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import React from 'react'

interface ErrorAlertProps {
  title: number
  desc: string
}

const ErrorAlert = ({ title, desc }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {desc}
      </AlertDescription>
    </Alert>
  )
}

export default ErrorAlert