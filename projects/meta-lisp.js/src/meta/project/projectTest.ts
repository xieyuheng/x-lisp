import * as M from "../index.ts"

export function projectTest(project: M.Project): void {
  M.projectBuild(project)

  // for (const id of M.projectSourceIds(project)) {
  //   if (id.endsWith(".test.meta")) {
  //     const inputFile = M.projectGetBasicPath(project, id)
  //     M.log("test", id)
  //     systemShellRun(BasicInterpreterFile, ["run", inputFile])
  //   }
  // }
}
