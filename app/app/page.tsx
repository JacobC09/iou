import HeroHeader from "@/components/App/Hero";
import ContactView from "@/components/App/ContactList";

export default async function Home() {
    return (
        <>
            <HeroHeader />
            <ContactView />
        </>
    );
}
