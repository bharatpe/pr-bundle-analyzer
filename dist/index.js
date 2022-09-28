/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 499:
/***/ ((__unused_webpack_module, __webpack_exports__, __nccwpck_require__) => {

"use strict";
__nccwpck_require__.r(__webpack_exports__);
/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "writeJson": () => (/* binding */ writeJson)
/* harmony export */ });
const writeJson = (obj, field, value) => {
    const root = obj;
    const parts = field.split(".");
    parts.forEach((part, index) => {
        let isLastItem = index === parts.length - 1;

        if (isLastItem) {
            obj[part] = value;
        } else {
            // Resolve array indices [0]
            const matches = part.match(/([\w_+-]+)\[(-?\d)\]/);
            if(matches != null) {
                obj = obj[ matches[1]][matches[2]];
            } else {
                obj[part] = obj[part] || {}
                obj = obj[part];
            }
        }
    });

    return root;
}

/***/ }),

/***/ 105:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 946:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 82:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 318:
/***/ ((module) => {

module.exports = eval("require")("@octokit/rest");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(105);
const github = __nccwpck_require__(82);
const { Octokit } = __nccwpck_require__(318);
const exec = __nccwpck_require__(946);
const { write, writeJson } = __nccwpck_require__(499);

async function run() {
  function bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  }

  try {
    const inputs = {
      token: core.getInput("token"),
      install_command: core.getInput("install_command"),
      build_command: core.getInput("build_command"),
      build_path: core.getInput("build_path"),
      base_branch: core.getInput("base_branch"),
      head_branch: core.getInput("head_branch"),
      file: core.getInput('file', { required: true }),
      field: core.getInput('field', { required: true }),
      value: core.getInput('value', { required: true }),
      parseJson: !!core.getInput('parse_json', { required: false }),
  };

    if (inputs.parseJson) {
      value = JSON.parse(value)
    }

    const {
      payload: { pull_request: pullRequest, repository },
    } = github.context;

    if (!pullRequest) {
      core.error("This action only works on pull_request events");
      return;
    }

    const { number: issueNumber } = pullRequest;
    const { full_name: repoFullName } = repository;
    const [owner, repo] = repoFullName.split("/");

    const octokit = new Octokit({
      auth: inputs.token,
    });

    let data = fs.readFileSync(file, 'utf8');
    let obj = JSON.parse(data);
    obj = writeJson(obj, field, value);
    
    data = JSON.stringify(obj, null, 2);
    fs.writeFileSync(file, data, 'utf8');

    await exec.exec(`git fetch`);
    
    const branches = [inputs.head_branch, inputs.base_branch];
    const branchesStats = [];
    const branchesHeading = [];

    for (let item of branches) {
      await exec.exec(`git checkout ${item}`);
      await exec.exec(inputs.install_command);
      await exec.exec(inputs.build_command);

      core.setOutput(
        "Building repo completed - 1st @ ",
        new Date().toTimeString()
      );

      const outputOptions = {};
      let sizeCalOutput = "";

      outputOptions.listeners = {
        stdout: (data) => {
          sizeCalOutput += data.toString();
        },
        stderr: (data) => {
          sizeCalOutput += data.toString();
        },
      };

      await exec.exec(`du ${inputs.build_path}`, null, outputOptions);
      core.setOutput("size", sizeCalOutput);

      const arrayOutput = sizeCalOutput.split("\n");

      const arrOp = arrayOutput.map((item) => {
        const i = item.split(/(\s+)/);
        branchesHeading.push(`${i[2]}`);
        return parseInt(i[0]) * 1000;
      });
      branchesStats.push(arrOp);
    }

    const coverage = `|Files Type|New Stats (${
      inputs.head_branch
    })|Old Stats (${inputs.base_branch})|Differences (New - Old)|
|-----|:-----:|:-----:|:-----:|
|${branchesHeading[0]}|${bytesToSize(branchesStats[0][0])}|${bytesToSize(
      branchesStats[1][0]
    )}|${bytesToSize(branchesStats[0][0] - branchesStats[1][0])}|
|${branchesHeading[1]}|${bytesToSize(branchesStats[0][1])}|${bytesToSize(
      branchesStats[1][1]
    )}|${bytesToSize(branchesStats[0][1] - branchesStats[1][1])}|
|${branchesHeading[2]}|${bytesToSize(branchesStats[0][2])}|${bytesToSize(
      branchesStats[1][2]
    )}|${bytesToSize(branchesStats[0][2] - branchesStats[1][2])}|
|${branchesHeading[3]}|${bytesToSize(branchesStats[0][3])}|${bytesToSize(
      branchesStats[1][3]
    )}|${bytesToSize(branchesStats[0][3] - branchesStats[1][3])}|
`;

    octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: coverage,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;