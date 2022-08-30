import { MysticCodeView } from "./MysticCodeView";
import { ServantView } from "./ServantView";

export function PartyView() {
  return (
    <section className="flex">
      <div className="flex flex-col items-end">
        <div className="flex">
          <ServantView slot={0} />
          <ServantView slot={1} />
          <ServantView slot={2} />
        </div>
        <div className="flex w-full justify-between">
          <section className="border">
            <MysticCodeView />
          </section>
          <div className="flex">
            <ServantView mini slot={3} />
            <ServantView mini slot={4} />
            <ServantView mini slot={5} />
          </div>
        </div>
      </div>
    </section>
  );
}
