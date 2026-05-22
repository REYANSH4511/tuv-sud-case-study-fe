Your task is to implement a table view that displays all orders stored in a database.

The table view has the following requirements:

- It has columns for Order Number, Customer, Total, Date, Status 
- Every order has a status badge which is either "pending", "fullfilled" or "cancelled". The badge component is provided in src/components/StatusBadge.tsx
- The status of the orders should be editable in the table view. After editing the status, a toast message should appear to confirm the status change. You can use the functions from src/toast/Toastprovider.tsx
- There should be a search bar where the name of a customer can be serched and all orders of that customer will be displayed. You can use the useDebouncedValue from src/lib/useDebouncedValue.ts to debounce you search.
- The talbe should only display 10 orders per page. There must be buttons to navigate between the pages. You can use the Paginator function from src/App.tsx for that if you like.
- Every order can be displayed in a seperate order view (new page or modal), e.g. by clicking on a button. This view should list the items of an order including SKU-id, name, quantity and price in dollars (e.g. $29.99).

As we have no real backend, the file db.json serves as database. The file api.ts provides functions that emulate API calls to the backend to operate on the database. Make sure to validate the API respones e.g. by using zod (https://www.npmjs.com/package/zod)
BONUS: Create and use custom hooks to fetch the API.

Document your code with comments and make sure to add a README.md with instruction on how to install and start the web app.

You can start the application by running:

```
npm i
npm run dev
```

The setup was tested on node version v18.19.1 and npm version 9.2.0. If you are facing problems on running the setup with these versions installed, please reach out to us.
