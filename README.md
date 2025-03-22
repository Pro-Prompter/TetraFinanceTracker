# Tetra Finance Tracker

This project is a finance management system designed for Tetra Studio to handle client payments, savings, and more. It is built using modern web technologies, including React, Vite, Bootstrap, and Appwrite.

## Features

- **Client Payments:** Track payments made by clients, pending payments, and total amounts.
- **Money Sources:** Track the sources of incoming money.
- **Dashboard:** Overview of all financial data.
- **CRUD Operations:** Create, Read, Update, Delete for clients, payments, commissions, etc.

## Tech Stack

- **Frontend:** React, Bootstrap, Vite
- **State Management:** Redux Toolkit
- **Charts:** Chart.js, react-chartjs-2
- **Form Handling:** react-currency-input-field
- **Animations:** framer-motion
- **API Calls:** Axios
- **Alerts:** SweetAlert2
- **Backend:** Appwrite
- **Deployment** Vercel

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/Tetra-Finance-Tracker.git
   cd Tetra-Finance-Tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Appwrite:**

   - Set up Appwrite by following the [getting started guide](https://appwrite.io/docs/getting-started-for-web).
   - Update the Appwrite endpoint and project ID in `src/lib/appwrite.js`.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Build the project for production:**

   ```bash
   npm run build
   ```

6. **Preview the production build:**

   ```bash
   npm run preview
   ```

## Folder Structure

``` bash
src/
├── components/
│   ├── Dashboard.jsx
│   ├── Navbar.jsx
│   ├── Transactions.jsx
├── lib/
│   ├── appwrite.js
│   ├── Auth.jsx
├── redux/
│   ├── authSlice.js
│   ├── store.js
│   ├── transactionSlice.js
├── App.css
├── App.jsx
├── main.jsx
├── index.css
```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Runs ESLint to check for linting errors.

## Dependencies

- `@reduxjs/toolkit`: ^2.2.7
- `appwrite`: ^14.0.1
- `axios`: ^1.7.3
- `bootstrap`: ^5.3.3
- `chart.js`: ^4.4.3
- `date-fns`: ^3.6.0
- `framer-motion`: ^11.3.21
- `mdb-react-ui-kit`: ^8.0.0
- `react`: ^18.3.1
- `react-bootstrap`: ^2.10.4
- `react-chartjs-2`: ^5.2.0
- `react-currency-input-field`: ^3.8.0
- `react-dom`: ^18.3.1
- `react-icons`: ^5.2.1
- `react-spinners`: ^0.14.1
- `react-redux`: ^9.1.2
- `react-router-dom`: ^6.26.0
- `redux`: ^5.0.1
- `sweetalert2`: ^11.12.4

## Dev Dependencies

- `@types/react`: ^18.3.3
- `@types/react-dom`: ^18.3.0
- `@vitejs/plugin-react`: ^4.3.1
- `eslint`: ^8.57.0
- `eslint-plugin-react`: ^7.34.3
- `eslint-plugin-react-hooks`: ^4.6.2
- `eslint-plugin-react-refresh`: ^0.4.7
- `vite`: ^5.3.4

## Contributions

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Contact

For any inquiries or feedback, feel free to contact us at [info@tetrastudio.net](mailto:info@tetrastudio.net) or [mirzasajawal827@gmail.com](mailto:mirzasajawal827@gmail.com).
