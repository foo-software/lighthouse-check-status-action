const core = require('@actions/core');
const { validateStatus } = require('@foo-software/lighthouse-check');

const formatInput = input => {
  if (input === '') {
    return undefined;
  }

  return input;
};

(async () => {
  try {
    const minAccessibilityScore = formatInput(
      core.getInput('minAccessibilityScore')
    );
    const minBestPracticesScore = formatInput(
      core.getInput('minBestPracticesScore')
    );
    const minPerformanceScore = formatInput(
      core.getInput('minPerformanceScore')
    );
    const minProgressiveWebAppScore = formatInput(
      core.getInput('minProgressiveWebAppScore')
    );
    const minSeoScore = formatInput(core.getInput('minSeoScore'));
    const outputDirectory = formatInput(core.getInput('outputDirectory'));
    
    let results = core.getInput('lighthouseCheckResults');
    if (results) {
      results = JSON.parse(results).data;
    }

    // if we need to fail when scores are too low...
    if (
      minAccessibilityScore ||
      minBestPracticesScore ||
      minPerformanceScore ||
      minProgressiveWebAppScore ||
      minSeoScore
    ) {
      await validateStatus({
        minAccessibilityScore,
        minBestPracticesScore,
        minPerformanceScore,
        minProgressiveWebAppScore,
        minSeoScore,
        outputDirectory,
        results,
        verbose: true
      });
    } else if (results.runtimeError) {
      throw new Error(results.runtimeError);
    } else {
      throw new Error('All scores were missing from Lighthouse result.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
