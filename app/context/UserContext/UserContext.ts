import { createContext } from 'react';
import type { UserContextType } from '~/utils/types';

export const UserContext = createContext<UserContextType | null>(null);
