# InterviewGenius

InterviewGenius is a modern web application designed to help job seekers prepare for technical interviews. Built with Angular 20+ and a focus on user experience, it provides tools for managing resumes, profiles, and interview preparation.

## Features

- **User Authentication**: Secure JWT-based authentication with OAuth2 support (Google, GitHub)
- **Profile Management**: Manage personal information, experience levels, skills, and passwords
- **Resume Builder**: Create and manage your professional resume with work experience, education, and skills
- **Resume Upload**: Upload PDF resumes with automatic parsing to extract work experience and education
- **Voice Interview System**:
  - Interactive voice-based interview sessions with real-time audio recording
  - AI-generated interview questions with optional audio playback
  - Multi-step interview setup wizard with browser, camera, and microphone checks
  - Session management with detailed history and feedback
  - Real-time question-answer flow with automatic session completion
- **Interview History**: View past interview sessions with questions, answers, scores, and detailed feedback
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Modern UI built with PrimeNG and TailwindCSS

## Tech Stack

- **Frontend Framework**: Angular 20.3.x with standalone components
- **UI Components**: PrimeNG 20.x with custom Aura theme
- **Styling**: TailwindCSS 4.x with PostCSS
- **State Management**: Angular Signals
- **Authentication**: Custom JWT with OAuth2 integration
- **Icons**: FontAwesome and PrimeIcons
- **Markdown Rendering**: ngx-markdown with highlight.js
- **Testing**: Jasmine with Karma

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 20.3.2 or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interview-genius
```

2. Install dependencies:
```bash
npm install
```

3. Configure the backend API URL:
   - The application expects a backend API running at `http://localhost:8080`
   - Update the API URLs in service files if your backend runs on a different port

## Development

### Development Server

To start a local development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Code Scaffolding

Generate new components using Angular CLI:

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

For all available schematics:

```bash
ng generate --help
```

### Building

Build the project for production:

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

For development build with source maps:

```bash
ng build --configuration development
```

### Running Tests

Execute unit tests with Karma:

```bash
ng test
```

## Project Structure

```
src/app/
├── core/                          # Core singleton services and utilities
│   ├── guards/
│   │   └── auth-guard.ts         # Route guard for protected routes
│   ├── interceptors/
│   │   └── auth-interceptor.ts   # HTTP interceptor for auth headers
│   └── services/
│       ├── auth.ts               # JWT authentication service with signals
│       ├── user.ts               # User management service
│       ├── resume.ts             # Resume management service
│       ├── interview.ts          # Interview session management service
│       └── error-handler.ts      # Global error handler
├── features/                      # Feature modules
│   ├── auth/
│   │   ├── signin/               # Sign in page
│   │   ├── signup/               # Sign up page
│   │   └── oauth-callback/       # OAuth2 callback handler
│   ├── dashboard/                # Main dashboard with interview session starter
│   ├── profile/                  # User profile management
│   │   └── profile-resolver.ts  # Resolver for profile data
│   ├── resume/                   # Resume builder and management
│   ├── interview-setup/          # Multi-step interview setup wizard
│   ├── interview/                # Voice interview session with recording
│   └── session-details/          # Interview session details and feedback
├── shared/                        # Shared components and models
│   ├── components/
│   │   ├── navbar/               # Navigation bar with auth state
│   │   └── footer/               # Footer component
│   └── models/
│       ├── auth.model.ts         # Auth-related interfaces
│       ├── user.model.ts         # User-related interfaces
│       ├── resume.model.ts       # Resume-related interfaces
│       └── interview.model.ts    # Interview session and question interfaces
├── app.ts                         # Root component
├── app.config.ts                  # Application configuration with providers
└── app.routes.ts                  # Route definitions with lazy loading
```

## Configuration

### PrimeNG Theme
The application uses a custom Aura theme with cyan as the primary color. Theme configuration is in `src/app/app.config.ts`.

### TailwindCSS
TailwindCSS is configured with PostCSS and the `tailwindcss-primeui` plugin for seamless PrimeNG integration.

### Dark Mode
Dark mode is controlled by the `.ig-dark` class on the document root. Toggle it from the navbar.

## Development Guidelines

- Use Angular Signals for reactive state management
- All components are standalone (no NgModules)
- Use template-driven forms
- Rely on PrimeNG theme colors instead of TailwindCSS color classes
- Use PrimeNG components for consistent UI
- Protected routes use the `authGuard`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [PrimeNG Documentation](https://primeng.org)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Angular CLI Documentation](https://angular.dev/tools/cli)
