import { clients } from "@/data/clients";

function Logo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex h-24 items-center justify-center border border-border bg-background p-4 xl:h-28">
      <img
        src={logo}
        alt={`${name} logo`}
        loading="lazy"
        decoding="async"
        width={160}
        height={64}
        className="h-14 w-full object-contain xl:h-16"
      />
    </div>
  );
}

export function ClientLogos() {
  return (
    <section aria-labelledby="clients-heading">
      <div className="mx-auto site-container px-5 py-24 lg:px-8">
        <p className="eyebrow">04 / Our clients</p>
        <h2 id="clients-heading" className="mt-5 type-h2">
          Trusted by Industry Leaders
        </h2>
        <p className="mt-4 type-lead">Proud to work with companies across industries.</p>
      </div>
      <div className="client-marquee -mt-12 pb-24" tabIndex={0} aria-label="Client logos">
        <ul className="client-marquee-track">
          {clients.map((c) => (
            <li key={c.logo} className="w-40 shrink-0 sm:w-48 lg:w-56">
              <Logo {...c} />
            </li>
          ))}
          {clients.map((c) => (
            <li
              key={`d-${c.logo}`}
              aria-hidden="true"
              className="client-marquee-dup w-40 shrink-0 sm:w-48 lg:w-56"
            >
              <Logo {...c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
