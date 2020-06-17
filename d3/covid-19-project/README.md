# COVID-19 Dashboard

[D3js](https://d3js.org/) exploratory project that showcases a simple dashboard with some of COVID-19 data made available at [COVID-19 Data Repository](https://github.com/CSSEGISandData/COVID-19) by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.

This project was developed while taking the course [The Advanced Web Developer Bootcamp in Udemy](https://www.udemy.com/course/the-advanced-web-developer-bootcamp/).

Check the current state of the project [here](https://ecarrara-covid-19-dashboard.herokuapp.com/).

## Deploying

The project is structured as a simple NodeJS app and can be deployed to Heroku (or any other platform that supports NodeJS).

### Heroku

As this project is contained in a repository with several others, the simplest way to deploy it to Heroku is by creating a split with subtree and pushing it to the heroku master branch of your project. 

From the top level of this repository working tree run:

`git push -f heroku "$(git subtree split --prefix=d3/covid-19-project/src)":master`

**More info:**

* [Heroku Docs - Deploying your code with Git](https://devcenter.heroku.com/articles/git#deploying-code)
* [Deploying A Heroku App From A Subdirectory by Brett DeWoody](https://brettdewoody.com/deploying-a-heroku-app-from-a-subdirectory/)