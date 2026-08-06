import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Cita } from '../models/cita.model';

const pdfMakeInstance = (pdfMake as any).default || pdfMake;

pdfMakeInstance.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  /**
   * Exporta un listado de citas a un archivo PDF estructurado y estilizado.
   * @param citas Listado de citas a exportar
   */
  exportarCitasPdf(citas: Cita[]): void {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Formatear filas de datos para la tabla
    const tablaCitas = citas.map((cita) => {
      const clienteNombre = cita.cliente 
        ? `${cita.cliente.nombre ?? ''} ${cita.cliente.apellidos ?? ''}`.trim() 
        : 'N/A';
      
      const tutorNombre = cita.tutor?.usuario
        ? `${cita.tutor.usuario.nombre ?? ''} ${cita.tutor.usuario.apellidos ?? ''}`.trim()
        : 'N/A';

      const servicioNombre = cita.servicio?.nombre ?? 'Servicio General';
      
      // Formatear fecha (YYYY-MM-DD a DD/MM/YYYY)
      let fechaFormateada = 'N/A';
      if (cita.fechaCita) {
        const fechaObj = new Date(cita.fechaCita);
        if (!isNaN(fechaObj.getTime())) {
          // Ajuste UTC para evitar desfasaje de fecha por zona horaria local
          const dia = String(fechaObj.getUTCDate()).padStart(2, '0');
          const mes = String(fechaObj.getUTCMonth() + 1).padStart(2, '0');
          const anio = fechaObj.getUTCFullYear();
          fechaFormateada = `${dia}/${mes}/${anio}`;
        }
      }

      const horario = `${cita.horaInicio} - ${cita.horaFin || '--:--'}`;
      const estado = cita.estado || 'PENDIENTE';

      return [
        { text: `#${cita.id}`, style: 'cellId', alignment: 'center' as const },
        { text: clienteNombre, style: 'cellText' },
        { text: tutorNombre, style: 'cellText' },
        { text: servicioNombre, style: 'cellText' },
        { text: fechaFormateada, style: 'cellText', alignment: 'center' as const },
        { text: horario, style: 'cellText', alignment: 'center' as const },
        { text: estado, style: `status_${estado.toLowerCase()}`, alignment: 'center' as const }
      ];
    });

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 80, 40, 60],

      // Encabezado de la página (se repite en todas)
      header: (currentPage: number) => {
        return {
          margin: [40, 20, 40, 0],
          columns: [
            {
              stack: [
                { text: 'EDULINK', fontSize: 16, bold: true, color: '#10b981', letterSpacing: 1.5 },
                { text: 'Sistema de Tutorías y Citas', fontSize: 8, color: '#64748b' }
              ]
            },
            {
              stack: [
                { text: 'REPORTE GENERAL DE CITAS', alignment: 'right', fontSize: 12, bold: true, color: '#1e293b' },
                { text: `Página ${currentPage}`, alignment: 'right', fontSize: 9, color: '#64748b' }
              ]
            }
          ]
        };
      },

      // Contenido principal del documento
      content: [
        // Línea decorativa del encabezado
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 762, y2: 0, lineWidth: 1, strokeColor: '#e2e8f0' }
          ],
          margin: [0, 0, 0, 15]
        },
        // Título y Metadatos
        {
          columns: [
            {
              stack: [
                { text: 'Reporte de Agenda de Citas', style: 'mainTitle' },
                { text: `Registros exportados: ${citas.length}`, style: 'subtitle' }
              ]
            },
            {
              text: `Fecha de emisión:\n${fechaActual}`,
              alignment: 'right',
              style: 'metadata'
            }
          ],
          margin: [0, 0, 0, 25]
        },
        // Tabla de datos
        {
          style: 'tableContainer',
          table: {
            headerRows: 1,
            widths: [35, '*', '*', '*', 70, 80, 80],
            body: [
              // Encabezado de la Tabla
              [
                { text: 'ID', style: 'tableHeader', alignment: 'center' },
                { text: 'Cliente', style: 'tableHeader' },
                { text: 'Profesional / Tutor', style: 'tableHeader' },
                { text: 'Servicio', style: 'tableHeader' },
                { text: 'Fecha', style: 'tableHeader', alignment: 'center' },
                { text: 'Horario', style: 'tableHeader', alignment: 'center' },
                { text: 'Estado', style: 'tableHeader', alignment: 'center' }
              ],
              // Filas de Datos
              ...tablaCitas
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#1e293b'; // Fondo del Header
              return rowIndex % 2 === 0 ? '#f8fafc' : null; // Cebra
            },
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5;
            },
            vLineWidth: () => 0, // Sin líneas verticales para diseño moderno
            hLineColor: (i: number, node: any) => {
              return i === 0 || i === 1 || i === node.table.body.length ? '#cbd5e1' : '#f1f5f9';
            },
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 8,
            paddingBottom: () => 8
          }
        }
      ],

      // Pie de página dinámico (con numeración de páginas)
      footer: (currentPage: number, pageCount: number) => {
        return {
          margin: [40, 0, 40, 0],
          columns: [
            { text: 'EduLink © 2026 - Todos los derechos reservados.', fontSize: 8, color: '#94a3b8' },
            { 
              text: `Página ${currentPage} de ${pageCount}`, 
              alignment: 'right', 
              fontSize: 8, 
              color: '#94a3b8', 
              bold: true 
            }
          ]
        };
      },

      styles: {
        mainTitle: {
          fontSize: 20,
          bold: true,
          color: '#0f172a'
        },
        subtitle: {
          fontSize: 10,
          color: '#64748b',
          margin: [0, 2, 0, 0]
        },
        metadata: {
          fontSize: 9,
          color: '#64748b',
          lineHeight: 1.2
        },
        tableContainer: {
          margin: [0, 0, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: '#ffffff',
          margin: [0, 2, 0, 2]
        },
        cellId: {
          fontSize: 9,
          color: '#64748b',
          bold: true
        },
        cellText: {
          fontSize: 9,
          color: '#334155'
        },
        status_pendiente: {
          fontSize: 9,
          bold: true,
          color: '#d97706' // Ámbar
        },
        status_aceptada: {
          fontSize: 9,
          bold: true,
          color: '#2563eb' // Azul
        },
        status_rechazada: {
          fontSize: 9,
          bold: true,
          color: '#dc2626' // Rojo
        },
        status_cancelada: {
          fontSize: 9,
          bold: true,
          color: '#4b5563' // Gris oscuro
        },
        status_completada: {
          fontSize: 9,
          bold: true,
          color: '#16a34a' // Verde
        }
      }
    };

    // Generar y descargar el PDF
    pdfMakeInstance.createPdf(docDefinition).download(`Reporte_Citas_EduLink_${Date.now()}.pdf`);
  }
}
