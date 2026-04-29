import Link from "next/link";
import Image from "next/image";

const pages = [
  { title: "Αρχική", href: "/" },
  { title: "Άρθρα", href: "/articles" },
  { title: "Tutorials", href: "/tutorials" },
  { title: "Scouting", href: "/scouting" },
  { title: "Χρήσιμα", href: "/xrisima" },
  { title: "My Team", href: "/myteam" },
  { title: "About Us", href: "/about" },
];

const externalLinks = [
  { title: "NBA", href: "https://www.nba.com/" },
  { title: "EuroLeague", href: "https://www.euroleaguebasketball.net/" },
  { title: "FIBA", href: "https://www.fiba.basketball/en" },
  { title: "ΕΣΑΚΕ", href: "https://www.esake.gr/" },
  { title: "Basket.gr", href: "https://www.basket.gr/" },
  { title: "ΕΣΚΑ", href: "https://eska.gr/" },
  { title: "ΣΕΠΚ", href: "https://sepk.gr/" },
];

const emails = [
  "ioannisgstratakos@protonmail.com",
  "basketball4you@protonmail.com",
  "scoutingreport4you@protonmail.com",
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/basketballcoach62",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ioannis_stratakos/",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/STRATAKOSIOANNI",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@i1962s",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ioannis-stratakos-40706551/",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@ioannisgstratakos?lang=el-GR",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@ioannis_stratakos",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M17.751 11.1a8.32 8.32 0 0 0-.316-.144c-.186-3.432-2.063-5.397-5.215-5.417h-.043c-1.885 0-3.452.804-4.418 2.269l1.733 1.188c.722-1.096 1.855-1.33 2.686-1.33h.029c1.034.007 1.815.307 2.321.893.368.427.614.999.733 1.721a13.6 13.6 0 0 0-3.021-.145c-3.037.176-4.989 1.947-4.858 4.408.067 1.249.689 2.322 1.752 3.022.899.592 2.057.881 3.26.814 1.589-.086 2.836-.692 3.707-1.801.661-.842 1.079-1.934 1.263-3.294.755.456 1.315 1.056 1.623 1.778.525 1.228.556 3.246-1.089 4.892-1.441 1.441-3.174 2.064-5.796 2.083-2.908-.022-5.108-.953-6.54-2.768C4.277 18.014 3.59 15.566 3.565 12c.025-3.566.713-6.014 2.043-7.277 1.432-1.815 3.631-2.746 6.54-2.768 2.93.022 5.168.957 6.652 2.781.728.894 1.277 2.019 1.638 3.332l2.047-.549c-.438-1.615-1.128-3.013-2.072-4.171C18.505 1.166 15.714.019 12.164 0h-.016c-3.541.019-6.298 1.17-8.195 3.423C2.245 5.416 1.414 8.195 1.383 11.95l-.001.05.001.05c.03 3.758.862 6.536 2.57 8.528C5.854 22.83 8.61 23.981 12.151 24h.015c3.147-.02 5.367-.85 7.196-2.68 2.39-2.39 2.319-5.383 1.529-7.226-.567-1.32-1.645-2.394-3.139-3.11Zm-5.423 5.398c-1.332.075-2.716-.523-2.784-1.799-.05-.946.675-2.002 2.867-2.129.251-.014.497-.021.739-.021.796 0 1.54.077 2.217.224-.253 3.155-1.734 3.66-3.039 3.725Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

          {/* Left: brand, description, socials */}
          <div className="flex flex-col gap-6 lg:w-2/5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/basketball-coach-logo-transparent.png"
                alt="Effective Basketball logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span
                className="text-lg text-white leading-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                <span className="text-[#F97316]">EFFECTIVE</span> BASKETBALL
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed">
              Μπασκετικό περιεχόμενο για παίκτες, προπονητές και οπαδούς του αθλήματος.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-gray-500 hover:text-[#F97316] transition-colors duration-150"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: pages + links + contact columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:flex lg:gap-16 lg:w-3/5 lg:justify-end">
            {/* Pages (left) */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#F97316] mb-5">
                Σελίδες
              </h3>
              <ul className="space-y-3">
                {pages.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-150"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links (middle) */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-[#F97316] mb-5">
                Links
              </h3>
              <ul className="space-y-3">
                {externalLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-150"
                    >
                      {l.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact (right) */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#F97316] mb-5">
                Επικοινωνία
              </h3>
              <ul className="space-y-3">
                {emails.map((email) => (
                  <li key={email}>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-150 break-all"
                    >
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#1A1A1A] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Effective Basketball. Όλα τα δικαιώματα διατηρούνται.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150">
              Πολιτική Απορρήτου
            </Link>
            <Link href="/cookie-policy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150">
              Πολιτική Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
