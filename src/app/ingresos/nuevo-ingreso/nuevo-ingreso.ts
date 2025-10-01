import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CalendarDay {
  day: number;
  date: Date;
  disabled: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-nuevo-ingreso',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './nuevo-ingreso.html',
  styleUrl: './nuevo-ingreso.css'
})
export class NuevoIngreso {
  // Fecha seleccionada
  selectedDate: Date | null = null;
  selectedDateFormatted: string = '';
  
  // Date picker
  showDatePicker: boolean = false;
  currentDate: Date = new Date();
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  
  dayHeaders: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  calendarDays: CalendarDay[] = [];
  tempSelectedDate: Date | null = null;
  
  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor() {
    this.currentYear = new Date().getFullYear();
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return this.monthNames[this.currentMonth];
  }

  openDatePicker() {
    this.showDatePicker = true;
    this.tempSelectedDate = this.selectedDate;
    this.generateCalendar();
  }

  closeDatePicker() {
    this.showDatePicker = false;
    this.tempSelectedDate = null;
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(day: CalendarDay) {
    if (!day.disabled) {
      this.tempSelectedDate = day.date;
      this.generateCalendar();
    }
  }

  confirmDate() {
    if (this.tempSelectedDate) {
      this.selectedDate = new Date(this.tempSelectedDate);
      this.selectedDateFormatted = this.formatDate(this.selectedDate);
    }
    this.closeDatePicker();
  }

  preventTyping(event: KeyboardEvent) {
    event.preventDefault();
  }

  private generateCalendar() {
    this.calendarDays = [];
    const today = new Date();
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isToday = this.isSameDay(date, today);
      const isDisabled = date < today || date.getMonth() !== this.currentMonth;
      const isSelected = this.tempSelectedDate ? this.isSameDay(date, this.tempSelectedDate) : false;

      this.calendarDays.push({
        day: date.getDate(),
        date: new Date(date),
        disabled: isDisabled,
        isToday: isToday,
        isSelected: isSelected
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }
}
