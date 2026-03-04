import { useState, useEffect } from "react";
import { FileDown, Trash2, Calendar, Award, Filter, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface HistoryItem {
  id: string;
  nom: string;
  moyenne: number;
  date: string;
  type: "ECUE" | "UE" | "Semestre";
  statut?: string;
  devoirs?: number[];
  examen?: number;
  ecues?: Array<{ nom: string; moyenne: number; credits: number }>;
  ues?: Array<{ nom: string; moyenne: number; credits: number }>;
  totalCredits?: number;
}

export function HistoriquePage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<"Tous" | "ECUE" | "UE" | "Semestre">("Tous");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem("ecueHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      setHistory(parsed.sort((a: HistoryItem, b: HistoryItem) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem("ecueHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
    toast.success("Élément supprimé");
  };

  const clearAll = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tout l'historique ?")) {
      localStorage.removeItem("ecueHistory");
      setHistory([]);
      toast.success("Historique effacé");
    }
  };

  const exportToPDF = () => {
    if (history.length === 0) {
      toast.error("Aucune donnée disponible");
      return;
    }

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("MS - REATD", 14, 15);
    doc.setFontSize(12);
    doc.text("Historique des Résultats", 14, 22);
    doc.setFontSize(10);
    doc.text(`Date d'export: ${new Date().toLocaleDateString("fr-FR")}`, 14, 28);

    const filteredData = filter === "Tous" 
      ? history 
      : history.filter(item => item.type === filter);

    const tableData = filteredData.map(item => [
      item.nom,
      item.type,
      item.moyenne.toFixed(2),
      new Date(item.date).toLocaleDateString("fr-FR"),
      item.statut || (item.moyenne >= 10 ? "Validé" : "Non validé")
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Nom", "Type", "Moyenne", "Date", "Statut"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [155, 44, 155] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`historique_REATD_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Document PDF exporté");
  };

  const printHistory = () => {
    window.print();
  };

  const filteredHistory = filter === "Tous" 
    ? history 
    : history.filter(item => item.type === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Historique des Résultats</h1>
        <p className="text-muted-foreground text-lg">
          Consultez et exportez tous vos résultats sauvegardés
        </p>
      </div>

      {/* Controls Card */}
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          {/* Filters */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtrer par type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Tous", "ECUE", "UE", "Semestre"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-5 py-2.5 rounded-xl transition-all font-medium ${
                    filter === type
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToPDF}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl hover:shadow-lg hover:shadow-secondary/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={printHistory}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
            <button
              onClick={clearAll}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-xl hover:shadow-lg hover:shadow-destructive/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Tout supprimer
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl shadow-lg p-16 text-center">
          <div className="text-muted-foreground space-y-4 max-w-md mx-auto">
            <Award className="h-20 w-20 mx-auto opacity-20" />
            <h3 className="text-2xl font-semibold">Aucun résultat enregistré</h3>
            <p className="text-base">
              Calculez et sauvegardez vos moyennes ECUE, UE ou Semestre pour les voir apparaître ici
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-2">{item.nom}</h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${
                            item.type === "ECUE" ? "bg-primary/10 text-primary" :
                            item.type === "UE" ? "bg-secondary/10 text-secondary" :
                            "bg-accent/10 text-accent"
                          }`}>
                            {item.type}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(item.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                          {item.totalCredits && (
                            <span className="text-sm text-muted-foreground">
                              {item.totalCredits} crédits
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Details */}
                    {item.type === "ECUE" && item.devoirs && (
                      <div className="text-sm text-muted-foreground space-y-1 bg-muted/30 rounded-lg p-3">
                        <p><span className="font-semibold">Devoirs:</span> {item.devoirs.join(", ")} (Moyenne: {(item.devoirs.reduce((a, b) => a + b, 0) / item.devoirs.length).toFixed(2)})</p>
                        <p><span className="font-semibold">Examen:</span> {item.examen}</p>
                      </div>
                    )}

                    {item.type === "UE" && item.ecues && (
                      <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                        <p className="font-semibold mb-2">ECUE composantes:</p>
                        <ul className="space-y-1 ml-2">
                          {item.ecues.map((ecue, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              {ecue.nom}: {ecue.moyenne}/20 ({ecue.credits} crédits)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.type === "Semestre" && item.ues && (
                      <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                        <p className="font-semibold mb-2">UE composantes:</p>
                        <ul className="space-y-1 ml-2">
                          {item.ues.map((ue, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              {ue.nom}: {ue.moyenne}/20 ({ue.credits} crédits)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Result Display */}
                  <div className="flex flex-col items-center justify-center min-w-[180px] p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Moyenne
                    </p>
                    <p className="text-5xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                      {item.moyenne}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">/ 20</p>
                    
                    <div className={`mt-4 px-4 py-2 rounded-lg font-semibold text-sm ${
                      item.statut === "Admis" || (!item.statut && item.moyenne >= 10) ? "bg-secondary/10 text-secondary" :
                      item.statut === "Rattrapage" ? "bg-orange-500/10 text-orange-500" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {item.statut || (item.moyenne >= 10 ? "Validé" : "Non validé")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}