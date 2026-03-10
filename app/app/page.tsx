import HeroHeader from "@/components/App/Hero";
import ContactList from "@/components/Contact/ContactList";

export default async function Home() {
    return (
        <>
            <HeroHeader />
            <ContactList />
        </>
    );
}
