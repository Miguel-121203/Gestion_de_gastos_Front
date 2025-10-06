import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportData {
  headers: string[];
  rows: any[][];
  title: string;
  filename: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Exporta datos a Excel (.xlsx)
   * @param data Datos a exportar
   */
  exportToExcel(data: ExportData): void {
    try {
      // Crear un nuevo workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear worksheet con los datos
      const worksheet = XLSX.utils.aoa_to_sheet([
        data.headers,
        ...data.rows
      ]);

      // Configurar ancho de columnas
      const colWidths = data.headers.map((_, index) => {
        const maxLength = Math.max(
          data.headers[index].length,
          ...data.rows.map(row => String(row[index] || '').length)
        );
        return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
      });
      worksheet['!cols'] = colWidths;

      // Agregar el worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

      // Generar y descargar el archivo
      const filename = `${data.filename}_${this.getCurrentDateString()}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
      console.log(`Archivo Excel exportado: ${filename}`);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      throw new Error('Error al exportar a Excel');
    }
  }

  /**
   * Exporta datos a PDF
   * @param data Datos a exportar
   */
  exportToPDF(data: ExportData): void {
    try {
      const doc = new jsPDF();
      
      // Configurar fuente y tamaño
      doc.setFont('helvetica');
      
      // Agregar título
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(data.title, 14, 22);
      
      // Agregar fecha de exportación
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Exportado el: ${this.getCurrentDateTimeString()}`, 14, 30);
      
      // Configurar tabla
      const tableConfig = {
        head: [data.headers],
        body: data.rows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: {
          fillColor: [1, 64, 71], // Color #014047
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250] // Color gris claro
        },
        columnStyles: {
          // Estilos específicos por columna si es necesario
        },
        margin: { top: 40, right: 14, bottom: 14, left: 14 }
      };

      // Generar tabla
      doc.autoTable(tableConfig);

      // Agregar pie de página
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }

      // Descargar archivo
      const filename = `${data.filename}_${this.getCurrentDateString()}.pdf`;
      doc.save(filename);
      
      console.log(`Archivo PDF exportado: ${filename}`);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      throw new Error('Error al exportar a PDF');
    }
  }

  /**
   * Prepara datos de gastos para exportación
   * @param gastos Array de gastos
   * @param tipo Tipo de exportación ('excel' | 'pdf')
   */
  prepareGastosData(gastos: any[], tipo: 'excel' | 'pdf'): ExportData {
    const headers = ['ID', 'Fecha', 'Categoría', 'Monto', 'Descripción'];
    
    const rows = gastos.map(gasto => [
      gasto.id || '',
      gasto.fecha || '',
      gasto.categoria || '',
      this.formatCurrency(gasto.monto),
      gasto.descripcion || ''
    ]);

    return {
      headers,
      rows,
      title: 'Reporte de Gastos',
      filename: 'gastos'
    };
  }

  /**
   * Prepara datos de ingresos para exportación
   * @param ingresos Array de ingresos
   * @param tipo Tipo de exportación ('excel' | 'pdf')
   */
  prepareIngresosData(ingresos: any[], tipo: 'excel' | 'pdf'): ExportData {
    const headers = ['Fecha', 'Categoría', 'Monto', 'Descripción'];
    
    const rows = ingresos.map(ingreso => [
      ingreso.fecha || '',
      ingreso.categoria || '',
      this.formatCurrency(ingreso.monto),
      ingreso.descripcion || ''
    ]);

    return {
      headers,
      rows,
      title: 'Reporte de Ingresos',
      filename: 'ingresos'
    };
  }

  /**
   * Formatea un monto como moneda colombiana
   * @param monto Monto a formatear
   */
  private formatCurrency(monto: number | string): string {
    if (typeof monto === 'string') {
      // Si ya está formateado como string, devolverlo tal como está
      return monto;
    }
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(monto);
  }

  /**
   * Obtiene la fecha actual en formato string para nombres de archivo
   */
  private getCurrentDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * Obtiene la fecha y hora actual en formato string
   */
  private getCurrentDateTimeString(): string {
    const now = new Date();
    return now.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Exporta gastos a Excel
   * @param gastos Array de gastos
   */
  exportGastosToExcel(gastos: any[]): void {
    const data = this.prepareGastosData(gastos, 'excel');
    this.exportToExcel(data);
  }

  /**
   * Exporta gastos a PDF
   * @param gastos Array de gastos
   */
  exportGastosToPDF(gastos: any[]): void {
    const data = this.prepareGastosData(gastos, 'pdf');
    this.exportToPDF(data);
  }

  /**
   * Exporta ingresos a Excel
   * @param ingresos Array de ingresos
   */
  exportIngresosToExcel(ingresos: any[]): void {
    const data = this.prepareIngresosData(ingresos, 'excel');
    this.exportToExcel(data);
  }

  /**
   * Exporta ingresos a PDF
   * @param ingresos Array de ingresos
   */
  exportIngresosToPDF(ingresos: any[]): void {
    const data = this.prepareIngresosData(ingresos, 'pdf');
    this.exportToPDF(data);
  }
}
