import React from 'react';
import styles from './index.module.css';

export default function ExportPage() {
  return (
    <div className={styles.exportInstructions}>
      <h2>Character Export Tool</h2>
      <p>Select a character from the dropdowns above to view and export their character sheet.</p>
    </div>
  );
}
