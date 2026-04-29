import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Πολιτική Cookies | Basketball Coach",
  description: "Πολιτική χρήσης cookies για το basketballcoach.gr",
};

function CookieTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="border border-[#222] rounded-xl overflow-hidden mb-4">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex border-b border-[#1A1A1A] last:border-b-0">
          <span className="w-32 shrink-0 px-4 py-3 text-xs text-gray-500 bg-[#111] border-r border-[#1A1A1A]">
            {label}
          </span>
          <span className="px-4 py-3 text-xs text-gray-400 break-all">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F97316] text-sm mb-8 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Αρχική
        </Link>

        {/* Header */}
        <h1
          className="text-5xl md:text-6xl text-white mb-3"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΠΟΛΙΤΙΚΗ COOKIES
        </h1>
        <div className="w-16 h-0.5 bg-[#F97316] mb-4" />
        <p className="text-gray-500 text-sm mb-12">Τελευταία ενημέρωση: 28 Απριλίου 2026</p>

        <div className="space-y-8 text-gray-400 leading-relaxed">

          {/* Intro */}
          <p>
            Η παρούσα Πολιτική Cookies εξηγεί τον τρόπο με τον οποίο ο Coach Ιωάννης Γ. Στρατάκος
            (&quot;<strong className="text-white">Εμείς</strong>&quot;) χρησιμοποιεί cookies και παρόμοιες
            τεχνολογίες όταν επισκέπτεστε τον ιστότοπό μας στη διεύθυνση{" "}
            <a href="http://www.basketballcoach.gr" className="text-[#F97316] hover:underline" target="_blank" rel="noopener noreferrer">
              http://www.basketballcoach.gr
            </a>{" "}
            (&quot;<strong className="text-white">Ιστότοπος</strong>&quot;). Εξηγεί τι είναι αυτές οι
            τεχνολογίες και γιατί τις χρησιμοποιούμε, καθώς και τα δικαιώματά σας να ελέγχετε τη
            χρήση τους.
          </p>
          <p>
            Σε ορισμένες περιπτώσεις ενδέχεται να χρησιμοποιούμε cookies για τη συλλογή προσωπικών
            πληροφοριών ή πληροφοριών που καθίστανται προσωπικές όταν τις συνδυάσουμε με άλλα
            δεδομένα.
          </p>

          {/* Section 1 */}
          <section>
            <h2
              className="text-2xl text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΤΙ ΕΙΝΑΙ ΤΑ COOKIES;
            </h2>
            <p>
              Τα cookies είναι μικρά αρχεία δεδομένων που τοποθετούνται στον υπολογιστή ή στη
              φορητή σας συσκευή όταν επισκέπτεστε έναν ιστότοπο. Χρησιμοποιούνται ευρέως από
              ιδιοκτήτες ιστοτόπων για να κάνουν τους ιστοτόπους τους να λειτουργούν, ή να
              λειτουργούν πιο αποτελεσματικά, καθώς και για την παροχή πληροφοριών αναφοράς.
            </p>
            <p className="mt-3">
              Τα cookies που ορίζονται από τον ιδιοκτήτη του ιστοτόπου ονομάζονται &quot;cookies
              πρώτου μέρους&quot;. Τα cookies που ορίζονται από τρίτα μέρη ονομάζονται &quot;cookies
              τρίτων μερών&quot;. Τα cookies τρίτων μερών επιτρέπουν την παροχή λειτουργιών ή
              χαρακτηριστικών τρίτων μερών μέσω του ιστοτόπου (π.χ. διαφήμιση, διαδραστικό
              περιεχόμενο και αναλυτικά στοιχεία).
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="text-2xl text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΓΙΑΤΙ ΧΡΗΣΙΜΟΠΟΙΟΥΜΕ COOKIES;
            </h2>
            <p>
              Χρησιμοποιούμε cookies πρώτου και τρίτου μέρους για διάφορους λόγους. Ορισμένα
              cookies είναι απαραίτητα για τεχνικούς λόγους προκειμένου ο ιστότοπός μας να
              λειτουργεί, και τα αποκαλούμε &quot;βασικά&quot; ή &quot;απολύτως απαραίτητα&quot;
              cookies. Άλλα cookies μας επιτρέπουν επίσης να παρακολουθούμε και να στοχεύουμε τα
              ενδιαφέροντα των χρηστών μας ώστε να βελτιώνουμε την εμπειρία τους. Τρίτα μέρη
              παρέχουν cookies μέσω του ιστοτόπου μας για διαφήμιση, αναλυτικά στοιχεία και άλλους
              σκοπούς.
            </p>
          </section>

          {/* Section 3 — Control */}
          <section>
            <h2
              className="text-2xl text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΠΩΣ ΜΠΟΡΩ ΝΑ ΕΛΕΓΞΩ ΤΑ COOKIES;
            </h2>
            <p>
              Έχετε το δικαίωμα να αποφασίσετε εάν θα αποδεχτείτε ή θα απορρίψετε τα cookies.
              Μπορείτε να ασκήσετε τα δικαιώματά σας αποδεχόμενοι ή απορρίπτοντας τα cookies μέσω
              του banner ειδοποίησης cookies στον ιστότοπό μας. Εάν επιλέξετε να απορρίψετε τα
              cookies, μπορείτε να συνεχίσετε να χρησιμοποιείτε τον ιστότοπο, αν και η πρόσβασή
              σας σε ορισμένες λειτουργίες ενδέχεται να περιοριστεί.
            </p>
          </section>

          {/* Cookie Tables */}
          <section>
            <h2
              className="text-2xl text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΤΥΠΟΙ COOKIES ΠΟΥ ΧΡΗΣΙΜΟΠΟΙΟΥΜΕ
            </h2>

            <h3 className="text-[#F97316] text-sm font-semibold uppercase tracking-wider mb-3">
              Βασικά cookies ιστοτόπου
            </h3>
            <p className="text-sm mb-4">
              Αυτά τα cookies είναι απολύτως απαραίτητα για την παροχή υπηρεσιών μέσω του
              ιστοτόπου μας και για τη χρήση ορισμένων λειτουργιών του, όπως η πρόσβαση σε ασφαλείς
              περιοχές.
            </p>
            <CookieTable rows={[
              { label: "Όνομα", value: "__cf_bm" },
              { label: "Σκοπός", value: "Το Cloudflare τοποθετεί αυτό το cookie σε συσκευές τελικών χρηστών που έχουν πρόσβαση σε ιστότοπους πελατών που προστατεύονται από Bot Management." },
              { label: "Πάροχος", value: ".supabase.co" },
              { label: "Υπηρεσία", value: "CloudFlare" },
              { label: "Τύπος", value: "server_cookie" },
              { label: "Λήξη", value: "30 λεπτά" },
            ]} />

            <h3 className="text-[#F97316] text-sm font-semibold uppercase tracking-wider mb-3 mt-6">
              Cookies επιδόσεων και λειτουργικότητας
            </h3>
            <p className="text-sm mb-4">
              Αυτά τα cookies χρησιμοποιούνται για τη βελτίωση των επιδόσεων και της λειτουργικότητας
              του ιστοτόπου μας, αλλά δεν είναι απαραίτητα για τη χρήση του. Ωστόσο, χωρίς αυτά
              τα cookies, ορισμένες λειτουργίες (όπως τα βίντεο) ενδέχεται να μην είναι διαθέσιμες.
            </p>
            <CookieTable rows={[
              { label: "Όνομα", value: "VISITOR_PRIVACY_METADATA" },
              { label: "Σκοπός", value: "Αποθηκεύει την κατάσταση συγκατάθεσης για cookies του χρήστη." },
              { label: "Πάροχος", value: ".youtube.com" },
              { label: "Υπηρεσία", value: "YouTube" },
              { label: "Τύπος", value: "server_cookie" },
              { label: "Λήξη", value: "180 ημέρες" },
            ]} />
            <CookieTable rows={[
              { label: "Όνομα", value: "ytidb::LAST_RESULT_ENTRY_KEY" },
              { label: "Σκοπός", value: "Αποθηκεύει το τελευταίο κλειδί καταχώρισης αποτελέσματος που χρησιμοποιείται από το YouTube." },
              { label: "Πάροχος", value: "www.youtube.com" },
              { label: "Υπηρεσία", value: "YouTube" },
              { label: "Τύπος", value: "html_local_storage" },
              { label: "Λήξη", value: "Μόνιμο" },
            ]} />
            <CookieTable rows={[
              { label: "Όνομα", value: "__Secure-ROLLOUT_TOKEN" },
              { label: "Σκοπός", value: "Χρησιμοποιείται από το YouTube για τη σταδιακή κυκλοφορία νέων λειτουργιών." },
              { label: "Πάροχος", value: ".youtube.com" },
              { label: "Υπηρεσία", value: "YouTube" },
              { label: "Τύπος", value: "server_cookie" },
              { label: "Λήξη", value: "180 ημέρες" },
            ]} />

            <h3 className="text-[#F97316] text-sm font-semibold uppercase tracking-wider mb-3 mt-6">
              Cookies αναλυτικών στοιχείων και εξατομίκευσης
            </h3>
            <p className="text-sm mb-4">
              Αυτά τα cookies συλλέγουν πληροφορίες που χρησιμοποιούνται σε συγκεντρωτική μορφή για
              να μας βοηθήσουν να κατανοήσουμε πώς χρησιμοποιείται ο ιστότοπός μας.
            </p>
            <CookieTable rows={[
              { label: "Όνομα", value: "s7" },
              { label: "Σκοπός", value: "Συλλέγει δεδομένα σχετικά με τη χρήση του ιστοτόπου και τη συμπεριφορά των χρηστών." },
              { label: "Πάροχος", value: "www.youtube.com" },
              { label: "Υπηρεσία", value: "Adobe Analytics" },
              { label: "Τύπος", value: "html_local_storage" },
              { label: "Λήξη", value: "Μόνιμο" },
            ]} />

            <h3 className="text-[#F97316] text-sm font-semibold uppercase tracking-wider mb-3 mt-6">
              Cookies διαφήμισης
            </h3>
            <p className="text-sm mb-4">
              Αυτά τα cookies χρησιμοποιούνται για να καταστούν τα διαφημιστικά μηνύματα πιο
              σχετικά με εσάς.
            </p>
            <CookieTable rows={[
              { label: "Όνομα", value: "YSC" },
              { label: "Σκοπός", value: "Χρησιμοποιείται από την Google σε συνδυασμό με το SID για την επαλήθευση του λογαριασμού χρήστη Google και την τελευταία ώρα σύνδεσης." },
              { label: "Πάροχος", value: ".youtube.com" },
              { label: "Υπηρεσία", value: "YouTube" },
              { label: "Τύπος", value: "server_cookie" },
              { label: "Λήξη", value: "Λήξη συνεδρίας" },
            ]} />
            <CookieTable rows={[
              { label: "Όνομα", value: "VISITOR_INFO1_LIVE" },
              { label: "Σκοπός", value: "Χρησιμοποιείται από την Google σε συνδυασμό με το SID για την επαλήθευση του λογαριασμού χρήστη Google και στοχευμένη διαφήμιση." },
              { label: "Πάροχος", value: ".youtube.com" },
              { label: "Υπηρεσία", value: "YouTube" },
              { label: "Τύπος", value: "server_cookie" },
              { label: "Λήξη", value: "180 ημέρες" },
            ]} />

            <h3 className="text-[#F97316] text-sm font-semibold uppercase tracking-wider mb-3 mt-6">
              Μη ταξινομημένα cookies
            </h3>
            <p className="text-sm mb-4">
              Αυτά είναι cookies που δεν έχουν ακόμα κατηγοριοποιηθεί. Βρισκόμαστε στη διαδικασία
              κατηγοριοποίησής τους.
            </p>
            <CookieTable rows={[
              { label: "Όνομα", value: "__Secure-BUCKET" },
              { label: "Πάροχος", value: ".youtube.com" },
              { label: "Τύπος", value: "server_cookie" },
              { label: "Λήξη", value: "180 ημέρες" },
            ]} />
            <CookieTable rows={[
              { label: "Όνομα", value: "__Secure-YNID" },
              { label: "Πάροχος", value: ".youtube.com" },
              { label: "Τύπος", value: "http_cookie" },
              { label: "Λήξη", value: "180 ημέρες" },
            ]} />
          </section>

          {/* Browser controls */}
          <section>
            <h2
              className="text-2xl text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΠΩΣ ΜΠΟΡΩ ΝΑ ΕΛΕΓΞΩ COOKIES ΣΤΟ BROWSER ΜΟΥ;
            </h2>
            <p className="mb-4">
              Ο τρόπος με τον οποίο μπορείτε να απορρίψετε cookies μέσω των ρυθμίσεων του browser
              σας ποικίλλει από browser σε browser. Για περισσότερες πληροφορίες επισκεφθείτε το
              μενού βοήθειας του browser σας:
            </p>
            <ul className="space-y-2 ml-4">
              {[
                { label: "Chrome", href: "https://support.google.com/chrome/answer/95647" },
                { label: "Internet Explorer", href: "https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" },
                { label: "Firefox", href: "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" },
                { label: "Safari", href: "https://support.apple.com/en-ie/guide/safari/sfri11471/mac" },
                { label: "Edge", href: "https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" },
                { label: "Opera", href: "https://help.opera.com/en/latest/web-preferences/" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#F97316] hover:underline text-sm">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Tracking technologies */}
          <section>
            <h2
              className="text-2xl text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΤΙ ΓΙΝΕΤΑΙ ΜΕ ΑΛΛΕΣ ΤΕΧΝΟΛΟΓΙΕΣ ΠΑΡΑΚΟΛΟΥΘΗΣΗΣ;
            </h2>
            <p>
              Τα cookies δεν είναι ο μόνος τρόπος αναγνώρισης ή παρακολούθησης επισκεπτών σε έναν
              ιστότοπο. Ενδέχεται να χρησιμοποιούμε άλλες παρόμοιες τεχνολογίες από καιρό σε
              καιρό, όπως web beacons (γνωστά και ως &quot;tracking pixels&quot; ή &quot;clear
              gifs&quot;). Αυτά είναι μικροσκοπικά γραφικά αρχεία που περιέχουν ένα μοναδικό
              αναγνωριστικό που μας επιτρέπει να αναγνωρίζουμε όταν κάποιος έχει επισκεφθεί τον
              ιστότοπό μας ή έχει ανοίξει ένα email που τα περιέχει.
            </p>
          </section>

          {/* Targeted advertising */}
          <section>
            <h2
              className="text-2xl text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΠΑΡΕΧΕΤΕ ΣΤΟΧΕΥΜΕΝΗ ΔΙΑΦΗΜΙΣΗ;
            </h2>
            <p>
              Τρίτα μέρη ενδέχεται να παρέχουν cookies στον υπολογιστή σας μέσω του ιστοτόπου μας
              όταν επισκέπτεστε τον ιστότοπό μας. Αυτές οι εταιρείες ενδέχεται να χρησιμοποιούν
              πληροφορίες σχετικά με τις επισκέψεις σας σε αυτόν και άλλους ιστοτόπους για την
              παροχή διαφημίσεων σχετικών αγαθών και υπηρεσιών που ενδέχεται να σας ενδιαφέρουν.
              Εάν θέλετε να λάβετε περισσότερες πληροφορίες σχετικά με αυτήν την πρακτική και να
              μάθετε πώς μπορείτε να εξαιρεθείτε, επισκεφτείτε:{" "}
              <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#F97316] hover:underline">
                Digital Advertising Alliance
              </a>
              .
            </p>
          </section>

          {/* Footer note */}
          <div className="border-t border-[#222] pt-8 text-sm text-gray-600">
            <p>
              Για ερωτήσεις σχετικά με αυτή την πολιτική επικοινωνήστε μαζί μας.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
