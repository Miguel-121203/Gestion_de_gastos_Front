import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosConsulta } from './gastos-consulta';

describe('GastosConsulta', () => {
  let component: GastosConsulta;
  let fixture: ComponentFixture<GastosConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GastosConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
