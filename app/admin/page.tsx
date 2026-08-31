import { getDb } from "@/db";
import { guests } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminPage() {
  let allGuests: { id: string; name: string; companion: string | null; allowedGuests: number }[] = [];
  try {
    const db = getDb();
    allGuests = await db.select().from(guests);
  } catch {
    // DB não disponível localmente
  }

  async function addGuest(formData: FormData) {
    "use server";
    const db = getDb();
    
    const name = String(formData.get("name") || "").trim();
    const companion = String(formData.get("companion") || "").trim() || null;
    const allowedGuests = Number(formData.get("allowedGuests") || 1);

    if (!name) return;

    await db.insert(guests).values({
      id: crypto.randomUUID(),
      name,
      companion,
      allowedGuests,
    });

    revalidatePath("/admin");
  }

  return (
    <main className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Gestão de Convidados</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Adicionar Convidado</h2>
        <form action={addGuest} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nome do Convidado Principal</Label>
            <Input id="name" name="name" required placeholder="Ex: João Silva" />
          </div>
          <div>
            <Label htmlFor="companion">Nome do Acompanhante (Opcional)</Label>
            <Input id="companion" name="companion" placeholder="Ex: Maria Silva" />
          </div>
          <div>
            <Label htmlFor="allowedGuests">Número de Pessoas (1 ou 2)</Label>
            <Input id="allowedGuests" name="allowedGuests" type="number" min="1" max="2" defaultValue="1" required />
          </div>
          <Button type="submit" className="mt-2 w-full">Adicionar Convidado</Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Lista de Convidados ({allGuests.length})</h2>
        <ul className="divide-y divide-gray-100">
          {allGuests.map((guest) => (
            <li key={guest.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{guest.name}</p>
                {guest.companion && <p className="text-sm text-gray-500">& {guest.companion}</p>}
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                {guest.allowedGuests} {guest.allowedGuests === 1 ? "pessoa" : "pessoas"}
              </span>
            </li>
          ))}
          {allGuests.length === 0 && (
            <p className="text-gray-500 italic">Nenhum convidado adicionado ainda.</p>
          )}
        </ul>
      </div>
    </main>
  );
}
