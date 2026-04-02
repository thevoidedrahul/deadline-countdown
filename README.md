# Deadline Countdown Timer

A performant Angular 21 application that displays a real-time countdown to a deadline fetched from a REST API.

## Features

- 🕒 Real-time countdown timer that updates every second
- ⏰ **Dual time formatting with custom pipe**: Clock format (`HH:MM:SS`) and countdown format (`1d 2h 3m 4s`)
- 🎨 Beautiful, responsive UI with gradient styling
- 🔄 Automatic API polling for deadline updates
- ⚡ Performance optimized with RxJS streams
- 🛡️ Error handling with retry functionality
- 📱 Mobile-responsive design
- 🔧 TypeScript with strict type checking
- 🧩 Reusable custom pipes for time formatting

## Architecture

### Components
- **DeadlineCountdownComponent**: Main component displaying the countdown timer with dual format display
- **DeadlineCountdownService**: Service handling API calls to fetch deadline data

### Custom Pipes
- **DeadlineCountdownPipe**: Custom pipe with two formatting modes:
  - **Clock format**: `HH:MM:SS` or `DD:HH:MM:SS` (includes days when > 0)
  - **Countdown format**: `1d 2h 3m 4s` (omits zero values, shows full text)

### API Integration
- Fetches deadline data from `/api/deadline` endpoint
- Expected response format: `{ secondsLeft: number }`
- Automatically handles network errors with user-friendly error messages

### Performance Features
- Uses RxJS streams for efficient data handling
- Implements `OnDestroy` for proper memory management
- Uses Angular Signals for reactive state management
- Custom pipes for optimized time formatting

## Getting Started

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd deadline-countdown
npm install
```

### Development

#### Option 1: Run with Mock Server (Recommended for testing)
```bash
npm run start:dev
```
This will start both the Angular development server (port 4200) and a mock API server (port 3001).

#### Option 2: Run Angular only (if you have your own API)
```bash
npm start
```

### API Configuration

The application expects a REST API endpoint at `/api/deadline` that returns:
```json
{
  "secondsLeft": 3600
}
```

## Usage in Other Projects

This countdown component is designed to be easily integrated into larger Angular applications:

1. **Copy the core files:**
   - `src/app/core/interface/deadline.interface.ts`
   - `src/app/core/service/deadline-countdown.service.ts`
   - `src/app/pages/deadline-countdown/` (entire directory)
   - `src/app/shared/pipes/deadline-countdown.pipe.ts` (custom pipe)

2. **Add HTTP Client to your app.config.ts:**
   ```typescript
   import { provideHttpClient } from '@angular/common/http';
   
   export const appConfig: ApplicationConfig = {
     providers: [
       // ... other providers
       provideHttpClient()
     ]
   };
   ```

3. **Use the component:**
   ```html
   <app-deadline-countdown></app-deadline-countdown>
   ```

4. **Use the pipe independently:**
   ```html
   <!-- Clock format: 02:30:45 or 1:02:30:45 -->
   {{ seconds | deadlineCountdown:'clock' }}
   
   <!-- Countdown format: 2 hours, 30 minutes, 45 seconds -->
   {{ seconds | deadlineCountdown:'countdown' }}
   ```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── interface/
│   │   │   └── deadline.interface.ts           # TypeScript interfaces
│   │   └── service/
│   │       └── deadline-countdown.service.ts   # API service
│   ├── pages/
│   │   └── deadline-countdown/
│   │       ├── deadline-countdown.component.ts    # Main component
│   │       ├── deadline-countdown.component.html  # Template with dual displays
│   │       ├── deadline-countdown.component.scss  # Enhanced styles
│   │       └── deadline-countdown.routes.ts       # Routing
│   ├── shared/
│   │   └── pipes/
│   │       ├── deadline-countdown.pipe.ts      # Custom time formatting pipe
│   │       └── index.ts                        # Pipe exports
│   ├── app.config.ts           # App configuration
│   └── app.routes.ts          # Main routing
├── proxy.conf.json            # Development proxy configuration
└── server.js                  # Mock API server
```

## Custom Pipe Usage

The `DeadlineCountdownPipe` provides two formatting options:

### Clock Format
```typescript
{{ 3665 | deadlineCountdown:'clock' }}
// Output: "01:01:05"

{{ 90061 | deadlineCountdown:'clock' }}
// Output: "1:01:01:01" (with days)
```

### Countdown Format
```typescript
{{ 3665 | deadlineCountdown:'countdown' }}
// Output: "1 hour, 1 minute, 5 seconds"

{{ 90061 | deadlineCountdown:'countdown' }}
// Output: "1 day, 1 hour, 1 minute, 1 second"

{{ 45 | deadlineCountdown:'countdown' }}
// Output: "45 seconds" (omits zero values)
```

## Customization

### Styling
The component uses SCSS with CSS custom properties. Key styling can be customized in `deadline-countdown.component.scss`:

- Color scheme: Update the gradient colors
- Typography: Modify font families and sizes  
- Responsive breakpoints: Adjust media queries
- Animation: Customize the pulse effect for urgent countdowns

### Pipe Behavior
Modify `DeadlineCountdownPipe` to customize:
- Time unit labels (singular/plural)
- Zero value handling
- Custom separators
- Additional formatting options

### API Integration
Update `DeadlineCountdownService` to integrate with your specific API:

```typescript
getDeadlineSeconds(): Observable<DeadlineCountdown> {
  return this.http.get<DeadlineCountdown>('your-api-endpoint');
}
```

## Technology Stack

- **Angular 21** - Latest Angular framework with standalone components
- **RxJS 7.8** - Reactive programming with observables
- **TypeScript 5.9** - Type-safe development  
- **SCSS** - Enhanced CSS with variables and mixins
- **Custom Pipes** - Reusable time formatting logic
- **Angular CLI** - Development tooling and build system
