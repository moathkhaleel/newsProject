This project implemented the following:
1) node and express server 
2) webpack plugin to compile assets 
3) several javascript functionalities upon form submission. They can be found in /sr/client/js/
4) fetch an api call from 3 different apis
5) check validity of user input using regex 
6) implement dependencies accordingly 
7) add service workers to perform offline functionalities
8) use environment variables to keep api key hidden from client side

Webpack can be run using both production and development environments. The follwing commands can be used to run either of the two environments
1) development: npm run build-dev
2) production: npm run build-prod

The project fetches weather data from a weather api. If the desire trip date is within a week, today's forecast is posted. If the date is within a week and 16 days, a predicted forecast is posted. If the date is more than 16 days away, the forecast after 16 days is posted. This is a limitation from the api itself. 

.................
The following extra features were added: 
1) pixaby api pulls an image of the country if no results are found for the city, to avoid an empty image 
2) the rest countries api is implemented to get the proper country code for the back up image api call
......................