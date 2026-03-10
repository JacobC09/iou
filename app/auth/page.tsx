import AuthForm from "@/components/Auth/AuthForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Auth() {
    const user = await getSession();

    if (user) {
        redirect("/app")
    }

    return <AuthForm />
}