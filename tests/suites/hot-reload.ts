import confima from "../../src/index"
import * as fs from "fs"
import * as path from "path"

describe("config hot reload", () => {
  beforeEach(() => {
    fs.copyFileSync(
      path.resolve("tests/fixtures/hot.yaml"),
      path.resolve("tests/__temp/hot.yaml")
    )
  })
  // afterEach(() => fs.unlinkSync("tests/__temp/hot.yaml"))

  test("config should change on file change", async () => {
    // const config = confima().fromFile("tests/__temp/hot.yaml", { watch: true })
    // fs.writeFileSync(
    //   path.resolve("tests/__temp/hot.yaml"),
    //   'num: 456\nstr: "fgh"'
    // )
    // await (() =>
    //   new Promise(resolve => {
    //     setTimeout(resolve, 4000)
    //   }))()
    // expect(config.get()).toEqual({ num: 456, str: "fgh" })
  })
})
