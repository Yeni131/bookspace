import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { BookDetailPage } from './book-detail.page';
describe('BookDetailPage', () => {
  let component: BookDetailPage;
  let fixture: ComponentFixture<BookDetailPage>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'test-libro' })
            },
            paramMap: of(convertToParamMap({ id: 'test-libro' }))
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(BookDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
