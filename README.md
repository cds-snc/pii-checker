# Personal identifiable information checking

### Purpose

The purpose of this tool is to check if an application is anonymizing IPs when submitting information to Google Analytics.

### How do I use it?

All you need to do is install the GitHub application found here: _Coming soon!_

You also need to be using a `deployment` implementation on GitHub. (ex. [Heroku's Review apps](https://devcenter.heroku.com/articles/github-integration-review-apps)).

### Work flow

The tool is designed as GitHub application that subscribes to `deployment` events (https://developer.github.com/v3/repos/deployments/) on pull request branches. The specific use case at CDS targets [Heroku's Review apps](https://devcenter.heroku.com/articles/github-integration-review-apps), which are created on every push to a branch. 

Once the application receives the event, it extracts the URL for the application, loads the URL using [Puppeteer](https://github.com/GoogleChrome/puppeteer), and executes a check on the loaded JavaScript to see if Google Analytics is installed and how it is configured. If the the tool finds that Google Analytics is not anonymizing the IP then it creates an issue in the GitHub repository that initiated the check.

### Implementation

The tool is implemented as a Google Cloud function. Any merges to master are automatically deployed after testing passes using Google's Cloud build service (check `cloudbuild.yaml` for more information). Google's Firestore is used a database to ensure that issues are only created on per branch. As mentioned above, [Puppeteer](https://github.com/GoogleChrome/puppeteer) is used to execute the check.

### Questions?

Please contact us through any of the multiple ways listed on our [website](https://digital.canada.ca/).
