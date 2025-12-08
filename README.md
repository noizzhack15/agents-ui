# Organization Prompts Web App

A modern Angular web application for managing organizations and their associated prompts using Angular 17+, Angular Material Design, and RxJS.

## Features

- 📋 **Organization Management** - Create, read, update, and delete organizations
- 💬 **Prompt Management** - Associate and manage prompts with organizations
- 🎨 **Material Design UI** - Clean, responsive interface using Angular Material
- ⚡ **Reactive Programming** - Real-time data updates using RxJS Observables
- 🔄 **CRUD Operations** - Full create, read, update, delete functionality

## Project Structure

```
org-prompts-app/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   └── org-detail-modal/  # Organization form modal
│   │   ├── services/            # Business logic & HTTP client
│   │   │   └── organization.service.ts
│   │   ├── app.component.*      # Main application component
│   │   ├── app.config.ts        # Angular configuration
│   │   └── app.routes.ts        # Routing configuration (future use)
│   ├── index.html               # HTML entry point
│   ├── main.ts                  # Angular bootstrap
│   ├── styles.css               # Global styles
│   └── favicon.ico
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

### Installation

```bash
cd org-prompts-app
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technology Stack

- **Frontend Framework**: Angular 17+
- **UI Library**: Angular Material 17
- **Styling**: CSS3 with Material Theme
- **State Management**: RxJS (Observables, BehaviorSubject)
- **HTTP Client**: Angular HttpClient
- **TypeScript**: 5.4+

## Components

### AppComponent
Main application component displaying the organization table with CRUD operations.

### OrgDetailModalComponent
Reusable modal dialog for adding and editing organizations.

## Services

### OrganizationService
Centralized service for managing organization data and HTTP operations.

## Future Enhancements

- Backend API integration with MongoDB
- User authentication and authorization
- Advanced filtering and search
- Bulk operations
- Data export functionality
- Real-time collaboration

## License

MIT