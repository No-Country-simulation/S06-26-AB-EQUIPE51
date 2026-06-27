const fs = require('fs');
const path = require('path');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

const coverageDir = path.resolve(
  __dirname,
  '..',
  process.argv[2] || 'coverage',
);
const coverageFile = path.join(coverageDir, 'coverage-final.json');
const filteredFile = path.join(coverageDir, 'coverage-final.filtered.json');

function isTypeScriptMetadataBranch(branch) {
  return (
    branch.type === 'cond-expr' &&
    branch.loc &&
    branch.loc.end &&
    branch.loc.end.column === null
  );
}

function filterBranches(fileCoverage) {
  const branchMap = {};
  const branches = {};
  let nextId = 0;

  for (const id of Object.keys(fileCoverage.branchMap).sort(
    (a, b) => Number(a) - Number(b),
  )) {
    const branch = fileCoverage.branchMap[id];

    if (isTypeScriptMetadataBranch(branch)) {
      continue;
    }

    branchMap[nextId] = branch;
    branches[nextId] = fileCoverage.b[id];
    nextId += 1;
  }

  return {
    ...fileCoverage,
    branchMap,
    b: branches,
  };
}

function assertMinimums(coverageMap) {
  const failures = [];

  for (const file of coverageMap.files()) {
    const summary = coverageMap.fileCoverageFor(file).toSummary().data;
    const relativeFile = path.relative(process.cwd(), file);

    if (summary.statements.pct < 100) {
      failures.push(`${relativeFile}: statements ${summary.statements.pct}%`);
    }

    if (summary.branches.pct < 85) {
      failures.push(`${relativeFile}: branches ${summary.branches.pct}%`);
    }

    if (summary.functions.pct < 100) {
      failures.push(`${relativeFile}: functions ${summary.functions.pct}%`);
    }

    if (summary.lines.pct < 100) {
      failures.push(`${relativeFile}: lines ${summary.lines.pct}%`);
    }
  }

  if (failures.length > 0) {
    console.error('\nCoverage minima failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
  }
}

if (!fs.existsSync(coverageFile)) {
  console.error(`Coverage file not found: ${coverageFile}`);
  process.exit(1);
}

const rawCoverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const filteredCoverage = Object.fromEntries(
  Object.entries(rawCoverage).map(([file, fileCoverage]) => [
    file,
    filterBranches(fileCoverage),
  ]),
);

fs.writeFileSync(filteredFile, JSON.stringify(filteredCoverage, null, 2));

const coverageMap = libCoverage.createCoverageMap(filteredCoverage);
const context = libReport.createContext({
  dir: coverageDir,
  coverageMap,
});

reports.create('text').execute(context);
reports.create('text-summary').execute(context);
reports.create('html').execute(context);
reports.create('lcov').execute(context);
reports.create('clover').execute(context);

assertMinimums(coverageMap);
