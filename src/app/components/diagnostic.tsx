"use client";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { ApiService, type sintomas } from "../services/api";
import { sintomasClasificados } from "../utils/sintomas";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Card } from "../../components/ui/card";

export interface diagnosticoResponse {
  recomendacion: string;
  dosis: string;
  explicacion: string;
}

export default function Diagnostic() {
  const [sintomas, setSintomas] = useState<sintomas>({ sintomas: [] });
  const [diagnosticoResult, setDiagnosticoResult] = useState<diagnosticoResponse>({
    recomendacion: "",
    dosis: "",
    explicacion: "",
  });
  const [open, setOpen] = useState(false);

  const obtenerDiagnostico = async () => {
    if (sintomas.sintomas.length === 0) {
      toast.error("Por favor, seleccione al menos un síntoma.");
      return;
    }
    try {
      const res = new ApiService();
      const diagnostico = await res.getDiagnostics(sintomas);
      setDiagnosticoResult(diagnostico);
      setOpen(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error("Error al obtener el diagnóstico: " + msg);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="border-b px-6 py-4 bg-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon="lucide:activity" className="text-blue-600 text-2xl" />
          <h1 className="text-xl font-semibold text-blue-800">Sistema Experto Médico</h1>
        </div>
      </header>

      {/* INTRO */}
      <Card className="m-6 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:stethoscope" className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-semibold">
              Asistente de Diagnóstico con los 38 Remedios del Dr. Bach
            </h2>
          </div>
          <p className="text-gray-700">
            Seleccione los síntomas que está experimentando. El sistema sugerirá remedios naturales.
            <span className="text-red-600 font-semibold"> No sustituye una consulta médica.</span>
          </p>
        </div>
      </Card>

      {/* MAIN CONTENT */}
      <div className="grid md:grid-cols-3 gap-6 px-6">
        {/* SÍNTOMAS */}
        
        <div className="md:col-span-2">
            <Card className="p-4 mb-4 shadow shadow-gray-300">
          {sintomasClasificados.map((categoria, i) => (
            <Card key={i} className="p-4 mb-2">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {categoria.categoria}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categoria.sintomas.map((sintoma, idx) => (
                  <label key={idx} className="flex items-start text-sm text-gray-800">
                    <input
                      type="checkbox"
                      value={sintoma}
                      checked={sintomas.sintomas.includes(sintoma)}
                      onChange={(e) => {
                        const newList = e.target.checked
                          ? [...sintomas.sintomas, sintoma]
                          : sintomas.sintomas.filter((s) => s !== sintoma);
                        setSintomas({ sintomas: newList });
                      }}
                      className="mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="capitalize break-words">{sintoma.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}

          <div className="flex  my-3 justify-end">
            <button
              type="button"
              
              onClick={obtenerDiagnostico}
              className="flex items-center  bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Icon icon="material-symbols:medical-information" className="mr-2" />
              Obtener Diagnóstico
            </button>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl text-black">
                  Diagnóstico
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <p>
                  <strong>Recomendación:</strong>{" "}
                  <span className="text-gray-700">{diagnosticoResult.recomendacion}</span>
                </p>
                <p>
                  <strong>Dosis:</strong>{" "}
                  <span className="text-gray-700">{diagnosticoResult.dosis}</span>
                </p>
                <p>
                  <strong>Explicación:</strong>{" "}
                  <span className="text-gray-700">{diagnosticoResult.explicacion}</span>
                </p>
              </div>
            </DialogContent>
          </Dialog>
          </Card>
        </div>

        {/* INFO */}
        <Card className="p-6 mb-4">
          <h3 className="text-lg font-semibold mb-2">Información</h3>
          <div className="space-y-4 text-gray-600 text-sm">
            <div className="flex items-start gap-2">
              <Icon icon="lucide:info" className="text-blue-500 mt-1" />
              <p>Seleccione todos los síntomas que está experimentando.</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon="lucide:alert-triangle" className="text-yellow-500 mt-1" />
              <p>Esto no reemplaza el consejo médico profesional.</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon="lucide:shield" className="text-green-600 mt-1" />
              <p>Sus datos no se almacenan. Consulta anónima.</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon="lucide:heart-pulse" className="text-red-500 mt-1" />
              <p>En emergencias, contacte servicios médicos inmediatamente.</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon="material-symbols:settings-account-box-rounded" className="text-red-500 mt-1" />
              <p>Desarrollado por Eider Yesid Obando y Valeria Bastidas Torres.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
