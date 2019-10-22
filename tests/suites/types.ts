import confima from "~/index"

describe("load config from files", () => {
  const types = {
    number: 123,
    string: "str",
    boolean: true,
    array: [1, 2, 3],
    object: {
      member: "hello"
    },
    some: {
      deep: {
        object: {
          member: "hello",
          array: ["hello", "world"]
        }
      }
    }
  }

  test("js extension", () => {
    expect(
      confima()
        .file("tests/fixtures/types.js")
        .load()
    ).toEqual(types)
  })

  test("yaml extension", () => {
    expect(
      confima()
        .file("tests/fixtures/types.yaml")
        .load()
    ).toEqual(types)
  })

  test("toml extension", () => {
    expect(
      confima()
        .file("tests/fixtures/types.toml")
        .load()
    ).toEqual(types)
  })

  test("json extension", () => {
    expect(
      confima()
        .file("tests/fixtures/types.json")
        .load()
    ).toEqual(types)
  })

  test("jsonc extension", () => {
    expect(
      confima()
        .file("tests/fixtures/types.jsonc")
        .load()
    ).toEqual(types)
  })

  test("environment variables", () => {
    process.env["SOME_APP_VAR_number"] = "123"
    process.env["SOME_APP_VAR_string"] = "str"
    process.env["SOME_APP_VAR_boolean"] = "true"
    process.env["SOME_APP_VAR_array"] = "{1, 2, 3}"
    process.env["SOME_APP_VAR_object__member"] = "hello"
    process.env["SOME_APP_VAR_some__deep__object__member"] = "hello"
    process.env["SOME_APP_VAR_some__deep__object__array"] = "{hello, world}"
    expect(
      confima()
        .environment("SOME_APP_VAR_")
        .load()
    ).toEqual(types)
  })

  test("command arguments", () => {
    process.argv = [
      "", "",
      "--config.number",
      "123",
      "--config.string",
      "str",
      "--config.boolean",
      "true",
      "--config.array",
      "{1, 2, 3}",
      "--config.object.member",
      "hello",
      "--config.some.deep.object.member",
      "hello",
      "--config.some.deep.object.array",
      "{hello, world}"
    ]
    expect(
      confima()
        .argument()
        .load()
    ).toEqual(types)
  })
})
