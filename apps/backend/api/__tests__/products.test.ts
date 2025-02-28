import type { DeepMockProxy } from "jest-mock-extended";
import { mockDeep } from "jest-mock-extended";
import { createCaller } from "../routers";
import type { db } from "../utils/db";

const drizzleMock: DeepMockProxy<typeof db> = mockDeep();
const caller = createCaller({ db: drizzleMock });

describe("Products", () => {
  it("Should return a list of products", async () => {
    const mockOutput: any[] = [
      {
        comments: [
          {
            createdAt: "2024-06-11T01:12:21.607Z",
            id: "Testing",
            name: "Tester",
            productId: "Tester",
            text: "Cool plane",
            updatedAt: "2024-06-11T01:12:21.607Z",
          },
        ],
        dislikes: 6,
        id: "Tester",
        likes: 23,
        modelFileName: "Testing",
        name: "Plane",
      },
    ];

    drizzleMock.query.ProductTable.findMany.mockResolvedValue(mockOutput);

    const posts = await caller.products.getProducts();

    expect(posts).toStrictEqual(mockOutput);
  });
});
