import Image from "next/image";
import TestContainer from "./typingtest/TestContainer";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="h-screen bg-slate-950 w-full">
      <div className="flex justify-center items-center w-full h-screen">
        <TestContainer />
      </div>
    </main>
  );
}
