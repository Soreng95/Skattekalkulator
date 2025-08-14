import { Card } from "@/components/ui/card";
import ExitTax from "@/components/exit-tax";
import WealthTax from "@/components/wealth-tax";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Skattekalkulator
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <Card className="p-4 shadow-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Formuesskatt</h2>
          <WealthTax />
        </Card>
        <Card className="p-4 shadow-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Exit-skatt</h2>
          <ExitTax />
        </Card>
      </div>
      <footer className="mt-12 text-center text-sm text-gray-500 space-y-1">
        <p>
          Denne skattekalkulatoren er <strong>open source</strong>. Jeg
          oppfordrer alle til å lese og bidra med oppdateringer i kalkulasjonene
          og koden på{" "}
          <a
            href="https://github.com/Soreng95/Skattekalkulator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
        <p>
          Laget av{" "}
          <a
            href="https://www.linkedin.com/in/emilsoreng/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Emil Søreng
          </a>
        </p>
      </footer>
    </div>
  );
}
