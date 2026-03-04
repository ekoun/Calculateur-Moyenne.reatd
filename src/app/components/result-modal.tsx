import { X, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  moyenne: number;
  type: "ECUE" | "UE" | "Semestre";
  statut?: string;
  totalCredits?: number;
  onSave?: () => void;
}

export function ResultModal({
  isOpen,
  onClose,
  moyenne,
  type,
  statut,
  totalCredits,
  onSave,
}: ResultModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatutConfig = () => {
    if (type === "Semestre" && statut) {
      if (statut === "Admis") {
        return {
          icon: CheckCircle2,
          color: "text-secondary",
          bg: "bg-secondary/10",
          label: statut,
        };
      }
      if (statut === "Rattrapage") {
        return {
          icon: AlertCircle,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
          label: statut,
        };
      }
      return {
        icon: XCircle,
        color: "text-destructive",
        bg: "bg-destructive/10",
        label: statut,
      };
    }

    return moyenne >= 10
      ? {
          icon: CheckCircle2,
          color: "text-secondary",
          bg: "bg-secondary/10",
          label: "Validé",
        }
      : {
          icon: XCircle,
          color: "text-destructive",
          bg: "bg-destructive/10",
          label: "Non validé",
        };
  };

  const config = getStatutConfig();
  const Icon = config.icon;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-card border-2 border-border rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
          {/* Header with close button */}
          <div className="relative p-6 pb-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 pt-4 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className={`${config.bg} p-4 rounded-2xl`}>
                <Icon className={`h-16 w-16 ${config.color}`} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Calcul terminé
              </h2>
              <p className="text-sm text-muted-foreground">
                Résultat de la moyenne {type}
              </p>
            </div>

            {/* Result Display */}
            <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-6 border border-border">
              <div className="text-center space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Moyenne {type}
                </p>
                <div className="relative">
                  <div className="text-6xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                    {moyenne.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground text-base mt-1">/ 20</p>
                </div>
                {totalCredits && (
                  <p className="text-sm text-muted-foreground pt-2 border-t border-border/50">
                    {totalCredits} crédits ECTS
                  </p>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <div className={`${config.bg} ${config.color} px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2`}>
                <Icon className="h-5 w-5" />
                {config.label}
              </div>
            </div>

            {/* Additional info for Rattrapage */}
            {statut === "Rattrapage" && (
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                <p className="text-sm text-orange-600 dark:text-orange-400 text-center font-medium">
                  Session de rattrapage requise
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-border p-6 space-y-3">
            {onSave && (
              <button
                onClick={() => {
                  onSave();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-secondary-foreground rounded-xl hover:shadow-lg hover:shadow-secondary/30 transition-all font-semibold"
              >
                Sauvegarder dans l'historique
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full px-6 py-3.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all font-semibold"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
