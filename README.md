# Joke Generator Summary
This project searches through the public API, https://sv443.net/jokeapi/v2/, and local database. It then returns 10 random, safe-for-work jokes. The results compile nine jokes from the API and one from the local database.

## Description
The idea of this project is to allow users to search the public API for jokes that can be shared in public spaces. Users will have the option to apply filters that include category and search for specific keywords in the description.

Once the page loads, you will see a search bar with a series of filter. The search bar and filters are of course optional, but may help narrow down the results if you are looking for a specific type of joke. Once the filters are input, click the search button. This will return a list of 10 random jokes that meet your search criteria. 

## Adding a Joke
To add a joke, simply click the "So, you think you're funny, huh?" button and fill out the form. As of right now, the form only allows the input of a single type of joke with one line. Be sure to select the correct category or the results will eventually become impossible to sort. Once the form is filled out correctly, click the 'Add Joke' button at the bottom. The website will then generate the joke card that will be shown when users search for a joke.

To close the form section, click the 'Nevermind.' button and the area will dissapear to it's original size.

## Installation
Clone the repository: `git clone git@github.com:lbarsis/phase-1-project-joke-generator.git`

## Usage
Run `explorer.exe index.html` inside the terminal.

### Examples
![Example](./images/video1398217342.gif)

### Disclaimer
Due to API limitations of adding jokes, this website runs off two databases. The main search function organizes and searches from the joke API listed in the summary. Nine of the ten displayed jokes are displayed from this database.

When a user adds a joke via the form, it is added to a local database. Once the joke is added to the local database, it then becomes searchable along with the oringal API. However, only one joke is displayed at a time from the local database to account for the vast difference in size between the two. 

Due to multiple databases being used, you will sometimes see an error that states: 'Sorry, no jokes were found in the API. You may see one from the local database if the criteria matches.' This means that no jokes were found in the API database, however, it has not yet searched the local database. If a joke is found in the local database, it will be displayed as usual. If nothing is displayed after this warning, that means no joke matches the search criteria in the local database either.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.