import confima from "~/index"

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
        .file("tests/fixtures/merges-first.yaml")
        .file("tests/fixtures/merges-second.yaml")
        .load()
    ).toEqual(merges)
  })
})
