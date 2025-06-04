import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUrl() {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? 'http://localhost:3000' : 'https://snippettool.com'
}
