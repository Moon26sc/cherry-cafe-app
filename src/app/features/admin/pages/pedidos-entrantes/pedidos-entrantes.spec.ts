import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosEntrantes } from './pedidos-entrantes';

describe('PedidosEntrantes', () => {
  let component: PedidosEntrantes;
  let fixture: ComponentFixture<PedidosEntrantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosEntrantes],
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosEntrantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
