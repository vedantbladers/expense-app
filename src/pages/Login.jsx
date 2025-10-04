import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-8">
      <LoginForm />
      <SignupForm />
    </div>
  );
}