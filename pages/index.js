import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [situationInput, setSituationInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3005/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({ situation: situationInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.info("Start - OpenAI result");
      console.info(data.result);
      console.info("End - OpenAI result");

      setResult(data.result);
      setSituationInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/house_logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/house_logo.jpg" className={styles.icon} />
        <h3>Sustainability Plan</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="situation"
            placeholder="Enter situation. Ex: 'I live in Arizona. I have a large house.'"
            value={situationInput}
            onChange={(e) => setSituationInput(e.target.value)}
          />
          <input type="submit" value="Generate Sustainability Plan" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
