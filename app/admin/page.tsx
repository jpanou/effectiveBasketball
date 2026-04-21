import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAnalytics } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import {
  ViewsChart,
  SubscribersChart,
  RatingsChart,
} from "@/components/admin/AnalyticsCharts";

const typeHref: Record<string, string> = {
  article: "articles",
  tutorial: "tutorials",
  scouting: "scouting",
};

const typeLabel: Record<string, string> = {
  article: "Άρθρο",
  tutorial: "Tutorial",
  scouting: "Scouting",
};

function StarRow({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#F97316]">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-3.5 h-3.5 ${n <= score ? "text-[#F97316]" : "text-[#333]"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const {
    totalPosts,
    totalViews,
    subscribers,
    totalRatings,
    avgRating,
    topPosts,
    viewsSeries,
    subscribersSeries,
    ratingsSeries,
    recentReviews,
  } = await getAnalytics();

  const stats = [
    { label: "Δημοσιευμένες Αναρτήσεις", value: totalPosts.toLocaleString() },
    { label: "Συνολικές Προβολές", value: totalViews.toLocaleString() },
    { label: "Newsletter Subscribers", value: subscribers.toLocaleString() },
    { label: "Συνολικές Αξιολογήσεις", value: totalRatings.toLocaleString() },
    {
      label: "Μέση Αξιολόγηση",
      value: totalRatings === 0 ? "—" : avgRating.toFixed(2),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1
          className="text-3xl text-white mb-8"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ANALYTICS
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#111] border border-[#222] rounded-2xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">
                {stat.label}
              </p>
              <p
                className="text-3xl text-[#F97316]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <ViewsChart data={viewsSeries} />
          <SubscribersChart data={subscribersSeries} />
          <div className="lg:col-span-2">
            <RatingsChart data={ratingsSeries} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top posts table */}
          <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#222]">
              <h2
                className="text-lg text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                TOP ΑΝΑΡΤΗΣΕΙΣ ΜΕ ΒΑΣΗ ΤΙΣ ΠΡΟΒΟΛΕΣ
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-gray-500 text-xs uppercase">
                    <th className="text-left px-6 py-3">Τίτλος</th>
                    <th className="text-left px-6 py-3">Τύπος</th>
                    <th className="text-right px-6 py-3">Προβολές</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-[#1A1A1A] hover:bg-[#1A1A1A] transition-colors"
                    >
                      <td className="px-6 py-3 text-white">{post.title}</td>
                      <td className="px-6 py-3">
                        <span className="bg-[#F97316]/10 text-[#F97316] text-xs px-2 py-0.5 rounded-full capitalize">
                          {typeLabel[post.type] || post.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-gray-400">{post.views}</td>
                    </tr>
                  ))}
                  {topPosts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-600 text-sm">
                        Δεν υπάρχουν δεδομένα ακόμα
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent reviews */}
          <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#222]">
              <h2
                className="text-lg text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                ΠΡΟΣΦΑΤΕΣ ΑΞΙΟΛΟΓΗΣΕΙΣ
              </h2>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {recentReviews.length === 0 && (
                <p className="px-6 py-8 text-center text-gray-600 text-sm">
                  Δεν υπάρχουν αξιολογήσεις ακόμα
                </p>
              )}
              {recentReviews.map((r, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <a
                      href={`/${typeHref[r.post_type] ?? "articles"}/${r.post_slug}`}
                      className="block truncate text-white text-sm hover:text-[#F97316] transition-colors"
                    >
                      {r.post_title}
                    </a>
                    <p className="text-xs text-gray-600 mt-0.5">{formatDate(r.created_at)}</p>
                  </div>
                  <StarRow score={r.score} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
