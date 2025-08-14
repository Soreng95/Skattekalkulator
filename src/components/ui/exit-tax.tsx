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
  aksjerProsent: number; // Din eierandel i %
  solgtProsent: number; // Hvor stor del av selskapet som investeringen gjelder (%)
  investering: number; // Investeringsbeløp for solgte aksjer
};

export default function ExitTax() {
  const [result, setResult] = useState<{
    papirverdiSelskap: number;
    dinAndel: number;
    exitSkatt: number;
    bruttoLonn: number;
    inntektsskatt: number;
    aga: number;
    totalUttakSkatt: number;
    totalSelskapskostnad: number;
    etterSkattInvestering: number;
  } | null>(null);

  const EXIT_SKATT_SATS = 0.3784; // 37,84 %
  const TOPPSKATT_SATS = 0.419; // 41,9 %
  const AGA_SATS = 0.141; // 14,1 %

  const form = useForm<FormValues>({
    defaultValues: {
      aksjerProsent: 0,
      solgtProsent: 0,
      investering: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    const { aksjerProsent, solgtProsent, investering } = data;

    if (solgtProsent <= 0) {
      alert("Solgt prosent må være større enn 0");
      return;
    }

    // Beregn hele selskapets papirverdi
    const papirverdiSelskap = investering / (solgtProsent / 100);

    // Din andel av selskapet (basert på aksjerProsent)
    const dinAndelFull = (papirverdiSelskap * aksjerProsent) / 100;

    // Exit-skatt privat på hele din andel
    const exitSkatt = dinAndelFull * EXIT_SKATT_SATS;

    // Bruttolønn som må utbetales for at du skal sitte igjen med exit-skatt etter inntektsskatt
    const bruttoLonn = exitSkatt / (1 - TOPPSKATT_SATS);

    // Inntektsskatt-delen
    const inntektsskatt = bruttoLonn * TOPPSKATT_SATS;

    // Arbeidsgiveravgift
    const aga = bruttoLonn * AGA_SATS;

    // Total ekstra kostnad for å betale ut penger til skatten
    const totalUttakSkatt = inntektsskatt + aga;

    // Totalkostnad for selskapet (selve exit-skatten + kostnadene ved uttak)
    const totalSelskapskostnad = exitSkatt + totalUttakSkatt;

    // Investering - totalkostnad
    const etterSkattInvestering = investering - totalSelskapskostnad;

    setResult({
      papirverdiSelskap,
      dinAndel: dinAndelFull,
      exitSkatt,
      bruttoLonn,
      inntektsskatt,
      aga,
      totalUttakSkatt,
      totalSelskapskostnad,
      etterSkattInvestering,
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "aksjerProsent", label: "Dine aksjer i prosent (%)" },
            {
              name: "investering",
              label: "Investering for solgte aksjer (NOK)",
            },
            { name: "solgtProsent", label: "Solgt aksjer i prosent (%)" },
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

          <Button type="submit">Beregn exit-skatt</Button>
        </form>
      </Form>

      {result && (
        <div className="mt-6 p-4 border rounded-md space-y-2 bg-gray-50">
          <p>
            <strong>Papirverdi på selskapet:</strong>{" "}
            {result.papirverdiSelskap.toLocaleString("no-NO")} NOK
          </p>
          <p>
            <strong>Din andel av papirverdien:</strong>{" "}
            {result.dinAndel.toLocaleString("no-NO")} NOK
          </p>
          <p>
            <strong>Din private exit-skatt hvis du flytter:</strong>{" "}
            {result.exitSkatt.toLocaleString("no-NO")} NOK
          </p>
          <div className="pl-4">
            <p>
              <strong>Inntektsskatt:</strong>{" "}
              {result.inntektsskatt.toLocaleString("no-NO")} NOK
            </p>
            <p>
              <strong>Arbeidsgiveravgift:</strong>{" "}
              {result.aga.toLocaleString("no-NO")} NOK
            </p>
            <p>
              <strong>
                Total skatt for å betale ut penger for å betale exit-skatten:
              </strong>{" "}
              {result.totalUttakSkatt.toLocaleString("no-NO")} NOK
            </p>
          </div>
          <hr />
          <p className="font-semibold">
            Total selskapskostnad:{" "}
            {result.totalSelskapskostnad.toLocaleString("no-NO")} NOK
          </p>
          <p
            className={`font-semibold ${
              result.etterSkattInvestering < 0
                ? "text-red-600"
                : "text-gray-800"
            }`}
          >
            Investeringen - skattekostnaden:{" "}
            {result.etterSkattInvestering.toLocaleString("no-NO")} NOK
          </p>
        </div>
      )}
    </div>
  );
}
