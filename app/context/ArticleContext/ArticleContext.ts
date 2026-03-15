import { createContext } from "react";
import type { ArticleContextType } from "~/utils/types";

export const ArticleContext = createContext<ArticleContextType | null>(null);
