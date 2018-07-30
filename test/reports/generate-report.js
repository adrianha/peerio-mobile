const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'hierarchy',
    jsonDir: 'test/reports',
    output: 'test/reports/result.html',
    reportSuiteAsScenarios: true,
    launchReport: true
};

reporter.generate(options);

