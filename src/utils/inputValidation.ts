
import { z } from 'zod';

// Enhanced validation schemas
export const pnoSchema = z.string()
  .min(1, 'PNO is required')
  .regex(/^[A-Z0-9]{6,12}$/, 'PNO must be 6-12 alphanumeric characters');

export const mobileSchema = z.string()
  .min(1, 'Mobile number is required')
  .regex(/^[6-9]\d{9}$/, 'Mobile number must be a valid 10-digit Indian number');

export const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long');

export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters');

export const addressSchema = z.string()
  .min(1, 'Address is required')
  .max(500, 'Address too long');

export const dateSchema = z.string()
  .min(1, 'Date is required')
  .refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date format');

export const futureDateSchema = z.string()
  .min(1, 'Date is required')
  .refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsedDate >= today;
  }, 'Date cannot be in the past');

export const pastDateSchema = z.string()
  .min(1, 'Date is required')
  .refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    return parsedDate <= today;
  }, 'Date cannot be in the future');

// Sanitization functions
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}

// Rate limiting utility (client-side)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
