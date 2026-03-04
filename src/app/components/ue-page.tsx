import { useState } from "react";
import { Plus, Trash2, Calculator, Save } from "lucide-react";
import { toast } from "sonner";
import { ResultModal } from "./result-modal";

interface Ecue {
  id: string;
  nom: string;
  moyenne: number;
  credits: number;
}

export function UePage() {
  const [ecues, setEcues] = useState<Ecue[]>([
    { id: "1", nom: "", moyenne: 0, credits: 1 }
  ]);
  const [nomUe, setNomUe] = useState<string>("");
  const [moyenneUe, setMoyenneUe] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const calculateMoyenneUe = () => {
    if (ecues.every(e => !e.nom.trim() || e.moyenne === 0)) {
      toast.error("Veuillez entrer au moins une ECUE avec sa moyenne");
      return;
    }

    const totalCredits = ecues.reduce((sum, e) => sum + e.credits, 0);
    const moyennePonderee = ecues.reduce((sum, e) => sum + (e.moyenne * e.credits), 0);
    const moyenne = moyennePonderee / totalCredits;
    
    setMoyenneUe(Number(moyenne.toFixed(2)));
    setShowModal(true);
  };

  const addEcue = () => {
    const newId = (Math.max(...ecues.map(e => parseInt(e.id)), 0) + 1).toString();
    setEcues([...ecues, { id: newId, nom: "", moyenne: 0, credits: 1 }]);
  };

  const removeEcue = (id: string) => {
    if (ecues.length > 1) {
      setEcues(ecues.filter(e => e.id !== id));
    } else {
      toast.error("Vous devez avoir au moins une ECUE");
    }
  };

  const updateEcue = (id: string, field: keyof Ecue, value: string | number) => {
    setEcues(ecues.map(e => {
      if (e.id === id) {
        if (field === "moyenne") {
          return { ...e, [field]: Math.min(20, Math.max(0, Number(value))) };
        }
        if (field === "credits") {
          return { ...e, [field]: Math.max(1, Number(value)) };
        }
        return { ...e, [field]: value };
      }
      return e;
    }));
  };

  const saveToHistory = () => {
    if (moyenneUe === null || !nomUe.trim()) {
      toast.error("Veuillez calculer la moyenne et entrer un nom pour l'UE");
      return;
    }

    const history = JSON.parse(localStorage.getItem("ecueHistory") || "[]");
    history.push({
      id: Date.now().toString(),
      nom: nomUe,
      moyenne: moyenneUe,
      date: new Date().toISOString(),
      type: "UE",
      ecues: ecues.filter(e => e.nom.trim()).map(e => ({
        nom: e.nom,
        moyenne: e.moyenne,
        credits: e.credits
      })),
      totalCredits: ecues.reduce((sum, e) => sum + e.credits, 0)
    });
    localStorage.setItem("ecueHistory", JSON.stringify(history));
    toast.success("Calcul enregistré avec succès");
    
    setNomUe("");
    setEcues([{ id: "1", nom: "", moyenne: 0, credits: 1 }]);
    setMoyenneUe(null);
  };

  const totalCredits = ecues.reduce((sum, e) => sum + e.credits, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Calcul Moyenne UE</h1>
        <p className="text-muted-foreground text-lg">
          Calculez votre moyenne d'Unité d'Enseignement pondérée par les crédits
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-xl text-sm font-medium">
          <Calculator className="h-4 w-4" />
          Moyenne pondérée par les crédits ECTS
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Nom UE */}
          <div className="space-y-3">
            <label htmlFor="nomUe" className="block text-sm font-semibold text-foreground">
              Nom de l'UE
            </label>
            <input
              id="nomUe"
              type="text"
              value={nomUe}
              onChange={(e) => setNomUe(e.target.value)}
              placeholder="Ex: UE Informatique Fondamentale"
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Section ECUE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Liste des ECUE</h3>
              <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                Total: {totalCredits} crédits
              </div>
            </div>

            <div className="space-y-4">
              {ecues.map((ecue, index) => (
                <div key={ecue.id} className="group">
                  <div className="bg-muted/30 border border-border rounded-xl p-5 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">ECUE {index + 1}</h4>
                      {ecues.length > 1 && (
                        <button
                          onClick={() => removeEcue(ecue.id)}
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
                          Nom ECUE
                        </label>
                        <input
                          type="text"
                          value={ecue.nom}
                          onChange={(e) => updateEcue(ecue.id, "nom", e.target.value)}
                          placeholder="Nom de l'ECUE"
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
                          value={ecue.moyenne || ""}
                          onChange={(e) => updateEcue(ecue.id, "moyenne", parseFloat(e.target.value) || 0)}
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
                          max="10"
                          value={ecue.credits}
                          onChange={(e) => updateEcue(ecue.id, "credits", parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton Ajouter ECUE - EN DESSOUS */}
            <button
              onClick={addEcue}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 rounded-xl transition-all text-muted-foreground hover:text-secondary font-medium"
            >
              <Plus className="h-5 w-5" />
              Ajouter une ECUE
            </button>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateMoyenneUe}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold text-lg"
          >
            <Calculator className="h-5 w-5" />
            Calculer la moyenne UE
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {moyenneUe !== null && (
        <ResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          moyenne={moyenneUe}
          type="UE"
          totalCredits={totalCredits}
          onSave={saveToHistory}
        />
      )}
    </div>
  );
}