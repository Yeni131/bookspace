import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ResenasComunidadService } from './resenas-comunidad.service';
describe('ResenasComunidadService', () => {
  let service: ResenasComunidadService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResenasComunidadService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
