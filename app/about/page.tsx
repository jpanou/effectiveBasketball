"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1
            className="text-5xl md:text-7xl text-white mb-3"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            ABOUT US
          </h1>
          <div className="w-16 h-0.5 bg-[#F97316]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#222] shadow-2xl">
              <Image
                src="/assets/stratakos_pic.jpg"
                alt="Coach Ιωάννης Στρατάκος"
                width={600}
                height={700}
                className="w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p
                  className="text-2xl text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                >
                  ΙΩΑΝΝΗΣ Γ. ΣΤΡΑΤΑΚΟΣ
                </p>
                <p className="text-[#F97316] text-sm tracking-wide uppercase">Coach Καλαθοσφαίρισης Α&apos; Κατηγορίας</p>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h2
              className="text-3xl md:text-4xl text-[#F97316] mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              ΒΙΟΓΡΑΦΙΚΟ
            </h2>

            <div className="space-y-4 text-gray-300 text-sm leading-loose">
              <p>
                Ο coach Στρατάκος είναι πτυχιούχος, πιστοποιημένος προπονητής καλαθοσφαίρισης (Α&apos; κατηγορίας) απόφοιτος
                των σχολών της Γενικής Γραμματείας Αθλητισμού, με συνεχή και αδιάλειπτη προπονητική επιμόρφωση στα
                δρώμενα της εξέλιξης του αθλήματος.
              </p>
              <p>
                Ενεργό μέλος του Σ.Ε.Π.Κ. Σύνδεσμος Ελλήνων Προπονητών Καλαθοσφαίρισης από το 1995.
              </p>
              <p>
                Έχει διατελέσει προπονητής σε όλες τις αναπτυξιακές βαθμίδες αγοριών, κοριτσιών, υπεύθυνος ακαδημιών,
                καθώς επίσης πρώτος προπονητής σε συλλόγους ανδρών, γυναικών που συμμετείχαν σε εθνικές κατηγορίες,
                σε πανελλήνια &amp; τοπικά πρωταθλήματα.
              </p>
              <p>
                Συγκεκριμένα έχει συνεργαστεί με τους συλλόγους Κ.Α.Π. καλαθοσφαίριση Αγίας Παρασκευής, Γ.Σ.
                Χαλανδρίου, Λ.Φ.Μ. Αχαρνής, Γ.Σ. Κηφισιάς, Γ.Σ. Αγίας Παρασκευής, Φοίνικα Πειραιά, Α.Ο.Κ. Σπάτων,
                Α.Ο. Τριφυλλιακό Πολύδροσου, Α.Σ.Κ. Νέας Περάμου, Α.Ο. Άρης Πετρούπολης, Α.Ο. Χαραυγιακός, Α.Ο.
                Τρείς Αστέρες 89, Α.Ε. Ρέντη, Α.Σ. Κτησιφώντα Παιανίας, Α.Ο. Θρακομακεδόνων, Α.Ε.Κ.Τ. Αθλητική
                Ένωση Καλλιθέας Τζιτζιφιών, Α.Ο. Τρίτων, Φ.Ε.Α. 96, Γ.Σ. Παλλήνης, Γ.Σ. Εθνικού Πατησίων, Ε.Ο.Κ -
                Ε.Σ.Κ.Α. (τοπικός και περιφερειακός προπονητής).
              </p>
              <p>
                Για τον coach Στρατάκο το άθλημα της καλαθοσφαίρισης, καθώς επίσης και η προπονητική διαδικασία
                αποτελούν αναπόσπαστο κομμάτι της καθημερινότητάς του, η τριβή με τους αθλητές προσφέρει μια πλειάδα
                συναισθημάτων, συγκινήσεων, διαπροσωπικών σχέσεων και δυνατών αναμνήσεων που μένουν χαραγμένα στην
                μνήμη όλων των εμπλεκόμενων σε αυτά.
              </p>
            </div>

            {/* Stats highlights */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {[
                { value: "30+", label: "Χρόνια εμπειρίας" },
                { value: "1995", label: "Μέλος ΣΕΠΚ" },
                { value: "NL2", label: "Τρέχουσα κατηγορία" },
                { value: "Α'", label: "Πιστοποίηση" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#F97316]/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300"
                >
                  <p
                    className="text-3xl text-[#F97316]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
