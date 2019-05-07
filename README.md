# Personal identifiable information checking

[![Phase](https://img.shields.io/badge/Phase-Beta-22a7f0.svg)](https://digital.canada.ca/products/)  [![Maintainability](https://api.codeclimate.com/v1/badges/ccf646122e1d06265d4e/maintainability)](https://codeclimate.com/github/cds-snc/pii-checker/maintainability)

(la version française suit)

### Purpose

The purpose of this tool is to check if an application is anonymizing IPs when submitting information to Google Analytics.

### How do I use it?

All you need to do is install the [GitHub application](https://github.com/apps/cds-snc-pii-checker).
You also need to be using a `deployment` implementation on GitHub. (ex. [Heroku's Review apps](https://devcenter.heroku.com/articles/github-integration-review-apps)).

### Work flow

The tool is designed as GitHub application that subscribes to `deployment` events (https://developer.github.com/v3/repos/deployments/) on pull request branches. The specific use case at CDS targets [Heroku's Review apps](https://devcenter.heroku.com/articles/github-integration-review-apps), which are created on every push to a branch. 

Once the application receives the event, it extracts the URL for the application, loads the URL using [Puppeteer](https://github.com/GoogleChrome/puppeteer), and executes a check on the loaded JavaScript to see if Google Analytics is installed and how it is configured. If the tool finds that Google Analytics is not anonymizing the IP then it creates an issue in the GitHub repository that initiated the check.

### Implementation

The tool is implemented as a Google Cloud function. Any merges to master are automatically deployed after testing passes using Google's Cloud build service (check `cloudbuild.yaml` for more information). Google's Firestore is used as a database to ensure that issues are only created on per branch. As mentioned above, [Puppeteer](https://github.com/GoogleChrome/puppeteer) is used to execute the check.

### Questions?

Please contact us through any of the multiple ways listed on our [website](https://digital.canada.ca/).


# Vérificateur de renseignements d’identification personnelle

### Objet

Le but de cet outil est de vérifier si une application anonymise les adresses IP lorsque des renseignements sont soumis à Google Analytics.

### Comment l’utiliser?

Vous n’avez qu’à installer l’application GitHub. Vous devez également utiliser une mise en œuvre deployment sur GitHub (p. ex. applications d’examen de Heroku).

### Déroulement du travail

L’outil est conçu comme une application GitHub qui s’inscrit dans les événements deployment (https://developer.github.com/v3/repos/deployments/) dans les branches de demande de tirage (pull request). Le cas d’utilisation spécifique au SNC cible les applications d’examen de Heroku, qui sont créées à chaque poussée (push) dans une branche.

Une fois que l’application reçoit l’événement, elle extrait l’adresse URL de l’application, charge l’adresse URL à l’aide du Puppeteer et effectue une vérification du JavaScript téléchargé pour voir si Google Analytics est installé et comment il est configuré. Si l’outil constate que Google Analytics n’anonymise pas les adresses IP, il crée un problème dans le dépôt (repository) GitHub qui a déclenché la vérification.

### Mise en œuvre

L’outil est mis en œuvre comme une fonction Google Cloud. À la réussite des tests, toutes les fusions sont automatiquement déployées à l’aide du service Cloud Build de Google (voir cloudbuild.yaml pour plus d’information). Google Firestore est utilisé comme base de données pour s’assurer que les problèmes ne sont créés que par branche. Comme il a été mentionné ci-dessus, Puppeteer est utilisé pour effectuer la vérification.

### Avez-vous des questions?

Veuillez communiquer avec nous par l’un des multiples moyens indiqués sur notre site Web.



