export const dynamic = "force-dynamic";

import { getTeamSettings } from "@/lib/db";
import MyTeamPage from "@/components/MyTeamPage";

export default async function MyTeamServerPage() {
  const settings = await getTeamSettings();
  return <MyTeamPage settings={settings} />;
}
