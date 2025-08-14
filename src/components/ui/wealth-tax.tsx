"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = {
  aksjerProsent: number;
  formueNyttaar: number;
  utgifter: number;
  inntekter: number;
};

export default function WealthTaxForm() {
  const [result, setResult] = useState<{
    dinFormue: number;
    etterSkatterabatt: number;
    etterBunnfradrag: number;
    formueskatt: number;
    skattPaaUttak: number;
    resultatDrift: number;
  } | null>(null);

  const BUNNFRADRAG = 1700000; // kan gjøres dynamisk
  const SKATTERABATT = 0.8; // 20% rabatt
  const FORMUESKATT_SATS = 0.01; // 1%
  const UTTAK_SATS = 0.3; // 30%

  const form = useForm<FormValues>({
    defaultValues: {
      aksjerProsent: 0,
      formueNyttaar: 0,
      utgifter: 0,
      inntekter: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    const { aksjerProsent, formueNyttaar, utgifter, inntekter } = data;

    const dinFormue = (formueNyttaar * aksjerProsent) / 100;
    const etterSkatterabatt = dinFormue * SKATTERABATT;
    const etterBunnfradrag = Math.max(etterSkatterabatt - BUNNFRADRAG, 0);
    const formueskatt = etterBunnfradrag * FORMUESKATT_SATS;
    const skattPaaUttak = formueskatt / (1 - UTTAK_SATS) - formueskatt;

    const resultatDrift = inntekter - utgifter;

    setResult({
      dinFormue,
      etterSkatterabatt,
      etterBunnfradrag,
      formueskatt,
      skattPaaUttak,
      resultatDrift,
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "aksjerProsent", label: "Dine aksjer i prosent (%)" },
            {
              name: "formueNyttaar",
              label: "Samlet verdier over nyttår (NOK)",
            },
            { name: "utgifter", label: "Utgifter (NOK)" },
            { name: "inntekter", label: "Inntekter (NOK)" },
          ].map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit">Beregn skatt</Button>
        </form>
      </Form>

      {result && (
        <div className="mt-6 p-4 border rounded-md space-y-2 bg-gray-50">
          <p>
            <strong>Din andel av formuen:</strong>{" "}
            {result.dinFormue.toLocaleString("no-NO")} NOK
          </p>
          <p>
            <strong>Etter skatterabatt:</strong>{" "}
            {result.etterSkatterabatt.toLocaleString("no-NO")} NOK
          </p>
          <p>
            <strong>Etter bunnfradrag:</strong>{" "}
            {result.etterBunnfradrag.toLocaleString("no-NO")} NOK
          </p>
          <p>
            <strong>Formuesskatt (etter bunnfradrag):</strong>{" "}
            {result.formueskatt.toLocaleString("no-NO")} NOK
          </p>
          <p>
            <strong>
              Skatt selskapet må betale for å utbetale penger til skatt:
            </strong>{" "}
            {result.skattPaaUttak.toLocaleString("no-NO")} NOK
          </p>
          <hr />
          <p className="font-semibold">
            Totalkostnad for selskapet:{" "}
            {(result.formueskatt + result.skattPaaUttak).toLocaleString(
              "no-NO"
            )}{" "}
            NOK
          </p>
          <p
            className={`font-semibold ${
              result.resultatDrift < 0 ? "text-red-600" : "text-gray-800"
            }`}
          >
            Resultat (inntekt - utgift):{" "}
            {result.resultatDrift.toLocaleString("no-NO")} NOK
          </p>
          {result.resultatDrift < 0 && (
            <p className="text-sm text-red-500 italic">
              Selv med negativt resultat må formuesskatten betales.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
