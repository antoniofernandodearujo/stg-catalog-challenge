"use client"

import { Button } from "@/src/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  return (
    <Button 
      variant="ghost" 
      onClick={() => window.history.back()}
      className="text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Voltar
    </Button>
  )
}