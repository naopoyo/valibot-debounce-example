import { SignupForm } from '@/components/signup-form';

export default function Home() {
  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <div className="w-100">
        <SignupForm />
      </div>
    </div>
  );
}
