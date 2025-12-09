"use client"

import { useEffect } from "react"
import { toast } from "sonner"

interface ErrorToastProps {
  message: string
}

export function ErrorToast({ message }: ErrorToastProps) {
  useEffect(() => {
    if (message) {
      toast.error(message)
    }
  }, [message])

  return null
}


