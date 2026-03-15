import styles from "./index.module.css";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <main className={styles.main}>
        <h2>Welcome to the World Anvil Exporter</h2>
        <h3>Get Started</h3>
        <p>
          Select a world from the dropdown above to begin exporting your
          character sheets
        </p>
      </main>

      <footer className={styles.footer}>
        <p>Grimmoire Productions 2024</p>
      </footer>
    </div>
  );
}
