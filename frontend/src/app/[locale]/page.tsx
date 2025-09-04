import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";

export default function HomePage() {
  // Редирект с сохранением локали
  redirect(paths.accounts);
}
