import { createContext } from 'react'
import type { IFormContext } from '../../core/types'

export const TFormContext = createContext<IFormContext | null>(null)
