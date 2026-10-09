import Hero from "@/components/hero";
import { BestsellerStrip, Categories, Editorial, FullBleed, Lookbook, MatchingSets, NewIn, PillowRow, RangeByCategory, Services, Ticker } from "@/components/home";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Categories />
      <NewIn />
      <MatchingSets />
      <PillowRow />
      <Editorial />
      <BestsellerStrip />
      <FullBleed />
      <RangeByCategory />
      <Lookbook />
      <Services />
    </>
  );
}
