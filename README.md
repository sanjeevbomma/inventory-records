# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


## Problem Description:
Create a web page that takes the attached csv file as an input and parses it to render the required data in a tabular format and also generate charts for specific metrics.
The attached csv file contains inventory records, which need to be grouped by product name. Each product will have multiple batches and each batch may have different values for the following columns : stock, deal, free, mrp, rate and expiry. 
### Part - 1
Display the inventory records in a table with the following columns : name, batch, stock, deal, free, mrp, rate, expiry date and company. The table has to be paginated and searchable on name. 
If there are multiple batches for a product, the batch cell needs to have a dropdown to select and view the corresponding batch details in the stock, deal, free, mrp, rate, expiry date columns. By default, the aggregated details need to be displayed. 

### The aggregation logic is as follows :
1.	Stock - summation across batches
2.	Deal and Free - minimum free/deal ratio across batches
3.	MRP - maximum across batches
4.	Rate - maximum across batches
5.	Expiry Date - nearest date across batches

### Sample Input :

name	batch	stock	deal	free	mrp	rate	exp
1-AL 5MG TABS ***	079K025	150	0	0	26.2	18.71	01/10/2021
1-AL 5MG TABS ***	079L030	25	0	0	26.2	18.71	01/11/2021
1-AL 5MG TABS ***	079K024	-25	0	0	26.2	18.72	01/10/2021
1-AL 5MG TABS ***	079K025	5	0	0	26.2	18.72	01/10/2021

### Aggregated Output :
name	batch	stock	deal	free	mrp	rate	exp
1-AL 5MG TABS ***	All	155	0	0	26.2	18.72	01/10/2021

### Batch Wise Output :
name	batch	stock	deal	free	mrp	rate	exp
1-AL 5MG TABS ***	079K025	150	0	0	26.2	18.71	01/10/2021

## Part - 2
### Create charts for the following metrics using the same inventory data :
1.	Individual company wise comparison of expired to not expired products
a.	Input : Single select - company name 
b.	Output : Single pie Chart
2.	Company wise comparison of products expiring by a certain date
a.	Input : Single select - company name, Date selection
b.	Output : Bar graph with product names on x-axis and aggregated count on y-axis
Points To Notes
1.	This  is a pure frontend assignment, the csv should be read from the file system, no network calls are required.
2.	We are just looking for a very simple one webpage solution which satisfies the above problem statement.
3.	You can use any programming language, framework and libraries to solve the problem.
4.	Extra points will be given to cleaner code structure, variable namings etc good practices.
