import convertToUniqueArray from '../../src/middleware/convertToUniqueArray';
import { Request, Response, NextFunction } from 'express';

describe('convertToUniqueArray middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {};
    next = jest.fn();
  });

  it('should convert a single teacher string to an array', () => {
    req.query.teacher = 'teacher1@example.com';
    convertToUniqueArray(req as Request, res as Response, next);
    expect(req.query.teacher).toEqual(['teacher1@example.com']);
    expect(next).toHaveBeenCalled();
  });

  it('should remove duplicate teacher emails from the array', () => {
    req.query.teacher = ['teacher1@example.com', 'teacher1@example.com', 'teacher2@example.com'];
    convertToUniqueArray(req as Request, res as Response, next);
    expect(req.query.teacher).toEqual(['teacher1@example.com', 'teacher2@example.com']);
    expect(next).toHaveBeenCalled();
  });

  it('should not modify the array if there are no duplicates', () => {
    req.query.teacher = ['teacher1@example.com', 'teacher2@example.com'];
    convertToUniqueArray(req as Request, res as Response, next);
    expect(req.query.teacher).toEqual(['teacher1@example.com', 'teacher2@example.com']);
    expect(next).toHaveBeenCalled();
  });
  
});
