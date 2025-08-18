import React from "react";
import { StatusBar } from "expo-status-bar";
import DINApp from "./src/screens/DINApp";

export default function App() {
  return (
    <>
      <DINApp />
      <StatusBar style="dark" />
    </>
  );
}
