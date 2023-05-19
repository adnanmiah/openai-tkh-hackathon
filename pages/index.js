import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [addressInput, setAddressInput] = useState("");
  const [houseSizeInput, setHouseSizeInput] = useState("");
  const [yardSizeInput, setYardSizeInput] = useState("");
  const [neighborhoodTypeInput, setNeighborhoodType] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3005/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({ address: addressInput, houseSize: houseSizeInput, yardSize: yardSizeInput, neighborhoodType: neighborhoodTypeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.info("Start - OpenAI result");
      console.info(data.result);
      console.info("End - OpenAI result");

      setResult(data.result);
      setAddressInput("");
      setHouseSizeInput("");
      setYardSizeInput("");
      setNeighborhoodType("");
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
            name="address"
            placeholder="Enter address"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
          />
          <input
            type="text"
            name="houseSize"
            placeholder="Enter house size"
            value={houseSizeInput}
            onChange={(e) => setHouseSizeInput(e.target.value)}
          />
          <input
            type="text"
            name="yardSize"
            placeholder="Enter Yard size"
            value={yardSizeInput}
            onChange={(e) => setYardSizeInput(e.target.value)}
          />
          <input
            type="text"
            name="neighborhoodType"
            placeholder="Enter yard neighborhoodType"
            value={neighborhoodTypeInput}
            onChange={(e) => setNeighborhoodType(e.target.value)}
          />
          <input type="submit" value="Generate Sustainability Plan" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
