# Organization Prompts Manager

A simple Angular 17+ web application to manage organizations and their associated prompts stored in MongoDB.

## Features

- **Table View**: Display all organizations in a clean table layout with columns for organization name and prompt
- **Card Modal**: Click "Edit" on any organization to open a detail card modal where you can update the name and prompt
- **Add Organizations**: Use the "+ Add Organization" button to create new organizations with prompts
- **Remove Organizations**: Delete organizations with a confirmation dialog
- **Live Updates**: All changes are reflected immediately in the table view

## Technology Stack

- **Frontend**: Angular 17+
- **UI Framework**: Angular Material 17
- **State Management**: RxJS Observables
- **Database**: MongoDB (connection string provided)
- **Styling**: Material Design CSS

## Project Structure

```
org-prompts-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── org-detail-modal.component.ts    # Edit/Add modal component
│   │   ├── services/
│   │   │   └── organization.service.ts          # CRUD operations service
│   │   ├── app.component.ts                      # Main table component
│   │   ├── app.config.ts                         # App configuration
│   │   └── app.routes.ts                         # Routes configuration
│   ├── styles.css                                # Global styles + Material theme
│   └── main.ts                                   # Entry point
├── angular.json                                  # Angular CLI configuration
├── package.json                                  # Dependencies
└── README.md                                     # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+

### Installation

1. Navigate to the project directory:
```bash
cd org-prompts-app
```

2. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm start
```

The app will open automatically at `http://localhost:4200/`

## MongoDB Integration

The app uses the following MongoDB connection:
```
mongodb+srv://noizzhack15_db_user@breakingbadcluster.ndyckke.mongodb.net/?appName=BreakingBadCluster
```

**Note**: Currently, the app uses mock data. To connect to MongoDB:
1. Create a backend API (Node.js + Express recommended)
2. Update the `organization.service.ts` file to call your backend endpoints instead of using mock data
3. Implement the following API endpoints:
   - `GET /api/organizations` - Fetch all organizations
   - `POST /api/organizations` - Create new organization
   - `PUT /api/organizations/:id` - Update organization
   - `DELETE /api/organizations/:id` - Delete organization

## Next Steps

1. **Connect Backend**: Create a Node.js Express API to handle MongoDB operations
2. **Add Authentication**: Implement user authentication if needed
3. **Enhance UI**: Add sorting, filtering, pagination for organizations
4. **Deploy**: Deploy to production (Vercel, Netlify, Heroku, or cloud provider)

## Scripts

- `npm start` - Start dev server (ng serve)
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linter

## License

MIT

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
