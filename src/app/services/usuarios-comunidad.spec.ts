import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { UsuariosComunidadService } from './usuarios-comunidad.service';
describe('UsuariosComunidadService', () => {
  let service: UsuariosComunidadService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosComunidadService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
