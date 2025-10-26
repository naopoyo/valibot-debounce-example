'use client';

import useSignupForm from '@/hooks/use-signup-form';

export function SignupForm() {
  const form = useSignupForm();

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit((data) => console.log(data))}>
      <label className="flex flex-col gap-1">
        <span
          className={`
            text-sm font-medium text-zinc-700
            dark:text-zinc-300
          `}
        >
          Name
        </span>
        <input
          type="text"
          className={`
            rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900
            shadow-sm
            placeholder:text-zinc-400
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            focus:outline-none
            dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100
            dark:placeholder:text-zinc-500
          `}
          placeholder="Your Name"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <span className="text-red-500">{form.formState.errors.name.message}</span>
        )}
      </label>
      <label className="flex flex-col gap-1">
        <span
          className={`
            text-sm font-medium text-zinc-700
            dark:text-zinc-300
          `}
        >
          Email
        </span>
        <input
          type="email"
          className={`
            rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900
            shadow-sm
            placeholder:text-zinc-400
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            focus:outline-none
            dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100
            dark:placeholder:text-zinc-500
          `}
          placeholder="you@example.com"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <span className="text-red-500">{form.formState.errors.email.message}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={!form.formState.isValid || form.formState.isSubmitting}
        className={`
          rounded bg-blue-600 px-4 py-2 text-white
          hover:bg-blue-700
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          focus:outline-none
          disabled:cursor-not-allowed disabled:bg-blue-300
        `}
      >
        Sign Up
      </button>
    </form>
  );
}
