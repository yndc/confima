import confima from "../../src/index"

describe("config merges", () => {
  const merges = {
    one: {
      two: {
        three: {
          a: 1,
          b: "two",
          c: {
            first: true,
            second: true
          },
          array: [1, 2, 3, 4],
          d: 4
        }
      }
    }
  }

  test("deep merge", () => {
    expect(
      confima()
        .fromFile("tests/fixtures/merges-first.yaml")
        .fromFile("tests/fixtures/merges-second.yaml")
        .build()
        .value()
    ).toEqual(merges)
  })
})
