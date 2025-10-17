"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const cur = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 1,
  }).format(isFinite(n) ? n : 0);

export default function ProperRentalProfitabilityPlanner() {
  const [apartments, setApartments] = useState([
    { id: crypto.randomUUID(), name: "Appartement RDC", monthlyRate: 850, occupancy: 100, operatingExpenses: 15, propertyTax: 5, incomeTax: 10, loanMonthly: 650 },
    { id: crypto.randomUUID(), name: "Appartement 1", monthlyRate: 1000, occupancy: 100, operatingExpenses: 15, propertyTax: 5, incomeTax: 10, loanMonthly: 730 },
    { id: crypto.randomUUID(), name: "Appartement 2", monthlyRate: 450, occupancy: 100, operatingExpenses: 15, propertyTax: 5, incomeTax: 10, loanMonthly: 0 },
  ]);
  const [incomeTaxBase, setIncomeTaxBase] = useState<"brut" | "preDebtCF">("brut");

  const addApartment = () => {
    setApartments([
      ...apartments,
      { id: crypto.randomUUID(), name: "Nouvel Appartement", monthlyRate: 0, occupancy: 100, operatingExpenses: 15, propertyTax: 5, incomeTax: 10, loanMonthly: 0 },
    ]);
  };

  const updateApartment = (id: string, patch: Partial<(typeof apartments)[0]>) => {
    setApartments(apartments.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeApartment = (id: string) => setApartments(apartments.filter((a) => a.id !== id));

  const totals = useMemo(() => {
    const data = apartments.map((a) => {
      const grossAnnualRent = a.monthlyRate * 12 * (a.occupancy / 100);
      const operatingCost = grossAnnualRent * (a.operatingExpenses / 100);
      const netOperatingIncome = grossAnnualRent - operatingCost - (a.propertyTax * grossAnnualRent / 100);
      const annualLoan = a.loanMonthly * 12;
      const beforeTaxCashFlow = netOperatingIncome - annualLoan;
      const incomeTaxBaseAmount = incomeTaxBase === "brut" ? grossAnnualRent : beforeTaxCashFlow;
      const taxable = Math.max(0, incomeTaxBaseAmount);
      const incomeTaxAmount = taxable * (a.incomeTax / 100);
      const cashFlow = beforeTaxCashFlow - incomeTaxAmount;
      const roi5 = cashFlow * 5;
      const roi10 = cashFlow * 10;
      const roi15 = cashFlow * 15;
      return { ...a, grossAnnualRent, operatingCost, netOperatingIncome, annualLoan, beforeTaxCashFlow, incomeTaxAmount, cashFlow, roi5, roi10, roi15 };
    });

    const sum = (key: keyof typeof data[0]) => data.reduce((a, b) => a + (b[key] as number), 0);

    return {
      data,
      totalRent: sum("grossAnnualRent"),
      totalNOI: sum("netOperatingIncome"),
      totalLoan: sum("annualLoan"),
      totalBeforeTax: sum("beforeTaxCashFlow"),
      totalIncomeTax: sum("incomeTaxAmount"),
      totalCashFlow: sum("cashFlow"),
      totalRoi5: sum("roi5"),
      totalRoi10: sum("roi10"),
      totalRoi15: sum("roi15"),
    };
  }, [apartments, incomeTaxBase]);

  return (
    <div className="min-h-screen w-full bg-white p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Analyse de Rentabilité – Immeuble (3 Appartements, France)</h1>
          <p className="text-slate-600">
            Ce tableau inclut l'impôt sur le revenu locatif. Vous pouvez choisir son assiette :
            <strong> Brut annuel</strong> (votre demande) ou <strong>Cashflow avant impôt</strong>.
          </p>
          <div className="flex items-center gap-3 text-sm">
            <Label htmlFor="assiette">Assiette de l'impôt</Label>
            <select
              id="assiette"
              className="rounded-md border px-2 py-1"
              value={incomeTaxBase}
              onChange={(e) => setIncomeTaxBase(e.target.value as "brut" | "preDebtCF")}
            >
              <option value="brut">Brut annuel (revenu brut)</option>
              <option value="preDebtCF">Cashflow avant impôt</option>
            </select>
          </div>
        </header>

        <Button variant="secondary" onClick={addApartment}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un appartement
        </Button>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3 text-left">Appartement</th>
                <th className="p-3 text-center">Loyer mensuel (€)</th>
                <th className="p-3 text-center">Occupation (%)</th>
                <th className="p-3 text-center">Frais d’exploitation (%)</th>
                <th className="p-3 text-center">Taxe foncière (%)</th>
                <th className="p-3 text-center">Impôt sur revenu (%)</th>
                <th className="p-3 text-center">Mensualité du prêt (€)</th>
                <th className="p-3 text-center">Revenu brut annuel</th>
                <th className="p-3 text-center">NOI</th>
                <th className="p-3 text-center">Remboursement annuel</th>
                <th className="p-3 text-center">Cashflow avant impôt</th>
                <th className="p-3 text-center">Impôt sur revenu</th>
                <th className="p-3 text-center">Cashflow net</th>
                <th className="p-3 text-center">ROI 5 ans</th>
                <th className="p-3 text-center">ROI 10 ans</th>
                <th className="p-3 text-center">ROI 15 ans</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {totals.data.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3 font-medium">{a.name}</td>
                  <td className="p-2 text-center">
                    <Input type="number" value={a.monthlyRate} onChange={(e) => updateApartment(a.id, { monthlyRate: parseFloat(e.target.value || "0") })} className="w-24 text-center" />
                  </td>
                  <td className="p-2 text-center">
                    <Input type="number" value={a.occupancy} onChange={(e) => updateApartment(a.id, { occupancy: parseFloat(e.target.value || "0") })} className="w-16 text-center" />
                  </td>
                  <td className="p-2 text-center">
                    <Input type="number" value={a.operatingExpenses} onChange={(e) => updateApartment(a.id, { operatingExpenses: parseFloat(e.target.value || "0") })} className="w-16 text-center" />
                  </td>
                  <td className="p-2 text-center">
                    <Input type="number" value={a.propertyTax} onChange={(e) => updateApartment(a.id, { propertyTax: parseFloat(e.target.value || "0") })} className="w-16 text-center" />
                  </td>
                  <td className="p-2 text-center">
                    <Input type="number" value={a.incomeTax} onChange={(e) => updateApartment(a.id, { incomeTax: parseFloat(e.target.value || "0") })} className="w-16 text-center" />
                  </td>
                  <td className="p-2 text-center">
                    <Input type="number" value={a.loanMonthly} onChange={(e) => updateApartment(a.id, { loanMonthly: parseFloat(e.target.value || "0") })} className="w-24 text-center" />
                  </td>
                  <td className="p-2 text-center">{cur(a.grossAnnualRent)}</td>
                  <td className="p-2 text-center">{cur(a.netOperatingIncome)}</td>
                  <td className="p-2 text-center">{cur(a.annualLoan)}</td>
                  <td className="p-2 text-center">{cur(a.beforeTaxCashFlow)}</td>
                  <td className="p-2 text-center text-red-600">{cur(a.incomeTaxAmount)}</td>
                  <td className="p-2 text-center text-green-700 font-medium">{cur(a.cashFlow)}</td>
                  <td className="p-2 text-center">{cur(a.roi5)}</td>
                  <td className="p-2 text-center">{cur(a.roi10)}</td>
                  <td className="p-2 text-center">{cur(a.roi15)}</td>
                  <td className="p-2 text-center">
                    <Button variant="ghost" onClick={() => removeApartment(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold border-t">
              <tr>
                <td className="p-3 text-right" colSpan={7}>Total</td>
                <td className="p-3 text-center">{cur(totals.totalRent)}</td>
                <td className="p-3 text-center">{cur(totals.totalNOI)}</td>
                <td className="p-3 text-center">{cur(totals.totalLoan)}</td>
                <td className="p-3 text-center">{cur(totals.totalBeforeTax)}</td>
                <td className="p-3 text-center text-red-600">{cur(totals.totalIncomeTax)}</td>
                <td className="p-3 text-center">{cur(totals.totalCashFlow)}</td>
                <td className="p-3 text-center">{cur(totals.totalRoi5)}</td>
                <td className="p-3 text-center">{cur(totals.totalRoi10)}</td>
                <td className="p-3 text-center">{cur(totals.totalRoi15)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-xs text-slate-500 italic">
          Méthodologie : Revenu Brut → (–) Frais d’exploitation & taxe foncière = NOI → (–) Annuités d’emprunt = Cashflow avant impôt → (–) IR locatif = Cashflow net.
        </p>
      </div>
    </div>
  );
}
