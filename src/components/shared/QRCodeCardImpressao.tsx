"use client";

import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { Logo } from "./Logo";

interface QRCodeCardImpressaoProps {
  url: string;
  academiaLogoUrl?: string | null;
  academiaNome?: string;
  tipo: "exercicio" | "treino";
  nomeItem: string;
}

export function QRCodeCardImpressao({
  url,
  academiaLogoUrl,
  academiaNome,
  tipo,
  nomeItem,
}: QRCodeCardImpressaoProps) {
  return (
    <div
      className="bg-primary dark:bg-gray-800 p-3 flex flex-col items-center justify-start border-2 border-gray-300 dark:border-gray-600 rounded-2xl print:border print:border-gray-400 print:rounded-2xl"
      style={{ width: "5.398cm", height: "8.56cm" }}
    >
      <div className="flex flex-col items-center w-full flex-1 min-h-0 gap-5">
        {academiaLogoUrl ? (
          <div
            className="rounded-2xl overflow-hidden border border-white/30 bg-white/10 flex items-center justify-center flex-shrink-0"
            style={{ width: 208, height: 208 }}
          >
            <Image
              src={academiaLogoUrl}
              alt={academiaNome || "Logo"}
              width={208}
              height={208}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{ height: 208 }}
          >
            <Logo width={200} height={72} />
          </div>
        )}
        <div className="bg-white p-2 rounded-2xl flex-shrink-0 shadow-inner">
          <QRCodeSVG value={url} size={190} level="M" />
        </div>
        <div className="text-center w-full flex-shrink-0">
          <p className="text-xl font-bold text-white/90 mb-2">
            {tipo === "exercicio" ? "EXERCÍCIO" : "TREINO"}
          </p>
          <p className="text-lg text-white leading-snug break-words">
            {nomeItem}
          </p>
        </div>
      </div>
    </div>
  );
}
