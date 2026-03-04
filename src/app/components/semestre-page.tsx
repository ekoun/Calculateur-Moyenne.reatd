import { useState } from "react";
import { Plus, Trash2, Calculator, Save } from "lucide-react";
import { toast } from "sonner";
import { ResultModal } from "./result-modal";

interface UE {
  id: string;
  nom: string;
  moyenne: number;
  credits: number;
}

export function SemestrePage() {
  const [ues, setUes] = useState<UE[]>([
    { id: "1", nom: "", moyenne: 0, credits: 1 }
  ]);
  const [nomSemestre, setNomSemestre] = useState<string>("");
  const [moyenneSemestre, setMoyenneSemestre] = useState<number | null>(null);
  const [statut, setStatut] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const calculateMoyenneSemestre = () => {
    if (ues.every(u => !u.nom.trim() || u.moyenne === 0)) {
      toast.error("Veuillez entrer au moins une UE avec sa moyenne");
      return;
    }

    const totalCredits = ues.reduce((sum, u) => sum + u.credits, 0);
    const moyennePonderee = ues.reduce((sum, u) => sum + (u.moyenne * u.credits), 0);
    const moyenne = moyennePonderee / totalCredits;
    
    setMoyenneSemestre(Number(moyenne.toFixed(2)));
    
    let newStatut = "";
    if (moyenne >= 10) {
      newStatut = "Admis";
    } else if (moyenne >= 8) {
      newStatut = "Rattrapage";
    } else {
      newStatut = "Ajourné";
    }
    setStatut(newStatut);
    setShowModal(true);
  };

  const addUe = () => {
    const newId = (Math.max(...ues.map(u => parseInt(u.id)), 0) + 1).toString();
    setUes([...ues, { id: newId, nom: "", moyenne: 0, credits: 1 }]);
  };

  const removeUe = (id: string) => {
    if (ues.length > 1) {
      setUes(ues.filter(u => u.id !== id));
    } else {
      toast.error("Vous devez avoir au moins une UE");
    }
  };

  const updateUe = (id: string, field: keyof UE, value: string | number) => {
    setUes(ues.map(u => {
      if (u.id === id) {
        if (field === "moyenne") {
          return { ...u, [field]: Math.min(20, Math.max(0, Number(value))) };
        }
        if (field === "credits") {
          return { ...u, [field]: Math.max(1, Number(value)) };
        }
        return { ...u, [field]: value };
      }
      return u;
    }));
  };

  const saveToHistory = () => {
    if (moyenneSemestre === null || !nomSemestre.trim()) {
      toast.error("Veuillez calculer la moyenne et entrer un nom pour le semestre");
      return;
    }

    const history = JSON.parse(localStorage.getItem("ecueHistory") || "[]");
    history.push({
      id: Date.now().toString(),
      nom: nomSemestre,
      moyenne: moyenneSemestre,
      date: new Date().toISOString(),
      type: "Semestre",
      statut: statut,
      ues: ues.filter(u => u.nom.trim()).map(u => ({
        nom: u.nom,
        moyenne: u.moyenne,
        credits: u.credits
      })),
      totalCredits: ues.reduce((sum, u) => sum + u.credits, 0)
    });
    localStorage.setItem("ecueHistory", JSON.stringify(history));
    toast.success("Calcul enregistré avec succès");
    
    setNomSemestre("");
    setUes([{ id: "1", nom: "", moyenne: 0, credits: 1 }]);
    setMoyenneSemestre(null);
    setStatut("");
  };

  const totalCredits = ues.reduce((sum, u) => sum + u.credits, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Calcul Moyenne Semestre</h1>
        <p className="text-muted-foreground text-lg">
          Calculez votre moyenne générale du semestre avec le statut académique
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-xl text-sm font-medium">
            ✓ Admis: ≥ 10/20
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-xl text-sm font-medium">
            ⚠ Rattrapage: 8-10/20
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
            ✗ Ajourné: &lt; 8/20
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Nom Semestre */}
          <div className="space-y-3">
            <label htmlFor="nomSemestre" className="block text-sm font-semibold text-foreground">
              Nom du Semestre
            </label>
            <input
              id="nomSemestre"
              type="text"
              value={nomSemestre}
              onChange={(e) => setNomSemestre(e.target.value)}
              placeholder="Ex: Semestre 1 - Année 2025/2026"
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Section UE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Liste des UE</h3>
              <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                Total: {totalCredits} crédits
              </div>
            </div>

            <div className="space-y-4">
              {ues.map((ue, index) => (
                <div key={ue.id} className="group">
                  <div className="bg-muted/30 border border-border rounded-xl p-5 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">UE {index + 1}</h4>
                      {ues.length > 1 && (
                        <button
                          onClick={() => removeUe(ue.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Nom UE
                        </label>
                        <input
                          type="text"
                          value={ue.nom}
                          onChange={(e) => updateUe(ue.id, "nom", e.target.value)}
                          placeholder="Nom de l'UE"
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Moyenne
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={ue.moyenne || ""}
                          onChange={(e) => updateUe(ue.id, "moyenne", parseFloat(e.target.value) || 0)}
                          placeholder="/ 20"
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Crédits ECTS
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={ue.credits}
                          onChange={(e) => updateUe(ue.id, "credits", parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton Ajouter UE - EN DESSOUS */}
            <button
              onClick={addUe}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 rounded-xl transition-all text-muted-foreground hover:text-secondary font-medium"
            >
              <Plus className="h-5 w-5" />
              Ajouter une UE
            </button>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateMoyenneSemestre}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold text-lg"
          >
            <Calculator className="h-5 w-5" />
            Calculer la moyenne du semestre
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {moyenneSemestre !== null && (
        <ResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          moyenne={moyenneSemestre}
          type="Semestre"
          statut={statut}
          totalCredits={totalCredits}
          onSave={saveToHistory}
        />
      )}
    </div>
  );
}