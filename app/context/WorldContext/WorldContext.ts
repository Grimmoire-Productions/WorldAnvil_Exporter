import { createContext } from "react";
import type { WorldContextType } from "~/utils/types";

export const WorldContext = createContext<WorldContextType | null>(null);
