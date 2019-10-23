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

  test("plain object", () => {
    expect(
      confima()
        .fromObject(types)
        .get()
    ).toEqual(types)
  })

  test("js file", () => {
    expect(
      confima()
        .fromFile("tests/fixtures/types.js")
        .get()
    ).toEqual(types)
  })

  test("yaml file", () => {
    expect(
      confima()
        .fromFile("tests/fixtures/types.yaml")
        .get()
    ).toEqual(types)
  })

  test("toml file", () => {
    expect(
      confima()
        .fromFile("tests/fixtures/types.toml")
        .get()
    ).toEqual(types)
  })

  test("json file", () => {
    expect(
      confima()
        .fromFile("tests/fixtures/types.json")
        .get()
    ).toEqual(types)
  })

  test("jsonc file", () => {
    expect(
      confima()
        .fromFile("tests/fixtures/types.jsonc")
        .get()
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
        .fromEnvironment("SOME_APP_VAR_")
        .get()
    ).toEqual(types)
  })

  test("command arguments", () => {
    process.argv = [
      "",
      "",
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
        .fromArgument()
        .get()
    ).toEqual(types)
  })
})
