import confima from "../../src/index"

describe("config validation", () => {
  const schema = {
    type: "object",
    properties: {
      one: {
        type: "object",
        properties: {
          two: {
            type: "object",
            properties: {
              three: {
                type: "object",
                properties: {
                  a: { type: "number" },
                  b: { type: "string" },
                  c: {
                    type: "object",
                    properties: {
                      first: { type: "boolean" },
                      second: { type: "boolean" }
                    }
                  },
                  array: { type: "array", items: { type: "number" } },
                  d: { type: "number" }
                }
              }
            }
          }
        }
      }
    }
  }

  test("not throw on correct values", () => {
    expect(
      confima()
        .setSchema(schema)
        .fromFile("tests/fixtures/merges-first.yaml")
        .fromFile("tests/fixtures/merges-second.yaml")
        .build
    ).not.toThrow()
  })

  test("throw on incorrect values", () => {
    expect(
      confima()
        .setSchema(schema)
        .fromFile("tests/fixtures/merges-first.yaml")
        .build
    ).toThrow()
  })
})
