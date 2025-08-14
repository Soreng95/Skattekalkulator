import { Card } from "@/components/ui/card";
import ExitTax from "@/components/ui/exit-tax";
import WealthTax from "@/components/ui/wealth-tax";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
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
    </div>
  );
}
