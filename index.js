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
    const results = JSON.parse(core.getInput('lighthouseCheckResults'));

    // if we need to fail when scores are too low...
    if (
      minAccessibilityScore ||
      minBestPracticesScore ||
      minPerformanceScore ||
      minProgressiveWebAppScore ||
      minSeoScore
    ) {
      validateStatus({
        minAccessibilityScore,
        minBestPracticesScore,
        minPerformanceScore,
        minProgressiveWebAppScore,
        minSeoScore,
        results: results.data,
        verbose: true
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
