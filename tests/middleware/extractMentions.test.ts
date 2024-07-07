import { extractMentions } from '../../src/middleware/extractMentions';
import { Request, Response } from 'express';
import { jest } from '@jest/globals';

describe('extractMentions Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if notification is not provided', () => {
    extractMentions(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing Notifications" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should extract mentioned emails from notification', () => {
    req.body.notification = "Hello @john.doe@example.com and @jane.doe@example.com";

    extractMentions(req as Request, res as Response, next);

    expect(req.body.mentionedEmails).toEqual(['john.doe@example.com', 'jane.doe@example.com']);
    expect(next).toHaveBeenCalled();
  });

  it('should handle notifications with no mentioned emails', () => {
    req.body.notification = "Hello everyone";

    extractMentions(req as Request, res as Response, next);

    expect(req.body.mentionedEmails).toEqual([]);
    expect(next).toHaveBeenCalled();
  });
});
