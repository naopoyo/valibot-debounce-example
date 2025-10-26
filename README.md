# Valibot Debounce Example

This is a Next.js example project demonstrating form validation with Valibot and a custom debounced validator hook for email availability checking.

## Features

- **Form Validation**: Uses Valibot for schema-based validation with React Hook Form
- **Debounced Validator Hook**: Custom `useDebouncedValidator` hook for debounced API calls with caching, error handling, and race condition prevention
- **Real-time Feedback**: Provides immediate validation feedback as users type
- **TypeScript**: Fully typed with TypeScript
- **Tailwind CSS**: Styled with Tailwind CSS for responsive design
- **Comprehensive Testing**: Unit tests with Vitest and coverage reporting

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Valibot](https://valibot.dev) - Schema validation library
- [React Hook Form](https://react-hook-form.com) - Form handling
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [Vitest](https://vitest.dev) - Unit testing framework

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
    ├── __test__/
    │   └── use-debounced-validator.test.ts # Unit tests for debounced validator hook
    ├── use-debounced-validator.ts      # Custom hook for debounced validation
    └── use-signup-form.ts              # Form logic with validation
docs/
└── test-review.md            # Test case review documentation
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests with Vitest
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm prettier` - Format code with Prettier
- `pnpm format` - Format and fix linting issues
- `pnpm ncu` - Check for dependency updates

## Testing

Run the test suite:

```bash
pnpm test
```

Generate coverage report:

```bash
pnpm test:coverage
```

The test suite covers the `useDebouncedValidator` hook with 23 test cases, including debounce behavior, caching, error handling, and edge cases. See `docs/test-review.md` for detailed test case reviews.
