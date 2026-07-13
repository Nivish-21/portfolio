import { cases } from "@/lib/content";
import { Cover } from "@/components/sections/Cover";
import { Method } from "@/components/sections/Method";
import { Testimony } from "@/components/sections/Testimony";
import { EvidenceBoard } from "@/components/sections/EvidenceBoard";
import { Licence } from "@/components/sections/Licence";
import { Contact } from "@/components/sections/Contact";
import { CaseFile } from "@/components/case/CaseFile";
import { Tab } from "@/components/case/Tab";
import { InterrogationTerminal } from "@/components/sections/InterrogationTerminal";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <Cover />

      <main className="mx-auto w-full max-w-content px-5 pb-8">
        <Method />
        <Testimony />

        <section aria-labelledby="cases-heading">
          <Tab id="cases-heading">The case files</Tab>
          <div className="grid gap-4 pt-7">
            {cases.map((file) => (
              <CaseFile key={file.no} file={file} />
            ))}
          </div>
        </section>

        <EvidenceBoard />
        <Licence />
        <Contact />
      </main>

      <InterrogationTerminal />
    </div>
  );
}
