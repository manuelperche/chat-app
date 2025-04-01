import mongoose from "mongoose";
import * as SessionService from "../services/session.service";
import Session from "../models/session.model";
import * as UserService from "../services/user.service"; 
import { createUserSessionHandler } from "../controllers/session.controller";

// Mock the Session model
jest.mock("../models/session.model");

describe("Session Service", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const sessionId = new mongoose.Types.ObjectId().toString();

  const userPayload = {
    _id: userId,
    email: "jane.doe@example.com",
    fullName: "Jane Doe",
  };

  const sessionPayload = {
    _id: sessionId,
    user: userId,
    valid: true,
    userAgent: "TestAgent/1.0",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a signed accessToken & refresh token", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          // @ts-expect-error - mockReturnValue is not typed
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, "createSession")
          // @ts-expect-error - mockReturnValue is not typed
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return "a user agent";
          },
          body: {
            email: "test@example.com",
            password: "Password123",
          },
        };

        const send = jest.fn();
        const cookie = jest.fn();

        const res = {
          send,
          cookie,
        };

        // @ts-expect-error - req and res are not typed
        await createUserSessionHandler(req, res);

        expect(cookie).toHaveBeenCalledTimes(2);
        
        expect(cookie.mock.calls[0][0]).toBe("accessToken");
        expect(cookie.mock.calls[0][1]).toEqual(expect.any(String));
        
        expect(cookie.mock.calls[1][0]).toBe("refreshToken");
        expect(cookie.mock.calls[1][1]).toEqual(expect.any(String));

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });

  describe("findSessions", () => {
    it("should find sessions for a user", async () => {
      // Mock the Session.find method with chained lean method
      const mockLean = jest.fn().mockResolvedValue([sessionPayload]);
      (Session.find as jest.Mock).mockReturnValue({
        lean: mockLean
      });

      const result = await SessionService.findSessions({
        user: userId,
        valid: true,
      });

      expect(Session.find).toHaveBeenCalledWith({ user: userId, valid: true });
      expect(result).toEqual([sessionPayload]);
    });
  });

  describe("updateSession", () => {
    it("should update a session", async () => {
      // Mock the Session.updateOne method
      (Session.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

      const result = await SessionService.updateSession(
        { _id: sessionId },
        { valid: false }
      );

      expect(Session.updateOne).toHaveBeenCalledWith(
        { _id: sessionId },
        { valid: false }
      );
      expect(result.modifiedCount).toBe(1);
    });
  });
});
