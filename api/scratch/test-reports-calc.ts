import { reportesService } from "../src/services/reportes.service";
import { prisma } from "../src/config/prisma";

async function run() {
  console.log("=== INICIANDO VALIDACIÓN DE CÁLCULO DE REPORTES ===");
  try {
    // 1. Citas por Estado
    console.log("\n--- Probando: Citas por Estado ---");
    const repEstado = await reportesService.getCitasPorEstado({});
    console.log("Totales:", repEstado.totales);
    console.log("Porcentajes:", repEstado.porcentajes);
    console.log("Total General de citas devueltas:", repEstado.citas.length);

    // Verify percentages sum up to 100 or 0
    const sumPct = Object.values(repEstado.porcentajes).reduce((a, b) => a + b, 0);
    console.log("Suma de porcentajes:", sumPct.toFixed(2) + "%");
    if (Math.abs(sumPct - 100) < 1.0 || sumPct === 0) {
      console.log("✓ Coherencia de porcentajes de citas validada.");
    } else {
      console.error("✗ ERROR: Los porcentajes no suman 100%!");
    }

    // 2. Citas por Profesional
    console.log("\n--- Probando: Citas por Profesional ---");
    const repProf = await reportesService.getCitasPorProfesional();
    console.table(repProf);
    const tutorSofia = repProf.find(p => p.nombre.includes("Sofía"));
    if (tutorSofia) {
      console.log("Métricas de Sofía:", tutorSofia);
      if (tutorSofia.totalCitas === 2 && tutorSofia.completadas === 1 && tutorSofia.porcentajeFinalizacion === 50) {
        console.log("✓ Cálculo de finalización de Sofía correcto (50.00%).");
      } else {
        console.error("✗ ERROR en métricas de Sofía:", tutorSofia);
      }
    }

    // 3. Calificaciones
    console.log("\n--- Probando: Reporte de Calificaciones ---");
    const repCal = await reportesService.getCalificacionesReport();
    console.table(repCal.map(c => ({
      nombre: c.nombre,
      promedio: c.promedioCalificacion,
      reseñas: c.cantidadResenas,
      mejor: c.mejorServicio,
      bajasCount: c.serviciosBajaCalificacion.length
    })));

    const tutorAna = repCal.find(c => c.nombre.includes("Ana"));
    if (tutorAna) {
      console.log("Calificaciones de Ana:", tutorAna);
      if (tutorAna.promedioCalificacion === 3 && tutorAna.mejorServicio.includes("Java")) {
        console.log("✓ Promedio y mejor servicio de Ana correctos.");
      } else {
        console.error("✗ ERROR en calificaciones de Ana:", tutorAna);
      }
    }

    const tutorMaria = repCal.find(c => c.nombre.includes("María"));
    if (tutorMaria) {
      console.log("Calificaciones de María (sin reseñas):", tutorMaria);
      if (tutorMaria.promedioCalificacion === 0 && tutorMaria.cantidadResenas === 0 && tutorMaria.mejorServicio === "Sin reseñas") {
        console.log("✓ Profesional sin reseñas manejado correctamente.");
      } else {
        console.error("✗ ERROR en profesional sin reseñas:", tutorMaria);
      }
    }

    console.log("\n=== VALIDACIÓN COMPLETADA CON ÉXITO ===");
  } catch (error) {
    console.error("Error en validación de reportes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
