const core = require("@actions/core");
const packageJSON = require(`${process.env.GITHUB_WORKSPACE}/package.json`);

function dependencyHasUpdated() {
  return packageJSON.dependencies.jquery !== "^1.12.4";
}
module.exports = () => {
  try {
    const context = core.getInput("context");
    const pull_request = context.event.pull_request;

    if (
      pull_request.user.login === "dependabot[bot]" &&
      pull_request.merged &&
      dependencyHasUpdated()
    ) {
      return {
        reports: [
          {
            filename: "",
            isCorrect: true,
            display_type: "actions",
            level: "info",
            msg: "Great job!  You have sucessfully configured the Dependabot for this repository",
            error: {
              expected: "",
              got: "",
            },
          },
        ],
      };
    } else if (
      pull_request.user.login !== "dependabot[bot]" &&
      pull_request.merged &&
      dependencyHasUpdated()
    ) {
      return {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "actions",
            level: "warning",
            msg: "Incorrect solution",
            error: {
              expected:
                "A pull request opened by Dependabot to be successfully merged and JQuery was updated",
              got: "A pull request was merged, but it was not opened by Dependabot",
            },
          },
        ],
      };
    } else if (
      pull_request.user.login === "dependabot[bot]" &&
      pull_request.merged &&
      !dependencyHasUpdated()
    ) {
      return {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "actions",
            level: "warning",
            msg: "Incorrect solution",
            error: {
              expected:
                "A pull request opened by Dependabot to be successfully merged and JQuery was updated",
              got: "A pull request was merged, but but JQuery is not a newer version",
            },
          },
        ],
      };
    } else {
      return "Not Applicable";
    }
  } catch (error) {
    return {
      reports: [
        {
          filename: ".gitignore",
          isCorrect: false,
          display_type: "actions",
          level: "fatal",
          msg: "Error",
          error: {
            expected: "",
            got: "An internal error occured.  Please open an issue at: https://github.com/githubtraining/exercise-use-gitignore and let us know!  Thank you",
          },
        },
      ],
    };
  }
};
