const core = require('@actions/core');

const normalizeInput = input => {
  if (input === 'true') {
    return true;
  }

  if (input === 'false') {
    return false;
  }

  if (input === '') {
    return undefined;
  }

  return input;
};

const getScoreFailMessage = ({
  name,
  url,
  minScore,
  score
}) => {
  // if inputs are not specified - assume we shouldn't fail
  if (!minScore || !score) {
    return [];
  }

  if (Number(score) < Number(minScore)) {
    return [`${url}: ${name}: minimum score: ${minScore}, actual score: ${score}`];
  }

  return [];
};

const getFailureMessages = ({
  minAccessibilityScore,
  minBestPracticesScore,
  minPerformanceScore,
  minProgressiveWebAppScore,
  minSeoScore,
  results
}) => {
  return results.data.reduce((accumulator, current) => ([
    ...accumulator,
    ...(getScoreFailMessage({
      name: 'Accessibility',
      minScore: minAccessibilityScore,
      score: current.scores.accessibility,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Best Practices',
      minScore: minBestPracticesScore,
      score: current.scores.bestPractices,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Performance',
      minScore: minPerformanceScore,
      score: current.scores.performance,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Progressive Web App',
      minScore: minProgressiveWebAppScore,
      score: current.scores.progressiveWebApp,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'SEO',
      minScore: minSeoScore,
      score: current.scores.seo,
      ...current
    }))
  ]), []);
}

try {
  const minAccessibilityScore = normalizeInput(core.getInput('minAccessibilityScore'));
  const minBestPracticesScore = normalizeInput(core.getInput('minBestPracticesScore'));
  const minPerformanceScore = normalizeInput(core.getInput('minPerformanceScore'));
  const minProgressiveWebAppScore = normalizeInput(core.getInput('minProgressiveWebAppScore'));
  const minSeoScore = normalizeInput(core.getInput('minSeoScore'));
  const results = core.getInput('lighthouseCheckResults');
  console.log('results', results);

  // if we need to fail when scores are too low...
  if (minAccessibilityScore || minBestPracticesScore
    || minPerformanceScore || minProgressiveWebAppScore || minSeoScore) {
    const failures = getFailureMessages({
      minAccessibilityScore,
      minBestPracticesScore,
      minPerformanceScore,
      minProgressiveWebAppScore,
      minSeoScore,
      results
    });

    // if we have scores that were below the minimum requirement
    if (failures.length) {
      // comma-separate error messages and remove the last comma
      const failureMessage = failures.join('\n');
      throw new Error(`Minimum score requirements failed:\n${failureMessage}`);
    }
  }
} catch (error) {
  core.setFailed(error.message);
}
