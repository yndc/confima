import confima from "~/index"
import { JSONSchema7 as JsonSchema } from "json-schema"

describe("config validation", () => {
  const schema: JsonSchema = {
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
        .schema(schema)
        .file("tests/fixtures/merges-first.yaml")
        .file("tests/fixtures/merges-second.yaml")
        .load
    ).not.toThrow()
  })

  test("throw on incorrect values", () => {
    expect(
      confima()
        .schema(schema)
        .file("tests/fixtures/merges-first.yaml")
        .load
    ).toThrow()
  })
})
