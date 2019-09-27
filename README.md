# Lighthouse Check Results Action

This action is used with [Lighthouse Check action](https://github.com/foo-software/lighthouse-check-action) to determine status of running workflow. **Its main purpose is to fail the workflow if Lighthouse scores don't meet minimum requirements** as defined by inputs.

## Inputs

Each value of the inputs below can be used alone or together. If a score of any Lighthouse audit ran by [Lighthouse Check action](https://github.com/foo-software/lighthouse-check-action) is lower than the value - the workflow will fail with an error message detailing which failed and scores.

<table>
  <tr>
    <th>Name</th>
  </tr>
  <tr>
    <td><code>minAccessibilityScore</code></td>
  </tr>
  <tr>
    <td><code>minBestPracticesScore</code></td>
  </tr>
  <tr>
    <td><code>minPerformanceScore</code></td>
  </tr>
  <tr>
    <td><code>minProgressiveWebAppScore</code></td>
  </tr>
  <tr>
    <td><code>minSeoScore</code></td>
  </tr>
</table>

## Example usage

In the below example we use [Lighthouse Check action](https://github.com/foo-software/lighthouse-check-action) to run audits and provide results as an output utilized in the step after with this action.

```yaml
name: Test Lighthouse Check Status
on: [push]

jobs:
  lighthouse-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Run Lighthouse
        id: lighthouseCheck
        uses: foo-software/lighthouse-check-action@master
        with:
          urls: 'https://www.foo.software,https://www.foo.software/contact'
      - name: Handle Lighthouse Check results
        uses: foo-software/lighthouse-check-status-action@master
        with:
          lighthouse-check-results: ${{ steps.lighthouseCheck.outputs.lighthouseCheckResults }}
          minAccessibilityScore: 90
          minBestPracticesScore: 50
          minPerformanceScore: 50
          minProgressiveWebAppScore: 50
          minSeoScore: 50
```
