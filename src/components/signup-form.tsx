'use client';

export function SignupForm() {
  return (
    <form className="flex flex-col gap-4">
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
          name="name"
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
        />
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
          name="email"
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
        />
      </label>

      <button
        type="submit"
        className={`
          rounded bg-blue-600 px-4 py-2 text-white
          hover:bg-blue-700
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          focus:outline-none
        `}
      >
        Sign Up
      </button>
    </form>
  );
}
