# Valibot Debounce Example

This is a Next.js example project demonstrating form validation with Valibot and debounced email availability checking.

## Features

- **Form Validation**: Uses Valibot for schema-based validation with React Hook Form
- **Debounced Checks**: Implements debounced API calls to check email availability
- **Real-time Feedback**: Provides immediate validation feedback as users type
- **TypeScript**: Fully typed with TypeScript
- **Tailwind CSS**: Styled with Tailwind CSS for responsive design

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Valibot](https://valibot.dev) - Schema validation library
- [React Hook Form](https://react-hook-form.com) - Form handling
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:naopoyo/valibot-debounce-example.git
   cd valibot-debounce-example
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the Development Server

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the signup form.

### Building for Production

Build the application:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Usage

The application includes a signup form with the following fields:

- **Name**: Required text field
- **Email**: Required email field with format validation and availability check

The email field performs a debounced check (500ms delay) against a mock API to verify if the email is available. Invalid emails (`example@example.com`, `test@example.com`) will show an error message.

## Project Structure

```text
src/
├── app/
│   ├── api/route.ts          # Mock API for email availability check
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page with signup form
├── components/
│   └── signup-form.tsx       # Signup form component
└── hooks/
    ├── use-debounce-check.ts # Custom hook for debounced checks
    └── use-signup-form.ts    # Form logic with validation
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm prettier` - Format code with Prettier
- `pnpm format` - Format and fix linting issues
