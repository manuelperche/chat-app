import supertest from "supertest";
import { createServer } from "../server";

describe("Server", () => {
  it("health check returns 200", async () => {
    await supertest(createServer())
      .get("/ping")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("pong 🏓");
      });
  });
});
