import {
    Chart as ChartJS,
    ChartType,
    ChartData,
    ChartOptions,
  } from "chart.js";
  import { useEffect, useRef, useId } from "react";
  
  type Props = {
    type: ChartType;
    data: ChartData;
    options?: ChartOptions;
  };
  
  export const SafeChart = ({ type, data, options }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<ChartJS | null>(null);
    const chartId = useId(); // 🔐 Génère un ID unique
  
    useEffect(() => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
  
      // 🧼 Détruire l'ancien graphique s'il existe
      if (chartRef.current) {
        chartRef.current.destroy();
      }
  
      // ✅ Créer un nouveau graphique avec ID unique
      chartRef.current = new ChartJS(ctx, {
        type,
        data,
        options,
      });
  
      return () => {
        chartRef.current?.destroy();
      };
    }, [type, data, options]);
  
    return <canvas id={chartId} ref={canvasRef} />;
  };
  