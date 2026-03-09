import React from "react";
import styles from "./index.module.css";


import { useOutletContext } from "react-router";
import type { DropdownOption } from "~/utils/types";

interface OutletContextType {
  articlesList: DropdownOption[];
}

export default function BatchExportPage() {
  const { articlesList } = useOutletContext<OutletContextType>();

  return (
    <div className={styles.exportInstructions}>
      <h2>Batch Export Tool</h2>
      <p>
        Select a run and/or tag from the dropdowns above to view available
        articles.
      </p>
      <ol>
        {articlesList.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ol>
    </div>
  );
}
