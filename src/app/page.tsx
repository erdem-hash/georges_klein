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
    {
      id: crypto.randomUUID(),
      name: "Appartement RDC",
      monthlyRate: 850,
      occupancy: 100,
      operatingExpenses: 15,
      propertyTax: 5,
      incomeTax: 10,
      loanMonthly: 650,
    },
    {
      id: crypto.randomUUID(),
      name: "Appartement 1",
      monthlyRate: 1000,
      occupancy: 100,
      operatingExpenses: 15,
      propertyTax: 5,
      incomeTax: 10,
      loanMonthly: 730,
    },
    {
      id: crypto.randomUUID(),
      name: "Appartement 2",
      monthlyRate: 450,
      occupancy: 100,
      operatingExpenses: 15,
      propertyTax: 5,
      incomeTax: 10,
      loanMonthly: 0,
    },
  ]);

  const [incomeTaxBase, setIncomeTaxBase] = useState<"brut" | "preDebtCF">("brut");

  const addApartment = () =>
    setApartments([
      ...apartments,
      {
        id: crypto.randomUUID(),
        name: "Nouvel Appartement",
        monthlyRate: 0,
        occupancy: 100,
        operatingExpenses: 15,
        propertyTax: 5,
        incomeTax: 10,
        loanMonthly: 0,
      },
    ]);

  const updateApartment = (id: string, patch: Partial<(typeof apartments)[0]>) =>
    setApartments(apartments.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const removeApartment = (id: string) =>
    setApartments(apartments.filter((a) => a.id !== id));

  const totals = useMemo(() => {
    const data = apartments.map((a) => {
      const grossAnnualRent = a.monthlyRate * 12 * (a.occupancy / 100);
      const operatingCost = grossAnnualRent * (a.operatingExpenses / 100);
      const netOperatingIncome =
        grossAnnualRent - operatingCost - (a.propertyTax * grossAnnualRent) / 100;
      const annualLoan = a.loanMonthly * 12;
      const beforeTaxCashFlow = netOperatingIncome - annualLoan;
      const incomeTaxBaseAmount =
        incomeTaxBase === "brut" ? grossAnnualRent : beforeTaxCashFlow;
      const taxable = Math.max(0, incomeTaxBaseAmount);
      const incomeTaxAmount = taxable * (a.incomeTax / 100);
      const cashFlow = beforeTaxCashFlow - incomeTaxAmount;
      const roi5 = cashFlow * 5;
      const roi10 = cashFlow * 10;
      const roi15 = cashFlow * 15;
      return {
        ...a,
        grossAnnualRent,
        operatingCost,
        netOperatingIncome,
        annualLoan,
        beforeTaxCashFlow,
        incomeTaxAmount,
        cashFlow,
        roi5,
        roi10,
        roi15,
      };
    });

    const sum = (key: keyof typeof data[0]) =>
      data.reduce((a, b) => a + (b[key] as number), 0);

    return {
      data,
      totalRent: sum("grossAnnualRent"),
      totalNOI: sum("netOperatingIncome"),
      totalLoan: sum("annualLoan"),
      totalBeforeTax: sum("beforeTaxCashFlow"),
      totalIncomeTax: sum("incomeTaxAmount"),
      totalCashFlow: sum("cashFlow"),
    };
  }, [apartments, incomeTaxBase]);

  return (
    <div className="min-h-screen w-full bg-white p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Analyse de Rentabilité – Immeuble (3 Appartements, France)
          </h1>
          <p className="text-slate-600">
            Ce tableau inclut l'impôt sur le revenu locatif. Vous pouvez choisir
            son assiette : <strong>Brut annuel</strong> ou{" "}
            <strong>Cashflow avant impôt</strong>.
          </p>
        </header>
        <Button onClick={addApartment}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un appartement
        </Button>
      </div>
    </div>
  );
}
