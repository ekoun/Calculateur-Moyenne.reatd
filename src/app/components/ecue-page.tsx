import { useState } from "react";
import { Plus, Trash2, Calculator, Save } from "lucide-react";
import { toast } from "sonner";
import { ResultModal } from "./result-modal";

interface Devoir {
  id: string;
  note: number;
}

export function EcuePage() {
  const [devoirs, setDevoirs] = useState<Devoir[]>([{ id: "1", note: 0 }]);
  const [noteExamen, setNoteExamen] = useState<number>(0);
  const [moyenneEcue, setMoyenneEcue] = useState<number | null>(null);
  const [nomEcue, setNomEcue] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const calculateMoyenne = () => {
    if (devoirs.length === 0 || devoirs.every(d => d.note === 0) && noteExamen === 0) {
      toast.error("Veuillez entrer au moins une note");
      return;
    }

    const sommeDevoirs = devoirs.reduce((sum, d) => sum + d.note, 0);
    const moyenneDevoirs = sommeDevoirs / devoirs.length;
    const moyenne = (moyenneDevoirs * 0.4) + (noteExamen * 0.6);
    setMoyenneEcue(Number(moyenne.toFixed(2)));
    setShowModal(true);
  };

  const addDevoir = () => {
    const newId = (Math.max(...devoirs.map(d => parseInt(d.id)), 0) + 1).toString();
    setDevoirs([...devoirs, { id: newId, note: 0 }]);
  };

  const removeDevoir = (id: string) => {
    if (devoirs.length > 1) {
      setDevoirs(devoirs.filter(d => d.id !== id));
    } else {
      toast.error("Vous devez avoir au moins un devoir");
    }
  };

  const updateDevoir = (id: string, note: number) => {
    setDevoirs(devoirs.map(d => d.id === id ? { ...d, note: Math.min(20, Math.max(0, note)) } : d));
  };

  const saveToHistory = () => {
    if (moyenneEcue === null || !nomEcue.trim()) {
      toast.error("Veuillez calculer la moyenne et entrer un nom pour l'ECUE");
      return;
    }

    const history = JSON.parse(localStorage.getItem("ecueHistory") || "[]");
    history.push({
      id: Date.now().toString(),
      nom: nomEcue,
      moyenne: moyenneEcue,
      date: new Date().toISOString(),
      type: "ECUE",
      devoirs: devoirs.map(d => d.note),
      examen: noteExamen
    });
    localStorage.setItem("ecueHistory", JSON.stringify(history));
    toast.success("Calcul enregistré avec succès");
    
    setNomEcue("");
    setDevoirs([{ id: "1", note: 0 }]);
    setNoteExamen(0);
    setMoyenneEcue(null);
  };

  const moyenneDevoirs = devoirs.reduce((sum, d) => sum + d.note, 0) / devoirs.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Calcul Moyenne ECUE</h1>
        <p className="text-muted-foreground text-lg">
          Calculez automatiquement votre moyenne ECUE selon le système LMD
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium">
          <Calculator className="h-4 w-4" />
          Formule : (Moyenne devoirs × 0,4) + (Note examen × 0,6)
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Nom ECUE */}
          <div className="space-y-3">
            <label htmlFor="nomEcue" className="block text-sm font-semibold text-foreground">
              Nom de l'ECUE
            </label>
            <input
              id="nomEcue"
              type="text"
              value={nomEcue}
              onChange={(e) => setNomEcue(e.target.value)}
              placeholder="Ex: Programmation Web Avancée"
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Section Devoirs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Notes de Devoirs</h3>
              <div className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-sm font-semibold">
                Moyenne: {moyenneDevoirs.toFixed(2)} / 20
              </div>
            </div>

            <div className="space-y-3">
              {devoirs.map((devoir, index) => (
                <div key={devoir.id} className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-28 px-3 py-2.5 bg-muted rounded-lg">
                    <span className="text-sm font-semibold text-muted-foreground">Devoir {index + 1}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={devoir.note || ""}
                    onChange={(e) => updateDevoir(devoir.id, parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Note sur 20"
                  />
                  {devoirs.length > 1 && (
                    <button
                      onClick={() => removeDevoir(devoir.id)}
                      className="p-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Bouton Ajouter Devoir - EN DESSOUS */}
            <button
              onClick={addDevoir}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 rounded-xl transition-all text-muted-foreground hover:text-secondary font-medium"
            >
              <Plus className="h-5 w-5" />
              Ajouter un devoir
            </button>
          </div>

          {/* Note Examen */}
          <div className="space-y-3">
            <label htmlFor="noteExamen" className="block text-sm font-semibold text-foreground">
              Note d'Examen
            </label>
            <input
              id="noteExamen"
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={noteExamen || ""}
              onChange={(e) => setNoteExamen(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Note sur 20"
            />
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateMoyenne}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold text-lg"
          >
            <Calculator className="h-5 w-5" />
            Calculer la moyenne ECUE
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {moyenneEcue !== null && (
        <ResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          moyenne={moyenneEcue}
          type="ECUE"
          onSave={saveToHistory}
        />
      )}
    </div>
  );
}