"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FC, ReactNode } from "react"

type ProvidersProps = {
  children: ReactNode
}

const UseQueryProvider:FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default UseQueryProvider